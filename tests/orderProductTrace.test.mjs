import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

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
