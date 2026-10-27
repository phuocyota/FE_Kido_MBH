import assert from "node:assert/strict";
import test from "node:test";
import jsQR from "jsqr";
import { buildLotLabelDocument, formatLabelDate, labelQr } from "../src/components/Stock/lotLabelPrint.js";
import { buildLotTraceUrl } from "../src/components/QR/lotTraceUrl.js";

const payload = (serial) => buildLotTraceUrl({ origin: 'http://192.168.1.15:5173', lotId: 'ca1b862c-5969-44e1-bfc5-1f2c6239a205', serial });
const defaults = { productName: 'Thịt heo', labelPayload: payload, quantity: 1 };
const count = (html, className) => (html.match(new RegExp(`class="${className}"`, "g")) || []).length;

test('one label defaults to the left slot and odd quantities leave the last right slot blank', () => {
  for (const quantity of [1, 3]) {
    const html = buildLotLabelDocument({ ...defaults, quantity });
    assert.equal(count(html, 'label'), quantity);
    assert.equal(count(html, 'sheet'), Math.ceil(quantity / 2));
    assert.equal(count(html, 'blank'), 1);
    assert.ok(html.includes('size: 70mm 22mm'));
    assert.ok(html.includes('grid-template-columns: 34mm 34mm'));
    assert.ok(!html.includes('<img'));
  }
});

test('serial labels cycle in order and each QR links to the selected serial', () => {
  const html = buildLotLabelDocument({ ...defaults, serials: ['S-1', 'S-2'], quantity: 4 });
  assert.equal(count(html, 'label'), 4);
  assert.equal(count(html, 'blank'), 0);
  for (const serial of ['S-1', 'S-2']) assert.equal(html.split(labelQr(payload(serial))).length - 1, 2);
  assert.notEqual(labelQr(payload('S-1')), labelQr(payload('S-2')));
});

test('product names cannot inject markup and invalid print quantities are rejected', () => {
  const html = buildLotLabelDocument({ ...defaults, productName: '<img src=x onerror="alert(1)">' });
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  for (const quantity of [0, -1, 1.5, 10001, NaN]) assert.throws(() => buildLotLabelDocument({ ...defaults, quantity }));
  assert.throws(() => buildLotLabelDocument({ productName: 'Thịt heo', quantity: 1 }), /nội dung/);
});

test('timestamps preserve Vietnam timezone and date-only values do not invent a time', () => {
  assert.equal(formatLabelDate('2026-10-20T01:30:00Z'), '20/10/2026 08:30:00');
  assert.equal(formatLabelDate('2026-10-20T08:30:00'), '20/10/2026 08:30:00');
  assert.equal(formatLabelDate('2026-10-20'), '20/10/2026 (chưa có giờ)');
  assert.equal(formatLabelDate(null), '—');
  assert.equal(formatLabelDate('invalid'), '—');
});

test('printed QR decodes to the exact lot and serial URL', () => {
  const value = payload('DEMO-SERIAL-HEO-SAP-HET-HAN-0001');
  const svg = labelQr(value);
  const modules = Number(svg.match(/viewBox="0 0 (\d+)/)[1]);
  const darkCells = new Set([...svg.matchAll(/M(\d+) (\d+)h1v1h-1z/g)].map((match) => `${match[1]},${match[2]}`));
  const pixels = modules * 3;
  const rgba = new Uint8ClampedArray(pixels * pixels * 4).fill(255);
  for (let y = 0; y < pixels; y += 1) for (let x = 0; x < pixels; x += 1) {
    if (darkCells.has(`${Math.floor(x / 3)},${Math.floor(y / 3)}`)) {
      const offset = (y * pixels + x) * 4;
      rgba[offset] = rgba[offset + 1] = rgba[offset + 2] = 0;
    }
  }
  assert.equal(jsQR(rgba, pixels, pixels)?.data, value);
});
