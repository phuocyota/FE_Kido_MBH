export const lookupLabels = {
  name: "Tên", type: "Loại", status: "Trạng thái", unit: "Đơn vị tính", productType: "Loại hàng hóa",
  quantity: "Số lượng", inbound: "Tổng nhập", outbound: "Tổng xuất", balance: "Tồn hiện tại", movementCount: "Số giao dịch",
  lotTrackingEnabled: "Theo dõi theo lô", manufacturedAt: "Ngày sản xuất", expiresAt: "Hạn sử dụng",
  receivedAt: "Nhập kho", purchasedAt: "Ngày mua hàng", generatedAt: "Cập nhật hồ sơ", createdAt: "Thời gian tạo",
  stockName: "Kho", branchName: "Chi nhánh", supplier: "Nhà cung cấp", phone: "Điện thoại", address: "Địa chỉ",
  note: "Ghi chú", direction: "Giao dịch", cumulativeQuantity: "Tồn sau giao dịch", at: "Thời gian",
  consumedBy: "Các lần sử dụng", consumedAt: "Thời gian sử dụng", consumedQuantity: "Lượng tiêu hao",
  usedQuantity: "Lượng thực dùng", wasteQuantity: "Hao hụt", returnedQuantity: "Lượng trả lại",
  product: "Sản phẩm", productName: "Tên sản phẩm", lot: "Lô hàng", origin: "Nguồn gốc", stock: "Kho", branch: "Chi nhánh",
  recipe: "Công thức", ingredients: "Nguyên liệu", inputs: "Nguyên liệu đầu vào", detail: "Chi tiết", description: "Mô tả",
  batch: "Mẻ chế biến", productionBatch: "Mẻ chế biến", finishedGood: "Thành phẩm",
  startedAt: "Bắt đầu chế biến", readyAt: "Chế biến xong", completedAt: "Hoàn thành",
  actualQuantity: "Sản lượng thực tế", plannedQuantity: "Sản lượng dự kiến", yieldQuantity: "Sản lượng công thức",
  cost: "Chi phí", unitCost: "Đơn giá", totalCost: "Tổng chi phí", version: "Phiên bản", referenceType: "Loại giao dịch",
  production: "Thông tin chế biến", lifecycle: "Các mốc chế biến", inStockAt: "Nhập kho nguyên liệu", issuedQuantity: "Lượng xuất cho chế biến", traceabilityComplete: "Đầy đủ hồ sơ truy xuất",
};

export const lookupValues = {
  INGREDIENT: "Nguyên liệu", FINISHED_GOOD: "Thành phẩm", SUPPLIER: "Nhà cung cấp", PRODUCTION: "Sản xuất",
  EXPIRED: "Hết hạn", AVAILABLE: "Còn sử dụng", EXPIRING: "Sắp hết hạn", DEPLETED: "Đã hết hàng",
  IN: "Nhập kho", OUT: "Xuất kho", RECEIVED: "Tiếp nhận hàng", INBOUND: "Nhập kho", OUTBOUND: "Xuất kho",
  EXPIRY_DATE: "Hạn sử dụng", PRODUCTION_BATCH: "Mẻ chế biến", READY: "Sẵn sàng", COMPLETED: "Hoàn thành",
  WAITING: "Chờ chế biến", PREPARING: "Đang chế biến", ILLUSTRATION: "Ảnh minh họa", PRODUCT: "Ảnh sản phẩm",
  IN_STOCK: "Nhập kho nguyên liệu", MAKE: "Bắt đầu chế biến", EXPIRED_AT: "Hạn sử dụng",
};

export function visibleLookupFields(data) {
  return Object.entries(data || {}).filter(([key]) => !/^(?:id|ids|serial|serials|imageUrl|imageSource|tracePath)$/i.test(key) && !/(?:Id|Ids)$/.test(key) && !/(?:code|codes)$/i.test(key));
}

export function lookupNumber(value, unit = "") {
  if (value === null || value === undefined) return "Chưa ghi nhận";
  return `${Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 4 })}${unit ? ` ${unit}` : ""}`;
}
