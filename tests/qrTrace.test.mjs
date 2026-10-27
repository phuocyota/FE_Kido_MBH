import assert from 'node:assert/strict';
import test from 'node:test';
import { isLotReference, traceErrorMessage } from '../src/components/QR/traceInput.js';
import { fullTraceModel } from '../src/components/QR/fullTraceModel.js';
import { buildLotTraceUrl } from '../src/components/QR/lotTraceUrl.js';

const lotId = 'ca1b862c-5969-44e1-bfc5-1f2c6239a205';

test('QR accepts database lot IDs and lot codes but rejects malformed references', () => {
  for (const id of [lotId, 'DEMO-TRACE-20261019-HEO-SAP-HET-HAN']) {
    const url = new URL(buildLotTraceUrl({ origin: 'http://localhost:5173', lotId: id, serial: 'SERIAL-1' }));
    assert.equal(url.pathname, '/qr');
    assert.equal(url.searchParams.get('id'), id);
    assert.equal(url.searchParams.get('serial'), 'SERIAL-1');
    assert.equal(url.hash, '');
    assert.equal(url.searchParams.has('image'), false);
  }
  for (const id of ['', null, 'two words', '<script>', 'https://site.example/']) {
    assert.equal(isLotReference(id), false);
    assert.throws(() => buildLotTraceUrl({ lotId: id }));
  }
});

test('public lot card uses the returned image and receipt date without retaining unused trace data', () => {
  const model = fullTraceModel({ success: true, data: {
    product: { name: 'Thịt heo', imageUrl: null },
    imageUrl: 'https://images.example/illustration.jpg', imageSource: 'ILLUSTRATION',
    receivedAt: '2026-10-19T09:54:52.481Z', purchasedAt: '2026-10-14',
    lot: { id: lotId, code: 'DEMO-LOT', manufacturedAt: '2026-10-14', expiresAt: '2026-10-21' },
    movements: [{ quantity: 10 }], recipe: null,
  } }, lotId);
  assert.equal(model.params.get('name'), 'Thịt heo');
  assert.equal(model.params.get('image'), 'https://images.example/illustration.jpg');
  assert.equal(model.params.get('imageSource'), 'ILLUSTRATION');
  assert.equal(model.params.get('stock'), '19/10/2026 16:54:52');
  assert.equal(model.params.get('manufactured'), '14/10/2026 (chưa có giờ)');
  assert.equal(model.params.get('expires'), '21/10/2026 (chưa có giờ)');
  assert.equal(model.params.get('type'), 'lot');
  assert.deepEqual(Object.keys(model), ['params']);
  assert.equal(fullTraceModel(null, lotId), null);
  assert.equal(fullTraceModel({}, lotId), null);
});

test('missing dates remain unavailable and production dates come from the linked batch', () => {
  const model = fullTraceModel({ product: { name: 'Cơm' }, batch: { startedAt: '2026-10-27T02:00:00Z' } }, lotId);
  assert.equal(model.params.get('make'), '27/10/2026 09:00:00');
  assert.equal(model.params.get('ready'), '—');
  assert.equal(model.params.has('image'), false);
});

test('finished-product IDs render their serial, ingredient receipt dates and lifecycle without ingredient codes', () => {
  const model = fullTraceModel({ type: 'FINISHED_GOOD', unit: { id: lotId, serial: 1 },
    product: { name: 'Bánh mì' }, imageUrl: '/uploads/banh-mi.jpg',
    lifecycle: { startedAt: '2026-10-20T02:00:00Z', readyAt: '2026-10-20T02:30:00Z', completedAt: '2026-10-20T02:31:00Z', expiresAt: '2026-10-20T10:00:00Z' },
    inputs: [{ lotId: 'ingredient-id', lotCode: 'LO-CHA', product: { name: 'Chả' }, receivedAt: '2026-10-19T01:00:00Z' }],
  }, lotId);
  assert.equal(model.params.get('name'), 'Bánh mì');
  assert.equal(model.params.get('serial'), '1');
  assert.equal(model.params.get('stock'), 'Chả: 19/10/2026 08:00:00');
  assert.equal(model.params.get('make'), '20/10/2026 09:00:00');
  assert.equal(model.params.get('ready'), '20/10/2026 09:30:00');
  assert.equal(model.params.get('completed'), '20/10/2026 09:31:00');
  assert.equal(model.params.get('expires'), '20/10/2026 17:00:00');
  assert.equal(model.params.has('lot'), false);
  assert.equal(model.params.has('type'), false);
});

test('public QR reports missing records and permission failures without redirecting to login', () => {
  assert.match(traceErrorMessage({ response: { status: 404 } }), /Không tìm thấy/);
  for (const status of [401, 403]) assert.match(traceErrorMessage({ response: { status } }), /chưa cho phép/);
});
