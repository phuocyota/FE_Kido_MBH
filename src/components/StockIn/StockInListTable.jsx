import React from "react";
import { ChevronDown } from "lucide-react";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);

const columns = [
  { label: "", className: "w-10 min-w-10 text-center" },
  { label: "Ngày hạch toán", className: "min-w-[150px] text-center" },
  { label: "Số chứng từ", className: "min-w-[150px]" },
  { label: "Diễn giải", className: "min-w-[540px]" },
  { label: "Tổng tiền", className: "min-w-[150px] text-right" },
  { label: "Người giao", className: "min-w-[110px]" },
  { label: "Loại chứng từ", className: "min-w-[250px]" },
  { label: "Chi nhánh", className: "min-w-[210px]" },
  { label: "Chức năng", className: "min-w-[110px] text-center" },
];

export default function StockInListTable({
  receipts,
  selectedReceipt,
  onSelectReceipt,
}) {
  const selectedReceiptId = selectedReceipt?.id;
  const totalAmount = receipts.reduce(
    (sum, receipt) => sum + receipt.totalAmount,
    0
  );

  return (
    <>
      {/* Mobile/tablet nhỏ dùng card để tránh bảng quá rộng làm vỡ giao diện. */}
      <div className="grid gap-3 bg-cyan-50 p-3 lg:hidden">
        {receipts.map((receipt) => {
          const isSelected = receipt.id === selectedReceiptId;

          return (
            <button
              type="button"
              key={receipt.id}
              onClick={() => onSelectReceipt(receipt.id)}
              className={`w-full rounded-lg border p-3 text-left shadow-sm transition ${
                isSelected
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-sky-700">
                    {receipt.voucherNo}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {receipt.postedDate}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold tabular-nums text-slate-950">
                    {formatNumber(receipt.totalAmount)}
                  </div>
                  <span className="mt-1 inline-flex rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-700">
                    Xem
                  </span>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-800">
                {receipt.description}
              </p>

              <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <span className="font-semibold text-slate-800">
                    Loại chứng từ:
                  </span>{" "}
                  {receipt.voucherType}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">
                    Chi nhánh:
                  </span>{" "}
                  {receipt.branch}
                </div>
              </div>
            </button>
          );
        })}

        {receipts.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-10 text-center text-sm text-slate-500">
            Không có phiếu nhập kho phù hợp
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-right text-sm font-bold text-slate-950">
          Tổng: {formatNumber(totalAmount)}
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1680px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr className="bg-cyan-200 text-slate-950">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-r border-cyan-300 px-3 py-2 font-bold ${column.className}`}
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
                  className={`cursor-pointer border-b border-slate-200 transition hover:bg-amber-50 ${
                    isSelected ? "bg-amber-100" : "bg-white"
                  }`}
                >
                  <td className="border-r border-slate-200 px-3 py-2 text-center">
                    <input type="checkbox" checked={isSelected} readOnly />
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center tabular-nums">
                    {receipt.postedDate}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2">
                    <button
                      type="button"
                      className="font-semibold text-sky-700 hover:underline"
                    >
                      {receipt.voucherNo}
                    </button>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 leading-5 text-slate-900">
                    {receipt.description}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-right font-semibold tabular-nums">
                    {formatNumber(receipt.totalAmount)}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2">
                    {receipt.deliverer}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 leading-5">
                    {receipt.voucherType}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 leading-5">
                    {receipt.branch}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {/* Nút chức năng để sẵn cho các thao tác xem/sửa/xóa sau này. */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-semibold text-sky-700 transition hover:text-sky-900"
                    >
                      Xem
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {receipts.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-12 text-center text-slate-500"
                >
                  Không có phiếu nhập kho phù hợp
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="bg-slate-200 font-bold text-slate-950">
              <td
                colSpan={4}
                className="border-r border-slate-300 px-3 py-2 text-center"
              >
                Tổng
              </td>
              <td className="border-r border-slate-300 px-3 py-2 text-right tabular-nums">
                {formatNumber(totalAmount)}
              </td>
              <td colSpan={4} className="px-3 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
