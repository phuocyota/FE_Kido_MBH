import { stockNumber } from "../Stock/stockNumbers.js";

export const parseSerials = (text = "") => text.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);

export function validateSerialDraft(item) {
  if (!item.serialMode || item.serialMode === "NONE") return "";
  if (!["MANUAL", "AUTO"].includes(item.serialMode)) return "Lựa chọn serial không hợp lệ.";
  const quantity = Number((stockNumber(item.quantity) * Number(item.inputToBaseFactor || 1)).toFixed(4));
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 10000)
    return "Hàng có serial cần số lượng sau quy đổi về đơn vị tồn chuẩn là số nguyên từ 1 đến 10000.";
  if (item.serialMode === "MANUAL") {
    const serials = parseSerials(item.serialText);
    if (serials.length !== quantity) return "Số serial phải bằng số lượng nhập sau quy đổi về đơn vị tồn chuẩn (mỗi dòng một serial).";
    if (new Set(serials).size !== serials.length) return "Serial không được trùng nhau.";
    if (serials.some((serial) => serial.length > 128)) return "Serial tối đa 128 ký tự.";
  }
  return "";
}

export function stockInItemPayload(item) {
  const usesSerials = item.serialMode && item.serialMode !== "NONE";
  const factor = usesSerials ? Number(item.inputToBaseFactor || 1) : 1;
  return {
    productId: item.productId,
    quantity: usesSerials ? Number((stockNumber(item.quantity) * factor).toFixed(4)) : stockNumber(item.quantity),
    unitPrice: stockNumber(item.price) / factor,
    unitId: (usesSerials ? item.baseUnitId : item.unitId || item.baseUnitId) || undefined,
    lotCode: item.lotCode?.trim() || undefined,
    manufacturedAt: item.manufacturedAt || undefined,
    expiresAt: item.expiresAt || undefined,
    serialMode: item.serialMode || "NONE",
    ...(item.serialMode === "MANUAL" ? { serials: parseSerials(item.serialText) } : {}),
  };
}

export function validateStockInItems(items, reasonCode = "NHNCC") {
  const products = new Set();
  for (const [index, item] of items.entries()) {
    const prefix = `Dòng ${index + 1}: `;
    if (!item.productId) return prefix + "Vui lòng chọn sản phẩm.";
    if (products.has(item.productId)) return prefix + "Sản phẩm đã có trong phiếu. Vui lòng gộp vào một dòng.";
    products.add(item.productId);
    const quantity = stockNumber(item.quantity);
    const price = stockNumber(item.price);
    if (!Number.isFinite(quantity) || quantity <= 0) return prefix + "Số lượng phải lớn hơn 0.";
    if (!Number.isFinite(price) || price < 0) return prefix + "Đơn giá không hợp lệ.";
    if (reasonCode === "NHNNL") {
      if (!["INGREDIENT", "FUEL"].includes(item.productType)) return prefix + `“${item.name || item.code || "Sản phẩm"}” chưa có loại kho phù hợp. Vào Danh mục → Sửa hàng hóa → Phân loại kho, chọn Nguyên liệu hoặc Nhiên liệu rồi mở lại phiếu nhập.`;
      if (!item.baseUnitId) return prefix + `“${item.name || item.code || "Nguyên liệu"}” chưa có đơn vị tồn chuẩn. Cần cấu hình trong Danh mục hàng hóa.`;
    }
    const requiresLot = item.lotTrackingEnabled || reasonCode === "NHNNL";
    if (requiresLot && !item.lotCode?.trim()) return prefix + "Vui lòng nhập số lô.";
    if (requiresLot && item.productType === "INGREDIENT" && !item.expiresAt) return prefix + `“${item.name || item.code || "Nguyên liệu"}” chưa có hạn sử dụng. Vui lòng nhập hạn dùng thực tế của lô.`;
    if (item.manufacturedAt && item.expiresAt && item.manufacturedAt > item.expiresAt) return prefix + "Hạn sử dụng phải từ ngày sản xuất trở đi.";
    const serialError = validateSerialDraft(item);
    if (serialError) return prefix + serialError;
  }
  return "";
}
