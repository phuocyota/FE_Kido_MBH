import assert from "node:assert/strict";
import test from "node:test";
import jsQR from "jsqr";
import { buildLotLabelDocument, buildLotLabelPayload, formatLabelDate, labelQr } from "../src/components/Stock/lotLabelPrint.js";
import { buildLotTraceUrl } from "../src/components/QR/lotTraceUrl.js";

const defaults = { productName: "Thịt bò", lotCode: "LOT-001", receivedAt: "2026-10-20T01:30:00Z", expiresAt: "2027-10-20T15:00:00Z", serials: [], quantity: 1 };
const count = (html, className) => (html.match(new RegExp(`class="${className}"`, "g")) || []).length;

test("lot QR opens the photo trace page and retains a distinct URL for every serial", () => {
  const details = { ...defaults, origin: 'http://192.168.1.15:5173', productImage: 'https://images.example.com/beef.jpg', manufacturedAt: '2026-10-19' };
  const payload = (serial) => buildLotTraceUrl({ ...details, serial });
  const parsed = new URL(payload('SERIAL-1'));
  const params = new URLSearchParams(parsed.hash.slice(1));
  assert.equal(parsed.origin, details.origin);
  assert.equal(parsed.pathname, '/truyxuat');
  assert.equal(params.get('image'), details.productImage);
  assert.equal(params.get('lot'), 'LOT-001');
  assert.equal(params.get('serial'), 'SERIAL-1');
  assert.equal(params.get('stock'), '20/10/2026 08:30:00');
  assert.equal(params.get('manufactured'), '19/10/2026 (chưa có giờ)');
  assert.equal(params.get('expires'), '20/10/2027 22:00:00');
  const html = buildLotLabelDocument({ ...details, serials: ['SERIAL-1', 'SERIAL-2'], quantity: 2, labelPayload: payload });
  assert.ok(html.includes(labelQr(payload('SERIAL-1'))));
  assert.ok(html.includes(labelQr(payload('SERIAL-2'))));
  assert.notEqual(payload('SERIAL-1'), payload('SERIAL-2'));
  assert.ok(!html.includes('<img'));
  const lotOnly = new URLSearchParams(new URL(payload()).hash.slice(1));
  assert.equal(lotOnly.has('serial'), false);
});

test("non-serial lot repeats labels and leaves the last right slot blank", () => {
  const html = buildLotLabelDocument({ ...defaults, quantity: 3 });
  assert.equal(count(html, "label"), 3);
  assert.equal(count(html, "sheet"), 2);
  assert.equal(count(html, "blank"), 1);
  assert.ok(!html.includes("Instock"));
  assert.ok(!html.includes("Expired"));
  assert.ok(!html.includes("LOT-001"));
  assert.ok(!html.includes("<table>"));
  assert.equal(count(html, "name"), 3);
  assert.ok(html.includes("size: 70mm 22mm"));
  assert.ok(html.includes("grid-template-columns: 34mm 34mm"));
});

test("quantity is the total label count and serials cycle in order", () => {
  const html = buildLotLabelDocument({ ...defaults, serials: ["SERIAL-1", "SERIAL-2"], quantity: 4 });
  assert.equal(count(html, "label"), 4);
  assert.equal(count(html, "blank"), 0);
  const qr1 = labelQr(buildLotLabelPayload({ ...defaults, serial: "SERIAL-1" }));
  const qr2 = labelQr(buildLotLabelPayload({ ...defaults, serial: "SERIAL-2" }));
  assert.equal(html.split(qr1).length - 1, 2);
  assert.equal(html.split(qr2).length - 1, 2);
  assert.notEqual(qr1, qr2);
  assert.equal(count(buildLotLabelDocument({ ...defaults, serials: ["SERIAL-1", "SERIAL-2"], quantity: 1 }), "label"), 1);
});

test("product names and codes cannot inject markup into the print frame", () => {
  const html = buildLotLabelDocument({ ...defaults, productName: '<img src=x onerror="alert(1)">', lotCode: "</td><script>alert(1)</script>" });
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("class=\"code\""));
});

test("scanned QR contains details and Vietnam date/time without printing them", () => {
  const payload = buildLotLabelPayload({ ...defaults, serial: "SERIAL-1" });
  assert.equal(payload, "Sản phẩm: Thịt bò\nLô: LOT-001\nSerial: SERIAL-1\nNgày sản xuất: —\nInstock: 20/10/2026 08:30:00\nExpired: 20/10/2027 22:00:00");
  assert.ok(buildLotLabelDocument(defaults).includes(labelQr(buildLotLabelPayload(defaults))));
  assert.equal(formatLabelDate("2026-10-20T08:30:00"), "20/10/2026 08:30:00");
  assert.equal(formatLabelDate("2026-10-20"), "20/10/2026 (chưa có giờ)");
  assert.equal(formatLabelDate(null), "—");
  assert.equal(formatLabelDate("invalid"), "—");
  assert.ok(!buildLotLabelPayload(defaults).includes("Serial:"));
});

test("QR SVG decodes Vietnamese details and a long serial after rasterization", () => {
  const sample = { productName: "DEMO - Thịt heo", lotCode: "DEMO-TRACE-20261019-HEO-SAP-HET-HAN", serial: "DEMO-SERIAL-HEO-SAP-HET-HAN-0001", receivedAt: "2026-10-19T08:30:00+07:00", expiresAt: "2026-10-21T17:30:00+07:00" };
  const payload = buildLotLabelPayload(sample);
  const svg = labelQr(payload);
  const modules = Number(svg.match(/viewBox="0 0 (\d+)/)[1]);
  const darkCells = new Set([...svg.matchAll(/M(\d+) (\d+)h1v1h-1z/g)].map((match) => `${match[1]},${match[2]}`));
  const pixels = modules * 3;
  const rgba = new Uint8ClampedArray(pixels * pixels * 4).fill(255);
  for (let y = 0; y < pixels; y += 1) {
    for (let x = 0; x < pixels; x += 1) {
      if (darkCells.has(`${Math.floor((x + 0.5) * modules / pixels)},${Math.floor((y + 0.5) * modules / pixels)}`)) {
        const offset = (y * pixels + x) * 4;
        rgba[offset] = rgba[offset + 1] = rgba[offset + 2] = 0;
      }
    }
  }
  assert.equal(jsQR(rgba, pixels, pixels)?.data, payload);
});
