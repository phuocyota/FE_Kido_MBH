import { formatLabelDate } from "../Stock/lotLabelPrint.js";
import { resolveProductImage } from "../QR/productImage.js";

import { getQrOrigin } from "../QR/traceUrl.js";

export function buildOrderTraceUrl({ origin = getQrOrigin(), productName, productImage, batch, unit }) {
  const stockDates = (batch.inputs || []).map((input) => {
    const name = input.origin?.product?.name || "Nguyên liệu";
    const lot = input.origin?.lot?.code || input.lotId;
    const receivedAt = input.origin?.origin?.receivedAt || input.origin?.origin?.purchasedAt;
    return `${name}${lot ? ` (${lot})` : ""}: ${formatLabelDate(receivedAt)}`;
  });
  const params = new URLSearchParams({
    name: productName || "Chưa có tên sản phẩm",
    serial: String(unit.serial ?? "—"),
    stock: stockDates.join("\n") || "—",
    make: formatLabelDate(batch.startedAt),
    ready: formatLabelDate(batch.readyAt),
    completed: formatLabelDate(batch.completedAt),
    expires: formatLabelDate(unit.expiresAt || batch.expiresAt),
  });
  const image = resolveProductImage(productImage);
  if (image) params.set("image", image);
  return new URL(`/truyxuat#${params}`, origin).href;
}
