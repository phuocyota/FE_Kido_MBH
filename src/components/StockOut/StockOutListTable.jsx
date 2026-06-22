import React from "react";
import StockOutEmptyState from "./StockOutEmptyState";

const columns = [
  { label: "", className: "w-10 min-w-10 text-center" },
  { label: "Ngày hạch toán", className: "min-w-[150px] text-center" },
  { label: "Số chứng từ", className: "min-w-[150px]" },
  { label: "Diễn giải", className: "min-w-[290px]" },
  { label: "Tổng tiền", className: "min-w-[150px] text-right" },
  { label: "Người nhận", className: "min-w-[110px]" },
  { label: "Đã lập CT bán hàng", className: "min-w-[130px] text-center" },
  { label: "Loại chứng từ", className: "min-w-[180px]" },
  { label: "Chi nhánh", className: "min-w-[360px]" },
  { label: "Chức năng", className: "min-w-[100px] text-center" },
];

export default function StockOutListTable({ receipts }) {
  return (
    <>
      {/* Mobile/tablet nhỏ: màn rỗng gọn để không kéo ngang bảng. */}
      <div className="bg-white lg:hidden">
        <StockOutEmptyState minHeight="min-h-[360px]" />
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
            {receipts.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <StockOutEmptyState minHeight="min-h-[430px]" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
