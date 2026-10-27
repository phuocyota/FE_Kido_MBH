import QRCode from "qrcode";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export function labelQr(value) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const quiet = 4;
  const size = modules.size + quiet * 2;
  const cells = [];
  for (let y = 0; y < modules.size; y += 1) {
    for (let x = 0; x < modules.size; x += 1) {
      if (modules.get(y, x)) cells.push(`M${x + quiet} ${y + quiet}h1v1h-1z`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-label="QR"><rect width="${size}" height="${size}" fill="white"/><path d="${cells.join("")}" fill="black"/></svg>`;
}

export function formatLabelDate(value) {
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)} (chưa có giờ)`;
  const date = new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}+07:00`);
  if (Number.isNaN(date.getTime())) return "—";
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("day")}/${part("month")}/${part("year")} ${part("hour")}:${part("minute")}:${part("second")}`;
}

export function buildLotLabelDocument({ productName, serials = [], quantity, labelPayload }) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) throw new Error("Số lượng tem phải là số nguyên từ 1 đến 10.000.");
  const paperWidth = 70;
  const height = 22;
  const gap = 2;
  const width = (paperWidth - gap) / 2;
  const qrCache = new Map();
  const labels = Array.from({ length: quantity }, (_, index) => {
    const serial = serials.length ? serials[index % serials.length] : undefined;
    const payload = typeof labelPayload === "function"
      ? labelPayload(serial)
      : labelPayload;
    if (typeof payload !== "string" || !payload.trim()) throw new Error("Thiếu nội dung mã QR.");
    if (!qrCache.has(payload)) qrCache.set(payload, labelQr(payload));
    return `<article class="label"><div class="name">${escapeHtml(productName || "Chưa có tên sản phẩm")}</div><div class="qr">${qrCache.get(payload)}</div></article>`;
  });
  const rows = [];
  for (let i = 0; i < labels.length; i += 2) rows.push(`<section class="sheet">${labels[i]}${labels[i + 1] || '<div class="blank"></div>'}</section>`);
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>In tem QR lô hàng</title><style>
    @page { size: ${paperWidth}mm ${height}mm; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #000; font-family: Arial, sans-serif; }
    .sheet { display: grid; grid-template-columns: ${width}mm ${width}mm; column-gap: ${gap}mm; width: ${width * 2 + gap}mm; height: ${height}mm; break-inside: avoid; break-after: page; }
    .sheet:last-child { break-after: auto; }
    .label { width: ${width}mm; height: ${height}mm; padding: 0.5mm 1mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2mm; overflow: hidden; }
    .qr { width: 18.5mm; height: 18.5mm; flex: 0 0 18.5mm; background: white; }
    svg { display: block; width: 100%; height: 100%; }
    .name { flex: 0 0 2.3mm; width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; font-size: 6.5pt; line-height: 2.3mm; font-weight: 700; }
    @media screen { body { background: #e2e8f0; padding: 12px; } .sheet { zoom: 2; margin: 0 auto 12px; background: white; box-shadow: 0 1px 4px #94a3b8; } .blank { background: #f8fafc; } }
    @media print { html, body { width: ${paperWidth}mm; margin: 0; padding: 0; background: white; } .sheet { zoom: 1; margin: 0; box-shadow: none; } }
    </style></head><body>${rows.join("")}</body></html>`;
}
