import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { MemoryRouter } from 'react-router-dom';
import { buildOrderTraceUrl } from '../src/components/Orders/orderTraceUrl.js';
import { resolveProductImage } from '../src/components/QR/productImage.js';
import { buildLotLabelDocument, labelQr } from '../src/components/Stock/lotLabelPrint.js';

let server, Modal, api, http;
const unitId = 'ae08178a-e8f0-4c52-8ed8-8fb7d1d54796';
const batchId = '623154d0-3f86-439b-8f4b-cc6a53e478ba';
const store = new Map();
const previous = { window: globalThis.window, document: globalThis.document, localStorage: globalThis.localStorage };

before(async () => {
  globalThis.window = { location: { pathname: '/orders' } };
  globalThis.document = { body: {} };
  globalThis.localStorage = { getItem: (key) => store.get(key) ?? null };
  server = await createServer({
    configFile: false, appType: 'custom',
    cacheDir: '/tmp/mbh-order-trace-vite-test',
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, entries: [] },
    ssr: { noExternal: ['react-dom'] },
    plugins: [{
      name: 'trace-ui-fixtures', enforce: 'pre',
      resolveId(id) { if (id === 'react-dom') return '\0trace-test-portal'; },
      load(id) {
        if (id === '\0trace-test-portal') return 'export const createPortal = (children) => children;';
        if (id.endsWith('/hooks/useReadQuery.js')) return 'export const useReadQuery = ({scopeKey}) => ({loading:false,error:"",refetch:()=>{},...globalThis.__orderTraceQueries[scopeKey[0]]});';
      },
    }],
  });
  Modal = (await server.ssrLoadModule('/src/components/Orders/OrderProductTraceModal.jsx')).default;
  api = (await server.ssrLoadModule('/src/api/productionTraceApi.js')).productionTraceApi;
  http = (await server.ssrLoadModule('/src/api/axiosConfig.js')).default;
});

after(async () => {
  await server?.close();
  Object.assign(globalThis, previous);
  delete globalThis.__orderTraceQueries;
});

const page = (data, total = data.length) => ({ data, total, page: 1, size: 20 });
function fixtures() {
  globalThis.__orderTraceQueries = {
    'order-product-trace': { data: { orderId: 'order', orderNumber: 1005, orderedQuantity: 1, batches: page([{ batchId, unitCount: 1, productionStatus: 'COMPLETED' }]) } },
    'production-labels': { data: page([{ unitId, batchId, serial: 1, status: 'READY', qrPayload: `MBH:UNIT:${unitId}`, expiresAt: '2026-10-20T10:00:00Z' }]) },
    'production-batch': { data: { batchId, traceabilityComplete: true, actualQuantity: 1, startedAt: '2026-10-20T02:00:00Z', readyAt: '2026-10-20T02:30:00Z', expiresAt: '2026-10-20T10:00:00Z', completedAt: '2026-10-20T02:31:00Z', inputs: [{ lotId: 'lot-pork', usedQuantity: 40, wasteQuantity: 0, returnedQuantity: 0, consumedQuantity: 40, origin: { product: { name: 'Chả', unit: 'g' }, lot: { code: 'LO-CHA', expiresAt: '2026-10-27' }, origin: { supplier: { name: 'Nhà cung cấp A' }, receiptCode: 'NK1005', purchasedAt: '2026-10-19T01:00:00Z' } } }] } },
  };
}
const render = () => renderToStaticMarkup(React.createElement(Modal, { orderId: 'order', productId: 'dish', productName: 'Bánh mì', onClose() {} }));

test('renders the exact unit, batch ingredient amount, lot and supplier chain in the order modal', () => {
  fixtures();
  const html = render();
  for (const text of ['Đơn 1005', 'Serial 1', unitId, 'MBH:UNIT:', 'Chả', '40', 'LO-CHA', 'Nhà cung cấp A', 'NK1005', 'toàn mẻ']) assert.ok(html.includes(text), text);
  assert.ok(html.includes('/warehouse/trace?lotId=lot-pork'));
});

test('shows all four lifecycle timestamps and keeps input receipt dates per lot', () => {
  fixtures();
  globalThis.__orderTraceQueries['production-batch'].data.inputs.push({ lotId: 'lot-veg', origin: { product: { name: 'Rau' }, lot: { code: 'LO-RAU' }, origin: { receivedAt: '2026-10-20T00:00:00Z' } } });
  const html = render();
  for (const text of ['In stock', 'Make', 'Ready', 'Expired at', 'LO-CHA', 'LO-RAU']) assert.ok(html.includes(text), text);
  for (const instant of ['2026-10-19T01:00:00Z', '2026-10-20T00:00:00Z', '2026-10-20T02:00:00Z', '2026-10-20T02:30:00Z', '2026-10-20T10:00:00Z'])
    assert.ok(html.includes(new Date(instant).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })), instant);
});

test('does not infer trace data for an order without linked production', () => {
  fixtures();
  globalThis.__orderTraceQueries['order-product-trace'].data.batches = page([]);
  const html = render();
  assert.ok(html.includes('chưa có mẻ chế biến'));
  assert.ok(!html.includes(unitId));
  assert.ok(!html.includes('Nhà cung cấp A'));
});

