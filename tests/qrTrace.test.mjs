import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTraceInput, traceErrorMessage } from '../src/components/QR/traceInput.js';
import { fullTraceModel } from '../src/components/QR/fullTraceModel.js';
import { buildLotTraceUrl } from '../src/components/QR/lotTraceUrl.js';
import { buildLotLabelDocument, labelQr } from '../src/components/Stock/lotLabelPrint.js';
import { buildTraceQrExport } from '../src/components/QR/traceQrExport.js';

const lotId = 'ae08178a-e8f0-4c52-8ed8-8fb7d1d54796';

test('search accepts exact lot UUIDs, QR URLs, JSON and labelled lot UUIDs', () => {
  for (const input of [lotId, `  ${lotId}  `, `https://site.example/trace?id=${lotId}`, `/warehouse/qr?lotId=${lotId}`,
    `https://site.example/truyxuat#lotId=${lotId}`, JSON.stringify({ lotId }), `Lô: ${lotId}`]) {
    assert.equal(parseTraceInput(input).lotId, lotId, input);
  }
  for (const input of ['', 'two words', 'https://site.example/', `javascript:alert('${lotId}')`, '<script>alert(1)</script>']) {
    assert.throws(() => parseTraceInput(input), /UUID/, input);
  }
});

test('search accepts lot codes as documented by Swagger', () => {
  const code = 'DEMO-TRACE-20261019-HEO-SAP-HET-HAN';
  for (const input of [code, `/trace?id=${code}`, JSON.stringify({ lotId: code }), `Lô: ${code}`]) {
    assert.equal(parseTraceInput(input).lotId, code);
  }
});

test('previous QR snapshots remain readable without treating serials as lot IDs', () => {
  const params = new URLSearchParams({ name: 'Thịt bò', serial: 'SERIAL-1', stock: '27/10/2026' });
  const parsed = parseTraceInput(`https://site.example/truyxuat#${params}`);
  assert.equal(parsed.lotId, undefined);
  assert.equal(new URLSearchParams(parsed.snapshot).get('name'), 'Thịt bò');
});

test('new lot labels open /trace using the database lot ID and keep serials distinct', () => {
  const payload = (serial) => buildLotTraceUrl({ origin: 'http://localhost:5173', lotId, serial });
  const url = new URL(payload('SERIAL-1'));
  assert.equal(url.pathname, '/trace');
  assert.equal(url.searchParams.get('id'), lotId);
  assert.equal(url.searchParams.get('serial'), 'SERIAL-1');
  assert.equal(parseTraceInput(url.href).lotId, lotId);
  const html = buildLotLabelDocument({ productName: 'Thịt bò', quantity: 2, serials: ['SERIAL-1', 'SERIAL-2'], labelPayload: payload });
  assert.ok(html.includes(labelQr(payload('SERIAL-1'))));
  assert.ok(html.includes(labelQr(payload('SERIAL-2'))));
});

test('full trace uses recorded lot dates, photo and origin without inventing production dates', () => {
  const model = fullTraceModel({
    product: { name: 'Thịt bò', code: 'BO', imageUrl: 'https://images.example/beef.jpg' },
    lot: { id: lotId, code: 'LOT-001', manufacturedAt: '2026-10-26', expiresAt: '2026-10-30' },
    origin: { receivedAt: '2026-10-27T01:30:00Z', supplier: { name: 'Nhà cung cấp A' } },
    movements: [{ id: 'movement', quantity: 5 }],
  }, lotId);
  assert.equal(model.params.get('name'), 'Thịt bò');
  assert.equal(model.params.get('image'), 'https://images.example/beef.jpg');
  assert.equal(model.params.get('stock'), '27/10/2026 08:30:00');
  assert.equal(model.params.get('type'), 'lot');
  assert.equal(model.params.has('make'), false);
  assert.equal(model.supplierName, 'Nhà cung cấp A');
  assert.equal(model.movements.length, 1);
  assert.equal(fullTraceModel(null, lotId), null);
  assert.equal(fullTraceModel({}, lotId), null);
});

test('production milestones use the linked batch only', () => {
  const model = fullTraceModel({ trace: { product: { name: 'Cơm' }, batch: { startedAt: '2026-10-27T02:00:00Z' } } }, lotId);
  assert.equal(model.params.get('make'), '27/10/2026 09:00:00');
  assert.equal(model.params.get('ready'), '—');
  assert.equal(model.params.has('image'), false);
});

test('public lookup reports missing records and API authorization failures explicitly', () => {
  assert.match(traceErrorMessage({ response: { status: 404 } }), /Không tìm thấy/);
  for (const status of [401, 403]) assert.match(traceErrorMessage({ response: { status } }), /chưa cho phép/);
});

test('Swagger root image and receivedAt take priority and the entire trace remains available', () => {
  const data = {
    imageUrl: 'https://images.example/illustration.jpg', imageSource: 'ILLUSTRATION',
    receivedAt: '2026-10-19T09:54:52.481Z', purchasedAt: '2026-10-14',
    lot: { id: lotId, code: 'DEMO-LOT', status: 'EXPIRED' }, product: { name: 'Thịt heo', imageUrl: null },
    quantities: { inbound: 10, outbound: 0, balance: 10, movementCount: 1 },
    recipe: null, consumption: { consumedBy: [] }, timeline: [{ type: 'EXPIRY_DATE', detail: { expiresAt: '2026-10-21' } }],
  };
  const model = fullTraceModel({ success: true, data }, 'DEMO-LOT');
  assert.equal(model.lotId, lotId);
  assert.equal(model.params.get('image'), data.imageUrl);
  assert.equal(model.params.get('imageSource'), 'ILLUSTRATION');
  assert.equal(model.params.get('stock'), '19/10/2026 16:54:52');
  assert.deepEqual(model.trace.quantities, data.quantities);
  assert.deepEqual(model.trace.timeline, data.timeline);
  assert.equal(model.trace.recipe, null);
});

test('download and print QR share a stable lot URL and print names cannot inject markup', () => {
  const exported = buildTraceQrExport({ lotId, serial: 'S-1', productName: '<img src=x onerror=alert(1)>', lotCode: 'LOT-001', origin: 'http://localhost:5173' });
  assert.equal(parseTraceInput(exported.url).lotId, lotId);
  assert.equal(new URL(exported.url).searchParams.get('serial'), 'S-1');
  assert.ok(exported.html.includes(exported.svg));
  assert.ok(exported.html.includes('&lt;img'));
  assert.ok(!exported.html.includes('<img'));
  assert.ok(exported.html.includes('size: 70mm 22mm'));
  assert.ok(exported.html.includes('grid-template-columns: 34mm 34mm'));
  assert.equal((exported.html.match(/class="label"/g) || []).length, 1);
  assert.equal(exported.html.split(exported.svg).length - 1, 1);
  assert.ok(exported.html.includes('class="blank"'));
});

test('print preview respects total quantity and rejects invalid print quantities', () => {
  const html = buildTraceQrExport({ lotId, productName: 'Thịt heo', quantity: 3 }).html;
  assert.equal((html.match(/class="label"/g) || []).length, 3);
  assert.equal((html.match(/class="sheet"/g) || []).length, 2);
  for (const quantity of [0, -1, 1.5, 1001, NaN]) {
    assert.throws(() => buildTraceQrExport({ lotId, quantity }), /Số lượng tem/);
  }
});
