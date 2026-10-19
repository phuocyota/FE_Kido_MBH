import React from "react";
import { RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockHeader({ activeTab, onRefresh }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "in", label: "Nhập kho", path: "/stock-in" },
    { id: "out", label: "Xuất kho", path: "/stock-out" },
    { id: "sale", label: "Xuất bán", path: "/stock-sale" },
    { id: "transfer", label: "Chuyển kho", path: "/stock-transfer" },
    { id: "lots", label: "Lô hàng", path: "/stock-lots" },
    { id: "takes", label: "Kiểm kho", path: "/stock-takes" },
  ];

  return (
    <div className="mb-4">
      {/* Title section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Quản lý kho
        </h1>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition"
          >
            <RefreshCcw size={14} />
            Dữ liệu mới
          </button>
        )}
      </div>

      {/* Pill tabs section */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
