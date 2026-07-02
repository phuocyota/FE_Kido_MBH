import React from "react";
import { ChevronDown } from "lucide-react";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);

const columns = [
  { label: "", className: "w-12 text-center" },
  { label: "Ngày hạch toán", className: "min-w-[150px] text-center" },
  { label: "Số chứng từ", className: "min-w-[150px]" },
  { label: "Diễn giải", className: "min-w-[540px]" },
  { label: "Tổng tiền", className: "min-w-[150px] text-right" },
  { label: "Người giao", className: "min-w-[155px]" },
  { label: "Loại chứng từ", className: "min-w-[250px]" },
  { label: "Chi nhánh", className: "min-w-[210px]" },
  { label: "Chức năng", className: "min-w-[110px] text-center" },
];

export default function StockInListTable({
  receipts = [],
  selectedReceipt,
  onSelectReceipt,
}) {
  const selectedReceiptId = selectedReceipt?.id;
  const totalAmount = receipts.reduce(
    (sum, receipt) => sum + (receipt.totalAmount || 0),
    0
  );

  return (
    <>
      {/* Mobile view */}
      <div className="grid gap-3 bg-gray-100 p-3 lg:hidden">
        {receipts.map((receipt) => {
          const isSelected = receipt.id === selectedReceiptId;

          return (
            <button
              type="button"
              key={receipt.id}
              onClick={() => onSelectReceipt(receipt.id)}
              className={`w-full rounded-xl border p-3 text-left shadow-sm transition ${
                isSelected
                  ? "border-indigo-300 bg-indigo-50/70"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-indigo-600">
                    {receipt.voucherNo}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-gray-500">
                    {receipt.postedDate}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold tabular-nums text-gray-900">
                    {formatNumber(receipt.totalAmount)}
                  </div>
                  <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    Xem
                  </span>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-5 text-gray-800">
                {receipt.description}
              </p>

              <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                <div>
                  <span className="font-semibold text-gray-700">
                    Loại chứng từ:
                  </span>{" "}
                  {receipt.voucherType}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Chi nhánh:
                  </span>{" "}
                  {receipt.branch}
                </div>
              </div>
            </button>
          );
        })}

        {receipts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-3 py-10 text-center text-sm text-gray-500">
            Không có phiếu nhập kho phù hợp
          </div>
        )}

        <div className="rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-right text-sm font-bold text-gray-800">
          Tổng: {formatNumber(totalAmount)}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1680px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 ${column.className}`}
                >
                  {column.label || <input type="checkbox" />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {receipts.map((receipt) => {
              const isSelected = receipt.id === selectedReceiptId;

              return (
                <tr
                  key={receipt.id}
                  onClick={() => onSelectReceipt(receipt.id)}
                  className={`cursor-pointer border-b border-gray-300 transition-colors hover:bg-indigo-50/60 ${
                    isSelected ? "bg-indigo-50/80" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={isSelected} readOnly />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 tabular-nums">
                    {receipt.postedDate}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline text-left"
                    >
                      {receipt.voucherNo}
                    </button>
                  </td>
                  <td className="px-4 py-3 leading-5 text-gray-800">
                    {receipt.description}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                    {formatNumber(receipt.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {receipt.deliverer}
                  </td>
                  <td className="px-4 py-3 leading-5 text-gray-700">
                    {receipt.voucherType}
                  </td>
                  <td className="px-4 py-3 leading-5 text-gray-700">
                    {receipt.branch}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium"
                      >
                        Xem
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {receipts.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-gray-500"
                >
                  Không có phiếu nhập kho phù hợp
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 font-bold text-gray-800">
              <td
                colSpan={4}
                className="px-4 py-3 text-center border-t border-gray-300"
              >
                Tổng cộng
              </td>
              <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-indigo-600">
                {formatNumber(totalAmount)}
              </td>
              <td colSpan={5} className="px-4 py-3 border-t border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
