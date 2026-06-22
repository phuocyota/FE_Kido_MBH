import React from "react";
import StockOutEmptyState from "./StockOutEmptyState";

export default function StockOutDetailPanel() {
  return (
    <div className="border-t-8 border-cyan-100 bg-white">
      <div className="flex justify-center bg-cyan-50">
        <div className="-mt-1 h-3 w-12 rounded-b bg-slate-300"></div>
      </div>

      <div className="px-3 pt-2 sm:px-4">
        <span className="inline-flex rounded-t-md border border-b-0 border-amber-300 bg-amber-100 px-4 py-2 text-sm font-bold text-slate-900">
          Chi tiết
        </span>
      </div>

      {/* Phần chi tiết xuất kho rỗng theo ảnh mẫu. */}
      <div className="border-t border-cyan-500">
        <StockOutEmptyState minHeight="min-h-[300px]" />
      </div>
    </div>
  );
}
