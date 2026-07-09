import React from "react";
import { RefreshCcw } from "lucide-react";

export default function CashHeader({ onRefresh }) {
  return (
    <div className="mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Quản lý tiền
        </h1>

        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <RefreshCcw size={14} />
          Dữ liệu mới
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition">
          Thu chi
        </button>

        <button className="px-5 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
          Kiểm kê quỹ tiền mặt
        </button>
      </div>
    </div>
  );
}