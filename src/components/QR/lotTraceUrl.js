import { formatLabelDate } from "../Stock/lotLabelPrint.js";
import { resolveProductImage } from "./productImage.js";
import { getQrOrigin } from "./traceUrl.js";

export function buildLotTraceUrl({ origin = getQrOrigin(), lotId, productName, productImage, lotCode, serial, manufacturedAt, receivedAt, expiresAt }) {
  if (lotId) {
    const url = new URL("/trace", origin);
    url.searchParams.set("id", lotId);
    if (serial) url.searchParams.set("serial", String(serial));
    return url.href;
  }
  const params = new URLSearchParams({
    type: "lot",
    name: productName || "Chưa có tên sản phẩm",
    lot: lotCode || "—",
    manufactured: formatLabelDate(manufacturedAt),
    stock: formatLabelDate(receivedAt),
    expires: formatLabelDate(expiresAt),
  });
  if (serial) params.set("serial", String(serial));
  const image = resolveProductImage(productImage);
  if (image) params.set("image", image);
  return new URL(`/truyxuat#${params}`, origin).href;
}