test('shows unavailable serials and missing lot history without inventing origin', () => {
  fixtures();
  globalThis.__orderTraceQueries['production-labels'].data = page([]);
  Object.assign(globalThis.__orderTraceQueries['production-batch'].data, { inputs: [], traceabilityComplete: false });
  const html = render();
  assert.ok(html.includes('Mẻ chưa tạo thành phẩm có serial'));
  assert.ok(html.includes('Chưa ghi nhận lô nguyên liệu'));
  assert.ok(!html.includes('Nhà cung cấp A'));
});

test('preserves paginated metadata through the real axios interceptor and wrapped/unwrapped API responses', async () => {
  for (const wrapped of [true, false]) {
    http.defaults.adapter = async (config) => ({
      config, status: 200, statusText: 'OK', headers: {},
      data: wrapped ? { success: true, data: { ...page([{ unitId, serial: 21 }], 45), page: 2 } } : { ...page([{ unitId, serial: 21 }], 45), page: 2 },
    });
    const labels = await api.getLabels(batchId, 2);
    assert.equal(labels.data[0].unitId, unitId);
    assert.equal(labels.total, 45);
    assert.equal(labels.page, 2);
  }
  const payload = { orderId: 'order', batches: page([{ batchId }]) };
  http.defaults.adapter = async (config) => ({ config, status: 200, statusText: 'OK', headers: {}, data: { success: true, data: payload } });
  assert.deepEqual(await api.getOrderProduct('order', 'dish', 1), payload);
});

test('finished-product QR opens the public photo page while printed labels contain only name and QR', async () => {
  fixtures();
  const url = buildOrderTraceUrl({
    productName: 'Cơm thịt kho trứng',
    productImage: 'https://images.example.com/com-thit.jpg?version=2&size=large',
    batch: globalThis.__orderTraceQueries['production-batch'].data,
    unit: globalThis.__orderTraceQueries['production-labels'].data.data[0],
  });
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://fe.admin.kidocanteen.kidoedu.vn');
  assert.equal(parsed.pathname, '/qr');
  assert.equal(parsed.searchParams.get('id'), unitId);
  assert.equal([...parsed.searchParams].length, 1);
  assert.equal(parsed.hash, '');
  const label = buildLotLabelDocument({ productName: 'Cơm thịt kho trứng', labelPayload: url, quantity: 1 });
  assert.ok(label.includes(labelQr(url)));
  assert.ok(!label.includes('<img'));
  globalThis.__orderTraceQueries['qr-trace'] = { data: {
    type: 'FINISHED_GOOD', unit: { id: unitId, serial: 1 },
    product: { name: 'Cơm thịt kho trứng' }, imageUrl: 'https://images.example.com/com-thit.jpg?version=2&size=large',
    lifecycle: { readyAt: '2026-10-20T02:30:00Z', completedAt: '2026-10-20T02:31:00Z' },
  } };
  const Trace = (await server.ssrLoadModule('/src/pages/QR/Trace.jsx')).default;
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [parsed.pathname + parsed.search] }, React.createElement(Trace)));
  assert.ok(html.includes('src="https://images.example.com/com-thit.jpg?version=2&amp;size=large"'));
  assert.ok(!html.includes('comthitkhotrung.jpg'));
  assert.ok(html.includes('Cơm thịt kho trứng'));
  assert.ok(html.includes('20/10/2026 09:30:00'));
  assert.ok(html.includes('20/10/2026 09:31:00'));
  assert.ok(html.includes('Serial: 1'));
});

test('previously printed snapshot QR remains readable and hides ingredient lot codes', async () => {
  const params = new URLSearchParams({ name: 'Bánh mì', serial: '2', stock: 'Chả (LO-A): 19/10/2026 08:00:00\nRau (LO-B): 19/10/2026 08:00:00\nNguyên liệu (LO-C): —' });
  const url = `https://site.example/qr#${params}`;
  const parsed = new URL(url);
  const ProductTrace = (await server.ssrLoadModule('/src/pages/QR/ProductTrace.jsx')).default;
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [parsed.pathname + parsed.hash] }, React.createElement(ProductTrace)));
  assert.ok(html.includes('Chưa có hình ảnh sản phẩm'));
  for (const text of ['Chả', 'Rau', 'Nguyên liệu', 'Chưa ghi nhận', 'Completed', 'Expired']) assert.ok(html.includes(text), text);
  for (const code of ['LO-A', 'LO-B', 'LO-C']) assert.ok(!html.includes(code), code);
  assert.ok(labelQr(url).includes('<svg'));
});

