import React from "react";
import { formatLabelDate } from "../Stock/lotLabelPrint";
import { traceValueLabels } from "./traceLabels";

const labels = {
  id: "ID", type: "Loại", code: "Mã", name: "Tên", quantity: "Số lượng", status: "Trạng thái",
  manufacturedAt: "Ngày sản xuất", expiresAt: "Hạn sử dụng", createdAt: "Thời gian tạo",
  receivedAt: "Thời gian nhập kho", purchasedAt: "Ngày mua hàng", generatedAt: "Thời điểm lấy hồ sơ",
  imageUrl: "Đường dẫn ảnh", imageSource: "Nguồn ảnh", productType: "Loại sản phẩm", unit: "Đơn vị",
  lotTrackingEnabled: "Theo dõi theo lô", stockId: "ID kho", stockName: "Kho", branchId: "ID chi nhánh", branchName: "Chi nhánh",
  inbound: "Tổng nhập", outbound: "Tổng xuất", balance: "Tồn còn lại", movementCount: "Số giao dịch",
  receiptId: "ID phiếu nhập", receiptCode: "Mã phiếu nhập", supplier: "Nhà cung cấp", phone: "Điện thoại",
  address: "Địa chỉ", taxCode: "Mã số thuế", note: "Ghi chú", direction: "Chiều giao dịch",
  cumulativeQuantity: "Tồn sau giao dịch", referenceId: "ID tham chiếu", referenceType: "Loại tham chiếu", at: "Thời gian",
  consumedBy: "Các lần sử dụng", consumedAt: "Thời gian sử dụng", consumedQuantity: "Lượng tiêu hao",
  usedQuantity: "Lượng thực dùng", wasteQuantity: "Hao hụt", returnedQuantity: "Lượng trả lại",
  recipe: "Công thức", ingredients: "Nguyên liệu", product: "Sản phẩm", productId: "ID sản phẩm", productName: "Tên sản phẩm",
  lotId: "ID lô", lotCode: "Mã lô", lot: "Lô hàng", stock: "Kho", branch: "Chi nhánh",
  batch: "Mẻ chế biến", batchId: "ID mẻ", finishedGood: "Thành phẩm", finishedGoodId: "ID thành phẩm",
  startedAt: "Bắt đầu chế biến", readyAt: "Chế biến xong", completedAt: "Hoàn thành",
  actualQuantity: "Sản lượng thực tế", plannedQuantity: "Sản lượng dự kiến", yieldQuantity: "Sản lượng công thức",
  origin: "Nguồn gốc", inputs: "Nguyên liệu đầu vào", detail: "Chi tiết", serial: "Serial", serials: "Danh sách serial",
  cost: "Chi phí", unitCost: "Đơn giá", totalCost: "Tổng chi phí", version: "Phiên bản", description: "Mô tả",
};

export function TraceValue({ value }) {
  if (value === null || value === undefined || value === "") return <span className="font-normal text-slate-400">Chưa ghi nhận</span>;
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "number") return value.toLocaleString("vi-VN", { maximumFractionDigits: 6 });
  if (Array.isArray(value)) return value.length ? <ol className="space-y-3">{value.map((item, index) => <li key={index} className="rounded-lg border border-slate-100 p-3"><TraceValue value={item} /></li>)}</ol> : <span className="font-normal text-slate-400">Chưa có dữ liệu</span>;
  if (typeof value === "object") return <TraceDataFields data={value} />;
  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return formatLabelDate(value);
  return traceValueLabels[value] || String(value);
}

export default function TraceDataFields({ data }) {
  return <dl className="grid gap-4 text-sm sm:grid-cols-2">{Object.entries(data || {}).map(([key, value]) => <div key={key} className={value && typeof value === "object" ? "min-w-0 sm:col-span-2" : "min-w-0"}>
    <dt className="mb-1 text-xs text-slate-500">{labels[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2")}</dt>
    <dd className="break-words font-medium text-slate-800"><TraceValue value={value} /></dd>
  </div>)}</dl>;
}
