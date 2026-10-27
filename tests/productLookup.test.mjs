import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLookupApiUrl, getPublicProduct } from '../src/api/publicProductLookupApi.js';
import { buildLookupPageUrl, readLookupReference, lookupDate, lookupImage } from '../src/components/ProductLookup/lookupHelpers.js';
import { visibleLookupFields, lookupNumber } from '../src/components/ProductLookup/lookupPresentation.js';

const id = 'ca1b862c-5969-44e1-bfc5-1f2c6239a205';

test('generated QR opens the standalone product view while the ID remains available to the API', () => {
  const url = new URL(buildLookupPageUrl(id, 'http://localhost:5173'));
  assert.equal(url.pathname, '/truyxuat');
  assert.equal(url.searchParams.get('view'), 'product');
  assert.equal(url.searchParams.get('lotId'), id);
  assert.equal(readLookupReference(url.href), id);
});

test('QR URL contains the public API endpoint and the exact searched lot ID', () => {
  const url = new URL(buildLookupApiUrl(id, 'https://api.example.com/'));
  assert.equal(url.pathname, '/stock-trace/full');
  assert.equal(url.searchParams.get('lotId'), id);
  assert.equal([...url.searchParams].length, 1);
  assert.equal(buildLookupApiUrl(id, 'https://api.example.com/api'), `https://api.example.com/api/stock-trace/full?lotId=${id}`);
});

test('manual IDs and scanned API URLs resolve to a reference without navigating to scanned hosts', () => {
  for (const value of [id, ` ${id} `, `https://api.example.com/stock-trace/full?lotId=${id}`, `/truyxuat?lotId=${id}`, `/truyxuat?id=${id}`]) {
    assert.equal(readLookupReference(value), id);
  }
  assert.equal(readLookupReference('DEMO-TRACE-20261019-HEO-SAP-HET-HAN'), 'DEMO-TRACE-20261019-HEO-SAP-HET-HAN');
  for (const value of ['', '<script>', 'https://site.example/', 'javascript:alert(1)', 'two words']) assert.throws(() => readLookupReference(value));
});

test('scanner extracts the lot ID from structured QR payloads and old labelled lot formats', () => {
  for (const value of [JSON.stringify({ lotId: id }), JSON.stringify({ lot: { id } }),
    JSON.stringify({ data: { lot: { id } } }), `https://site.example/truyxuat#lotId=${id}`,
    `Lô: ${id}`, `lotId=${id}`, `MBH:LOT:${id}`]) {
    assert.equal(readLookupReference(value), id);
  }
  assert.throws(() => readLookupReference(JSON.stringify({ productId: id })), /Không tìm thấy/);
  assert.equal(readLookupReference(`MBH:UNIT:${id}`), id);
  assert.equal(readLookupReference(JSON.stringify({ unit: { id } })), id);
  assert.throws(() => readLookupReference('https://site.example/qr#name=Ban%20mi&serial=1'), /Không tìm thấy/);
});

test('public lookup uses GET without credentials or authorization and unwraps the API response', async () => {
  const previousFetch = globalThis.fetch;
  const data = { product: { name: 'Thịt heo' }, lot: { id } };
  let request;
  globalThis.fetch = async (url, options) => { request = { url, options }; return { ok: true, json: async () => ({ success: true, data }) }; };
  try {
    const controller = new AbortController();
    assert.deepEqual(await getPublicProduct(id, controller.signal), data);
    assert.equal(new URL(request.url).pathname, '/stock-trace/full');
    assert.equal(new URL(request.url).searchParams.get('lotId'), id);
    assert.equal(request.options.method, 'GET');
    assert.equal(request.options.credentials, 'omit');
    assert.equal(request.options.headers.Authorization, undefined);
    assert.equal(request.options.signal, controller.signal);
  } finally { globalThis.fetch = previousFetch; }
});

test('lookup rejects missing products, HTTP failures and unsuccessful API envelopes', async () => {
  const previousFetch = globalThis.fetch;
  try {
    for (const [status, body, expected] of [
      [404, {}, /Không tìm thấy/], [403, {}, /công khai/],
      [200, { success: false, message: 'Lô không hợp lệ' }, /Lô không hợp lệ/],
      [200, { data: {} }, /hợp lệ/],
    ]) {
      globalThis.fetch = async () => ({ ok: status === 200, status, json: async () => body });
      await assert.rejects(getPublicProduct(id), expected);
    }
  } finally { globalThis.fetch = previousFetch; }
});

test('missing dates and images remain unavailable while date-only values keep no invented time', () => {
  assert.equal(lookupDate('2026-10-14'), '14/10/2026 (chưa có giờ)');
  assert.equal(lookupDate(null), 'Chưa ghi nhận');
  assert.equal(lookupDate('invalid'), 'Chưa ghi nhận');
  assert.equal(lookupImage('/uploads/pork.jpg', 'https://api.example.com'), 'https://api.example.com/uploads/pork.jpg');
  assert.equal(lookupImage('javascript:alert(1)'), '');
});

test('profile fields hide identifiers and codes but retain names, quantities, contact and business values', () => {
  const keys = visibleLookupFields({ id: 'secret', productId: 'secret', referenceId: 'secret', stockIds: ['secret'],
    code: 'secret', receiptCode: 'secret', taxCode: 'secret', serial: 'secret', imageUrl: 'https://example/photo.jpg',
    name: 'Nhà cung cấp', phone: '0900000000', quantity: 0, lotTrackingEnabled: false, paid: true,
  }).map(([key]) => key);
  assert.deepEqual(keys, ['name', 'phone', 'quantity', 'lotTrackingEnabled', 'paid']);
  assert.equal(lookupNumber(0, 'kg'), '0 kg');
  assert.equal(lookupNumber(null, 'kg'), 'Chưa ghi nhận');
});
