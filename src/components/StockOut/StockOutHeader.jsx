import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockOutHeader({ saleMode = false }) {
  const navigate = useNavigate();
  return (
    <div className="border-b border-gray-300 bg-gray-50 p-3 md:p-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={() => navigate(saleMode ? "/stock-sale" : "/stock-out")}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
        >
          <ArrowLeft size={17} />
          Quay lại
        </button>
        <h1 className="text-lg font-semibold leading-tight text-slate-900 md:text-xl">
          {saleMode ? "Thêm mới phiếu xuất bán" : "Thêm mới phiếu xuất kho"}
        </h1>
      </div>
    </div>
  );
}
