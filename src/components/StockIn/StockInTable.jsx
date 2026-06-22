import React from "react";

const columns = [
  { label: "Mã hàng hóa", className: "min-w-[120px] rounded-tl-lg" },
  { label: "Tên hàng hóa", className: "min-w-[200px]" },
  { label: "Kho", className: "min-w-[140px]" },
  { label: "Vị trí lưu kho", className: "min-w-[140px]" },
  { label: "Đơn vị tính", className: "min-w-[110px]" },
  { label: "Số lượng", className: "min-w-[100px] text-right" },
  { label: "Đơn giá", className: "min-w-[120px] text-right" },
  { label: "Thành tiền", className: "min-w-[130px] text-right" },
  { label: "% chiết khấu", className: "min-w-[120px] text-right" },
  { label: "Tiền chiết khấu", className: "min-w-[140px] text-right" },
  { label: "Thuế suất", className: "min-w-[110px] text-right" },
  { label: "Tiền thuế", className: "min-w-[120px] text-right" },
  { label: "Tiền thanh toán", className: "min-w-[150px] text-right" },
  { label: "Chi phí mua hàng", className: "min-w-[150px] text-right" },
  { label: "Giá trị nhập kho", className: "min-w-[150px] text-right" },
  { label: "Đơn giá vốn trước thuế", className: "min-w-[170px] text-right" },
  {
    label: "Đơn giá vốn sau thuế",
    className: "min-w-[170px] rounded-tr-lg text-right",
  },
];

const headerCellClass =
  "border-r border-white/20 px-3 py-3 text-left text-[11px] font-bold uppercase text-white";
const bodyCellClass = "border-r border-slate-200/80 px-3 py-3 text-slate-700";
const numberCellClass = `${bodyCellClass} text-right font-semibold tabular-nums text-slate-800`;
const totalCellClass =
  "border-r border-emerald-200 px-3 py-3 text-right font-bold tabular-nums text-emerald-800";

export default function StockInTable({ items }) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <h2 className="mb-3 text-base font-bold tracking-wide text-slate-800">
        CHI TIẾT
      </h2>

      <div className="flex-1 overflow-auto rounded-lg border border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-100">
        <div className="min-w-[2440px]">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 shadow-sm">
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className={`${headerCellClass} ${column.className}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`text-sm transition-colors hover:bg-emerald-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-sky-50/40"
                  }`}
                >
                  <td className={`${bodyCellClass} border-b border-slate-200 font-medium text-sky-700`}>
                    {item.code}
                  </td>
                  <td className={`${bodyCellClass} border-b border-slate-200 font-semibold text-slate-900`}>
                    {item.name}
                  </td>
                  <td className={`${bodyCellClass} border-b border-slate-200`}>
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      {item.warehouse || "Kho mặc định"}
                    </span>
                  </td>
                  <td className={`${bodyCellClass} border-b border-slate-200 text-slate-500`}>
                    {item.position || "--"}
                  </td>
                  <td className={`${bodyCellClass} border-b border-slate-200 text-slate-500`}>
                    {item.unit || "--"}
                  </td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>
                    {item.quantity || 1}
                  </td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>
                    {item.price || 0}
                  </td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>
                    {item.amount || 0}
                  </td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0%</td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-b border-slate-200 text-emerald-700`}>
                    0
                  </td>
                  <td className={`${numberCellClass} border-b border-slate-200`}>0</td>
                  <td className={`${numberCellClass} border-r-0 border-b border-slate-200`}>
                    0
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="sticky bottom-0 z-10 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 shadow-[0_-4px_12px_rgba(15,118,110,0.08)]">
              <tr>
                <td
                  colSpan={7}
                  className="border-t border-emerald-200 px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-emerald-700"
                >
                  Tổng cộng
                </td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className="border-t border-emerald-200"></td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-t`}>0</td>
                <td className={`${totalCellClass} border-r-0 border-t`}>0</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
