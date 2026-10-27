export const isLookupReference = (value) => typeof value === "string" && value.length <= 200 && /^[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u.test(value);

export function buildLookupPageUrl(lotId, origin = window.location.origin) {
  const url = new URL("/truyxuat", origin);
  url.searchParams.set("lotId", lotId);
  url.searchParams.set("view", "product");
  return url.href;
}

export function readLookupReference(value) {
  const input = value.trim();
  if (isLookupReference(input)) return input;
  try {
    const url = new URL(input, "https://lookup.local");
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    const hash = new URLSearchParams(url.hash.slice(1));
    const id = url.searchParams.get("lotId") || url.searchParams.get("id") || hash.get("lotId") || hash.get("id");
    if (isLookupReference(id)) return id;
  } catch { /* Unsupported QR content is reported below. */ }
  try {
    const payload = JSON.parse(input);
    const id = payload?.unitId || payload?.unit?.id || payload?.lotId || payload?.lot?.id || payload?.data?.unit?.id || payload?.data?.lotId || payload?.data?.lot?.id;
    if (isLookupReference(id)) return id;
  } catch { /* The QR can also contain a labelled lot reference. */ }
  const match = input.match(/(?:^|\n)\s*(?:lotId|ID lô|Lô)\s*[:=]\s*(\S+)/i)
    || input.match(/^MBH:(?:LOT|UNIT):(.+)$/i);
  if (match && isLookupReference(match[1])) return match[1];
  throw new Error("Không tìm thấy ID hoặc mã lô trong QR. QR cần chứa UUID, lotId hoặc đường dẫn truy xuất có lotId.");
}

export function lookupDate(value) {
  if (!value) return "Chưa ghi nhận";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)} (chưa có giờ)`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa ghi nhận" : date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export function lookupImage(value, base = import.meta.env?.VITE_API_URL || "http://localhost:3002") {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, `${base.replace(/\/+$/, "")}/`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}
