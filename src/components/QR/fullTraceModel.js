import { formatLabelDate } from "../Stock/lotLabelPrint.js";

export function fullTraceModel(payload, lotId) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || !Object.keys(payload).length) return null;
  const data = payload.data ?? payload;
  if (!data || typeof data !== "object" || !Object.keys(data).length) return null;
  const trace = data.trace || data;
  const lot = trace.lot || trace.stockLot || {};
  const product = trace.product || lot.product || {};
  const origin = trace.origin || {};
  const batch = trace.lifecycle || trace.productionBatch || trace.batch || {};
  const unit = trace.unit;
  const inputs = Array.isArray(trace.inputs) ? trace.inputs : [];
  const stock = unit ? inputs.map((input) => `${input.product?.name || input.origin?.product?.name || "Nguyên liệu"}: ${formatLabelDate(input.receivedAt || input.origin?.receivedAt || input.origin?.origin?.receivedAt || input.purchasedAt)}`).join("\n") : "";
  const params = new URLSearchParams({
    name: product.name || trace.productName || "Chưa có tên sản phẩm",
    stock: stock || formatLabelDate(batch.inStockAt || trace.receivedAt || origin.receivedAt || lot.receivedAt || origin.purchasedAt),
    manufactured: formatLabelDate(lot.manufacturedAt || trace.manufacturedAt),
    expires: formatLabelDate(unit?.expiresAt || lot.expiresAt || batch.expiresAt || trace.expiresAt),
  });
  if (unit) {
    if (unit.serial != null) params.set("serial", String(unit.serial));
    params.set("stockFormat", "name-date");
  } else params.set("lot", lot.code || lot.lotCode || trace.lotCode || lotId);
  const hasProduction = batch.startedAt || batch.readyAt || batch.completedAt;
  if (unit || hasProduction) {
    params.set("make", formatLabelDate(batch.startedAt));
    params.set("ready", formatLabelDate(batch.readyAt));
    params.set("completed", formatLabelDate(batch.completedAt));
  } else params.set("type", "lot");
  const image = trace.imageUrl || product.imageUrl || trace.productImageUrl;
  if (image) params.set("image", image);
  if (trace.imageSource) params.set("imageSource", trace.imageSource);
  return { params };
}
