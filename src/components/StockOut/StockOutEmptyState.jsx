import React from "react";
import { FileText } from "lucide-react";

export default function StockOutEmptyState({ minHeight = "min-h-[220px]" }) {
  return (
    <div
      className={`flex ${minHeight} flex-col items-center justify-center bg-white px-4 py-10 text-center`}
    >
      {/* Empty state mô phỏng trạng thái không có dữ liệu như ảnh tham chiếu. */}
      <div className="relative mb-3 flex h-20 w-28 items-center justify-center">
        <div className="absolute bottom-4 h-3 w-24 rounded-full bg-slate-100"></div>
        <FileText size={54} className="relative text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-800">Không có dữ liệu</p>
    </div>
  );
}
