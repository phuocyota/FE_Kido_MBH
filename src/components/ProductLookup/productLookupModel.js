import { lookupDate } from "./lookupHelpers.js";

export function productLookupModel(data) {
  const lot = data.lot || {};
  const lifecycle = data.lifecycle || {};
  const inputs = Array.isArray(data.inputs) ? data.inputs : [];
  const finished = data.type === "FINISHED_GOOD" || !!data.unit;
  const stock = inputs.length ? inputs.map((input) => `${input.product?.name || "Nguyên liệu"}: ${lookupDate(input.receivedAt || input.origin?.receivedAt || input.purchasedAt)}`).join("\n") : lookupDate(lifecycle.inStockAt);
  return {
    finished,
    status: data.status || lot.status,
    quantity: finished ? data.production?.actualQuantity : lot.quantity,
    inputs,
    milestones: finished ? [
      ["In stock · Nhập kho nguyên liệu", stock],
      ["Make · Bắt đầu chế biến", lookupDate(lifecycle.startedAt)],
      ["Ready · Chế biến xong", lookupDate(lifecycle.readyAt)],
      ["Completed · Hoàn thành", lookupDate(lifecycle.completedAt)],
      ["Expired · Hạn sử dụng", lookupDate(lifecycle.expiresAt)],
    ] : [
      ["Ngày sản xuất", lookupDate(lot.manufacturedAt)],
      ["Nhập kho", lookupDate(data.receivedAt || data.origin?.receivedAt)],
      ["Hạn sử dụng", lookupDate(lot.expiresAt)],
    ],
  };
}