test('lot trace page displays the product photo or placeholder and only lot milestones, with or without serial', async () => {
  const ProductTrace = (await server.ssrLoadModule('/src/pages/QR/ProductTrace.jsx')).default;
  for (const withPhoto of [true, false]) {
    const params = new URLSearchParams({ type: 'lot', name: 'Thịt bò', lot: 'LOT-001',
      manufactured: '19/10/2026 (chưa có giờ)', stock: '20/10/2026 08:30:00', expires: '21/10/2026 17:00:00',
    });
    if (withPhoto) { params.set('image', 'https://images.example.com/beef.jpg'); params.set('serial', 'SERIAL-1'); }
    const url = new URL(`https://site.example/qr#${params}`);
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [url.pathname + url.hash] }, React.createElement(ProductTrace)));
    for (const text of ['Thịt bò', 'Lô: LOT-001', 'Ngày sản xuất', '19/10/2026', '20/10/2026 08:30:00', '21/10/2026 17:00:00']) assert.ok(html.includes(text), text);
    assert.ok(!html.includes('Bắt đầu chế biến'));
    assert.ok(!html.includes('Mã QR không có thông tin'));
    if (withPhoto) {
      assert.ok(html.includes('src="https://images.example.com/beef.jpg"'));
      assert.ok(html.includes('Serial: SERIAL-1'));
    } else {
      assert.ok(html.includes('Ảnh thay thế sản phẩm'));
      assert.ok(!html.includes('Serial:'));
    }
  }
});

test('QR uses the current local or LAN website when printing during local testing', () => {
  const previousLocation = globalThis.window.location;
  try {
    for (const origin of ['http://localhost:5173', 'http://192.168.1.20:5173']) {
      globalThis.window.location = { origin };
      const url = new URL(buildOrderTraceUrl({ unit: { unitId, serial: 2 } }));
      assert.equal(url.origin, origin);
      assert.equal(url.pathname, '/qr');
    }
  } finally {
    globalThis.window.location = previousLocation;
  }
});

test('order QR requires the finished unit ID and never substitutes a product, batch or serial ID', () => {
  for (const unit of [{ serial: 1 }, { batchId, serial: 1 }, { id: unitId }, { unitId: '' }]) {
    assert.throws(() => buildOrderTraceUrl({ unit }), /mã thành phẩm/);
  }
  const parsed = new URL(buildOrderTraceUrl({ origin: 'http://localhost:5173', unit: { unitId, batchId, serial: 1 } }));
  assert.equal(parsed.href, `http://localhost:5173/qr?id=${unitId}`);
});

test('resolves uploaded product image paths and rejects non-web image URLs', () => {
  assert.equal(resolveProductImage('/uploads/banh-mi.jpg', 'https://api.example.com'), 'https://api.example.com/uploads/banh-mi.jpg');
  assert.equal(resolveProductImage('uploads/banh-mi.jpg', 'https://api.example.com/'), 'https://api.example.com/uploads/banh-mi.jpg');
  for (const value of ['', null, 'javascript:alert(1)', 'data:image/png;base64,AAAA', 'file:///photo.jpg']) {
    assert.equal(resolveProductImage(value), '');
  }
});

test('public trace page does not render an unsupported image URL from a QR', async () => {
  const ProductTrace = (await server.ssrLoadModule('/src/pages/QR/ProductTrace.jsx')).default;
  const params = new URLSearchParams({ name: 'Bánh mì', serial: '2', image: 'javascript:alert(1)' });
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/truyxuat#${params}`] }, React.createElement(ProductTrace)));
  assert.ok(html.includes('Chưa có hình ảnh sản phẩm'));
  assert.ok(html.includes('alt="Ảnh thay thế sản phẩm"'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('Serial: 2'));
});

test('warehouse navigation keeps lots and trace without a QR tab', async () => {
  const StockHeader = (await server.ssrLoadModule('/src/components/Stock/StockHeader.jsx')).default;
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(StockHeader, { activeTab: 'lots' })));
  assert.ok(html.includes('href="/stock-lots"'));
  assert.ok(html.includes('href="/warehouse/trace"'));
  assert.ok(!html.includes('href="/warehouse/qr"'));
});

test('public QR API requests only the data used by the product card', async () => {
  const { stockTraceApi } = await server.ssrLoadModule('/src/api/stockTraceApi.js');
  let request;
  const data = { product: { name: 'Thịt bò' }, lot: { id: unitId } };
  http.defaults.adapter = async (config) => {
    request = config;
    return { config, status: 200, statusText: 'OK', headers: {}, data: { data } };
  };
  assert.deepEqual(await stockTraceApi.getFull(unitId), data);
  assert.equal(request.url, '/stock-trace/full');
  assert.deepEqual(request.params, { lotId: unitId, includeMovements: false, includeConsumption: false, includeRecipe: false, includeTimeline: false });
});

test('received portions show handed-over status instead of expired while retaining the recorded expiry', () => {
  fixtures();
  const portion = globalThis.__orderTraceQueries['production-labels'].data.data[0];
  portion.status = 'HANDED_OVER';
  portion.handover = { deliveredAt: '2026-10-20T03:00:00Z' };
  const html = render();
  assert.ok(html.includes('Đã bàn giao'));
  assert.ok(html.includes('Hạn sử dụng ghi nhận'));
  assert.ok(!html.includes('Hết hạn'));
});
