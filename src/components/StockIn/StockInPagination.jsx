import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageSizeOptions = [20, 50, 100];

export default function StockInPagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="grid gap-3 border-t border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 md:grid-cols-[1fr_auto] md:items-center md:px-4">
      <span className="text-center md:text-left">
        Tổng số: <strong>{total}</strong> bản ghi
      </span>

      <div className="grid gap-2 sm:grid-cols-[minmax(190px,220px)_auto] sm:items-center">
        {/* Chọn số dòng hiển thị để mô phỏng điều khiển phân trang như phần mềm kế toán. */}
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} bản ghi trên 1 trang
            </option>
          ))}
        </select>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-9 items-center justify-center gap-1 rounded border border-slate-200 px-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft size={16} />
            Trước
          </button>

          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 bg-white px-2 font-semibold text-slate-800">
            {currentPage}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 items-center justify-center gap-1 rounded border border-slate-200 px-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Sau
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
