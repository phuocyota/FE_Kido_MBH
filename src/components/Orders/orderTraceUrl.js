import { getQrOrigin } from "../QR/traceUrl.js";

export function buildOrderTraceUrl({ origin = getQrOrigin(), unit }) {
  const id = unit?.unitId;
  if (typeof id !== "string" || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Thiếu mã thành phẩm hợp lệ để tạo QR.");
  }
  const url = new URL("/qr", origin);
  url.searchParams.set("id", id);
  return url.href;
}
