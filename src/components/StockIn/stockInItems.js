import { stockNumber } from "../Stock/stockNumbers";

export const parseSerials = (text = "") => text.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);

export function stockInItemPayload(item) {
  return {
    productId: item.productId,
    quantity: stockNumber(item.quantity),
    unitPrice: stockNumber(item.price),
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
      if (!item.lotTrackingEnabled || !item.baseUnitId) return prefix + "Vào Danh mục → Sửa hàng hóa, chọn đơn vị cơ sở và bật theo dõi lô rồi mở lại phiếu nhập.";
    }
    if (item.lotTrackingEnabled && !item.lotCode?.trim()) return prefix + "Vui lòng nhập số lô.";
    if (item.lotTrackingEnabled && item.productType === "INGREDIENT" && !item.expiresAt) return prefix + "Nguyên liệu phải có hạn sử dụng.";
    if (item.manufacturedAt && item.expiresAt && item.manufacturedAt > item.expiresAt) return prefix + "Hạn sử dụng phải từ ngày sản xuất trở đi.";
    if (item.serialMode && item.serialMode !== "NONE") {
      if (!Number.isInteger(quantity) || quantity > 10000) return prefix + "Hàng có serial cần số lượng nguyên từ 1 đến 10000.";
      if (item.serialMode === "MANUAL") {
        const serials = parseSerials(item.serialText);
        if (serials.length !== quantity) return prefix + "Số serial phải bằng số lượng nhập (mỗi dòng một serial).";
        if (new Set(serials).size !== serials.length) return prefix + "Serial không được trùng nhau.";
        if (serials.some((serial) => serial.length > 128)) return prefix + "Serial tối đa 128 ký tự.";
      }
    }
  }
  return "";
}
