import React, { useState } from "react";
import StockInPagination from "./StockInPagination";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);
const formatDecimal = (value) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const detailColumns = [
  { label: "#", className: "w-10 min-w-10 text-center" },
  { label: "Mã hàng", className: "min-w-[150px]" },
  { label: "Tên hàng", className: "min-w-[280px]" },
  { label: "Kho", className: "min-w-[190px]" },
  { label: "TK Kho", className: "min-w-[150px]" },
  { label: "TK Công nợ", className: "min-w-[120px]" },
  { label: "ĐVT", className: "min-w-[100px]" },
  { label: "Số lượng", className: "min-w-[120px] text-right" },
  { label: "Đơn giá", className: "min-w-[140px] text-right" },
  { label: "Thành tiền", className: "min-w-[140px] text-right" },
  { label: "Tỷ lệ CK (%)", className: "min-w-[140px] text-right" },
  { label: "Tiền chiết khấu", className: "min-w-[150px] text-right" },
];

export default function StockInDetailTable({ receipt }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const details = receipt?.details || [];
  const totalQuantity = details.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = details.reduce((sum, item) => sum + item.amount, 0);
  const totalPages = Math.max(1, Math.ceil(details.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleDetails = details.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handlePageSizeChange = (value) => {
    // Khi đổi số dòng phần chi tiết, quay lại trang đầu để nhìn dữ liệu liền mạch.
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-[320px] border-t-8 border-slate-300 bg-white">
      <div className="flex justify-center bg-cyan-50">
        <div className="-mt-1 h-3 w-12 rounded-b bg-slate-300"></div>
      </div>

      <div className="px-3 pt-2 sm:px-4">
        <span className="inline-flex rounded-t-md border border-b-0 border-amber-300 bg-amber-100 px-4 py-2 text-sm font-bold text-slate-900">
          Chi tiết
        </span>
      </div>

      {/* Mobile/tablet nhỏ hiển thị chi tiết dạng card để không cần kéo ngang. */}
      <div className="grid gap-3 border-t border-cyan-500 bg-white p-3 lg:hidden">
        {visibleDetails.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-500">
                  #{(safeCurrentPage - 1) * pageSize + index + 1}
                </div>
                <div className="mt-1 font-bold text-sky-700">
                  {item.productCode}
                </div>
              </div>
              <div className="shrink-0 text-right text-sm font-bold tabular-nums text-slate-950">
                {formatNumber(item.amount)}
              </div>
            </div>

            <p className="mt-3 text-sm leading-5 text-slate-800">
              {item.productName}
            </p>

            <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-slate-800">Kho:</span>{" "}
                {item.warehouse}
              </div>
              <div>
                <span className="font-semibold text-slate-800">ĐVT:</span>{" "}
                {item.unit}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Số lượng:</span>{" "}
                {formatDecimal(item.quantity)}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Đơn giá:</span>{" "}
                {formatDecimal(item.unitPrice)}
              </div>
              <div>
                <span className="font-semibold text-slate-800">TK Kho:</span>{" "}
                {item.warehouseAccount}
              </div>
              <div>
                <span className="font-semibold text-slate-800">
                  TK Công nợ:
                </span>{" "}
                {item.payableAccount}
              </div>
            </div>
          </div>
        ))}

        {details.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 px-3 py-10 text-center text-sm text-slate-500">
            Chưa có hàng hóa trong phiếu nhập kho
          </div>
        )}

        <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-950 sm:grid-cols-2">
          <div>Tổng số lượng: {formatDecimal(totalQuantity)}</div>
          <div className="sm:text-right">Tổng tiền: {formatNumber(totalAmount)}</div>
        </div>
      </div>

      <div className="hidden overflow-x-auto border-t border-cyan-500 lg:block">
        <table className="w-full min-w-[1740px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr className="bg-cyan-200 text-slate-950">
              {detailColumns.map((column) => (
                <th
                  key={column.label}
                  className={`border-r border-cyan-300 px-3 py-2 font-bold ${column.className}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleDetails.map((item, index) => (
              <tr key={item.id} className="bg-white hover:bg-cyan-50">
                <td className="border-r border-slate-200 px-3 py-2 text-center">
                  {(safeCurrentPage - 1) * pageSize + index + 1}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 font-semibold">
                  {item.productCode}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 leading-5">
                  {item.productName}
                </td>
                <td className="border-r border-slate-200 px-3 py-2">
                  {item.warehouse}
                </td>
                <td className="border-r border-slate-200 px-3 py-2">
                  {item.warehouseAccount}
                </td>
                <td className="border-r border-slate-200 px-3 py-2">
                  {item.payableAccount}
                </td>
                <td className="border-r border-slate-200 px-3 py-2">
                  {item.unit}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-right tabular-nums">
                  {formatDecimal(item.quantity)}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-right tabular-nums">
                  {formatDecimal(item.unitPrice)}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-right font-semibold tabular-nums">
                  {formatNumber(item.amount)}
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-right tabular-nums">
                  {formatDecimal(item.discountRate)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatNumber(item.discountAmount)}
                </td>
              </tr>
            ))}

            {details.length === 0 && (
              <tr>
                <td
                  colSpan={detailColumns.length}
                  className="px-3 py-10 text-center text-slate-500"
                >
                  Chưa có hàng hóa trong phiếu nhập kho
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="bg-slate-200 font-bold">
              <td colSpan={7} className="border-r border-slate-300 px-3 py-2">
                Tổng
              </td>
              <td className="border-r border-slate-300 px-3 py-2 text-right tabular-nums">
                {formatDecimal(totalQuantity)}
              </td>
              <td className="border-r border-slate-300 px-3 py-2"></td>
              <td className="border-r border-slate-300 px-3 py-2 text-right tabular-nums">
                {formatNumber(totalAmount)}
              </td>
              <td colSpan={2} className="px-3 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <StockInPagination
        total={details.length}
        currentPage={safeCurrentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
