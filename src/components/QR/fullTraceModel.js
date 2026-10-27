import { formatLabelDate } from "../Stock/lotLabelPrint.js";

export function fullTraceModel(payload, lotId) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || !Object.keys(payload).length) return null;
  const data = payload.data ?? payload;
  if (!data || typeof data !== "object" || !Object.keys(data).length) return null;
  const trace = data.trace || data;
  const lot = trace.lot || trace.stockLot || {};
  const product = trace.product || lot.product || {};
  const origin = trace.origin || {};
  const batch = trace.productionBatch || trace.batch || {};
  const params = new URLSearchParams({
    name: product.name || trace.productName || "Chưa có tên sản phẩm",
    lot: lot.code || lot.lotCode || trace.lotCode || lotId,
    stock: formatLabelDate(trace.receivedAt || origin.receivedAt || lot.receivedAt || origin.purchasedAt),
    manufactured: formatLabelDate(lot.manufacturedAt || trace.manufacturedAt),
    expires: formatLabelDate(lot.expiresAt || batch.expiresAt || trace.expiresAt),
  });
  const hasProduction = batch.startedAt || batch.readyAt || batch.completedAt;
  if (hasProduction) {
    params.set("make", formatLabelDate(batch.startedAt));
    params.set("ready", formatLabelDate(batch.readyAt));
    params.set("completed", formatLabelDate(batch.completedAt));
  } else params.set("type", "lot");
  const image = trace.imageUrl || product.imageUrl || trace.productImageUrl;
  if (image) params.set("image", image);
  if (trace.imageSource) params.set("imageSource", trace.imageSource);
  const supplier = origin.supplier || trace.supplier || {};
  return {
    trace,
    params, lotId: lot.id || trace.lotId || lotId,
    productCode: product.code || trace.productCode,
    supplierName: supplier.name,
    receiptCode: origin.receiptCode,
    stockName: trace.location?.stockName || lot.stock?.name,
    branchName: trace.location?.branchName,
    movements: Array.isArray(trace.movements) ? trace.movements : [],
    inputs: Array.isArray(batch.inputs) ? batch.inputs : [],
  };
}
