import { getQrOrigin } from "./traceUrl.js";
import { isLotReference } from "./traceInput.js";

export function buildLotTraceUrl({ origin = getQrOrigin(), lotId, serial }) {
  if (!isLotReference(lotId)) throw new Error("Thiếu ID hoặc mã lô hợp lệ để tạo QR.");
  const url = new URL("/qr", origin);
  url.searchParams.set("id", lotId);
  if (serial) url.searchParams.set("serial", String(serial));
  return url.href;
}
