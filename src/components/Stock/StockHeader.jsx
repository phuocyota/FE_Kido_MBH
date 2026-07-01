import React from "react";
import { RefreshCcw, FileDown, FileUp, Shuffle, Wallet, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockHeader({ activeTab, onRefresh, totalCount = 0, totalAmount = 0 }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "in", label: "Nhập kho", path: "/stock-in" },
    { id: "out", label: "Xuất kho", path: "/stock-out" },
    { id: "transfer", label: "Chuyển kho", path: "/stock-transfer" },
    { id: "takes", label: "Kiểm kho", path: "/stock-takes" },
  ];

  // Configure values for stat cards based on activeTab
  const getStatsConfig = () => {
    switch (activeTab) {
      case "in":
        return {
          title: "Quản lý nhập kho",
          card1: {
            label: "Tổng số phiếu nhập",
            value: `${totalCount} phiếu`,
            icon: <FileDown size={28} className="text-violet-600" />,
            bg: "bg-gradient-to-br from-violet-100 to-violet-200",
          },
          card2: {
            label: "Tổng giá trị nhập kho",
            value: `${Number(totalAmount).toLocaleString("vi-VN")} ₫`,
            icon: <Wallet size={28} className="text-emerald-600" />,
            bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
            textClass: "text-emerald-600",
          },
        };
      case "out":
        return {
          title: "Quản lý xuất kho",
          card1: {
            label: "Tổng số phiếu xuất",
            value: `${totalCount} phiếu`,
            icon: <FileUp size={28} className="text-violet-600" />,
            bg: "bg-gradient-to-br from-violet-100 to-violet-200",
          },
          card2: {
            label: "Tổng giá trị xuất kho",
            value: `${Number(totalAmount).toLocaleString("vi-VN")} ₫`,
            icon: <Wallet size={28} className="text-rose-600" />,
            bg: "bg-gradient-to-br from-rose-100 to-rose-200",
            textClass: "text-rose-600",
          },
        };
      case "transfer":
        return {
          title: "Quản lý chuyển kho",
          card1: {
            label: "Tổng số phiếu chuyển",
            value: `${totalCount} phiếu`,
            icon: <Shuffle size={28} className="text-violet-600" />,
            bg: "bg-gradient-to-br from-violet-100 to-violet-200",
          },
          card2: {
            label: "Tổng số lượng hàng chuyển",
            value: `${Number(totalAmount).toLocaleString("vi-VN")} sản phẩm`,
            icon: <Boxes size={28} className="text-emerald-600" />,
            bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
            textClass: "text-emerald-600",
          },
        };
      default:
        return {
          title: "Kiểm kê kho",
          card1: {
            label: "Tổng số phiếu kiểm kê",
            value: `${totalCount} phiếu`,
            icon: <Boxes size={28} className="text-violet-600" />,
            bg: "bg-gradient-to-br from-violet-100 to-violet-200",
          },
          card2: {
            label: "Tổng giá trị chênh lệch",
            value: `${Number(totalAmount).toLocaleString("vi-VN")} ₫`,
            icon: <Wallet size={28} className="text-emerald-600" />,
            bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
            textClass: "text-emerald-600",
          },
        };
    }
  };

  const config = getStatsConfig();

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

      {/* Metric cards section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${config.card1.bg} flex items-center justify-center`}>
              {config.card1.icon}
            </div>

            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                {config.card1.label}
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {config.card1.value}
              </h2>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${config.card2.bg} flex items-center justify-center`}>
              {config.card2.icon}
            </div>

            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                {config.card2.label}
              </p>
              <h2 className={`text-2xl font-bold ${config.card2.textClass || "text-gray-800"} mt-1`}>
                {config.card2.value}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
