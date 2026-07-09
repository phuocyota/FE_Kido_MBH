import React, { useState } from "react";
import StockOutPagination from "./StockOutPagination";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);
const formatDecimal = (value) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const detailColumns = [
  { label: "#", className: "w-12 text-center" },
  { label: "Mã hàng", className: "min-w-[150px]" },
  { label: "Tên hàng", className: "min-w-[280px]" },
  { label: "Kho", className: "min-w-[190px]" },
  { label: "ĐVT", className: "min-w-[100px]" },
  { label: "Số lượng", className: "min-w-[120px] text-right" },
  { label: "Đơn giá", className: "min-w-[140px] text-right" },
  { label: "Thành tiền", className: "min-w-[140px] text-right" },
  { label: "Tỷ lệ CK (%)", className: "min-w-[140px] text-right" },
  { label: "Tiền chiết khấu", className: "min-w-[150px] text-right" },
];

export default function StockOutDetailTable({ receipt }) {
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
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-[320px] border-t-8 border-gray-300 bg-white">
      <div className="flex justify-center bg-gray-50">
        <div className="-mt-1 h-3 w-12 rounded-b bg-gray-300"></div>
      </div>

      <div className="px-4 pt-3 sm:px-5">
        <span className="inline-flex rounded-t-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          Chi tiết hàng hóa
        </span>
      </div>

      {/* Mobile/Tablet view */}
      <div className="grid gap-3 border-t border-gray-300 bg-gray-100 p-3 lg:hidden">
        {visibleDetails.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-400">
                  #{(safeCurrentPage - 1) * pageSize + index + 1}
                </div>
                <div className="mt-1 font-bold text-indigo-600">
                  {item.productCode}
                </div>
              </div>
              <div className="shrink-0 text-right text-sm font-bold tabular-nums text-gray-900">
                {formatNumber(item.amount)}
              </div>
            </div>

            <p className="mt-3 text-sm leading-5 text-gray-800 font-medium">
              {item.productName}
            </p>

            <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-gray-700">Kho:</span>{" "}
                {item.warehouse}
              </div>
              <div>
                <span className="font-semibold text-gray-700">ĐVT:</span>{" "}
                {item.unit}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Số lượng:</span>{" "}
                {formatDecimal(item.quantity)}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Đơn giá:</span>{" "}
                {formatDecimal(item.unitPrice)}
              </div>
            </div>
          </div>
        ))}

        {details.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-3 py-10 text-center text-sm text-gray-500">
            Chưa có hàng hóa trong phiếu xuất kho
          </div>
        )}

        <div className="grid gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-800 sm:grid-cols-2">
          <div>Tổng số lượng: {formatDecimal(totalQuantity)}</div>
          <div className="sm:text-right text-indigo-600">Tổng tiền: {formatNumber(totalAmount)}</div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden overflow-x-auto border-t border-gray-300 lg:block">
        <table className="w-full min-w-[1740px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              {detailColumns.map((column) => (
                <th
                  key={column.label}
                  className={`border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 ${column.className}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleDetails.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors bg-white">
                <td className="px-4 py-3 text-center text-gray-500">
                  {(safeCurrentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-4 py-3 font-semibold text-indigo-600">
                  {item.productCode}
                </td>
                <td className="px-4 py-3 leading-5 text-gray-800">
                  {item.productName}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item.warehouse}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item.unit}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                  {formatDecimal(item.quantity)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                  {formatDecimal(item.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                  {formatNumber(item.amount)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                  {formatDecimal(item.discountRate)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                  {formatNumber(item.discountAmount)}
                </td>
              </tr>
            ))}

            {details.length === 0 && (
              <tr>
                <td
                  colSpan={detailColumns.length}
                  className="px-4 py-16 text-center text-gray-500"
                >
                  Chưa có hàng hóa trong phiếu xuất kho
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 font-bold text-gray-800">
              <td colSpan={5} className="px-4 py-3 border-t border-gray-300">
                Tổng cộng
              </td>
              <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-indigo-600">
                {formatDecimal(totalQuantity)}
              </td>
              <td className="px-4 py-3 border-t border-gray-300"></td>
              <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-indigo-600">
                {formatNumber(totalAmount)}
              </td>
              <td colSpan={2} className="px-4 py-3 border-t border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <StockOutPagination
        total={details.length}
        currentPage={safeCurrentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
