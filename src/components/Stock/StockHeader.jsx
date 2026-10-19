import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  History,
  Package,
  RefreshCcw,
  ShoppingCart,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

const tabs = [
  {
    id: "overview",
    label: "Tổng quan",
    path: "/warehouse",
    icon: BarChart3,
    hint: "Thống kê, biến động và cảnh báo kho",
  },
  {
    id: "inventory",
    label: "Tồn kho",
    path: "/warehouse/inventory",
    icon: Boxes,
    hint: "Tồn thực tế, tồn theo kho và theo lô",
  },
  {
    id: "in",
    label: "Nhập kho",
    path: "/stock-in",
    icon: ArrowDownToLine,
    hint: "Nhập hàng và nhập nguyên, nhiên liệu",
  },
  {
    id: "out",
    label: "Xuất kho",
    path: "/stock-out",
    icon: ArrowUpFromLine,
    hint: "Xuất kho và nghiệp vụ xuất bán",
  },
  {
    id: "transfer",
    label: "Chuyển kho",
    path: "/stock-transfer",
    icon: Truck,
    hint: "Luân chuyển hàng giữa các kho",
  },
  {
    id: "lots",
    label: "Lô hàng",
    path: "/stock-lots",
    icon: Package,
    hint: "Tồn lô, hạn dùng và nguồn nhập",
  },
  {
    id: "takes",
    label: "Kiểm kê",
    path: "/stock-takes",
    icon: ClipboardCheck,
    hint: "Kiểm đếm và điều chỉnh chênh lệch",
  },
  {
    id: "trace",
    label: "Truy xuất nguồn gốc",
    path: "/warehouse/trace",
    icon: History,
    hint: "Tra cứu nguồn nhập và lịch sử sử dụng của lô",
  },
];

export default function StockHeader({ activeTab, onRefresh }) {
  return (
    <header className="mb-4 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Vận hành / Kho
          </p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
            Quản lý kho
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/stock-sale"
            title="Giữ nguyên nghiệp vụ xuất bán hiện có"
            className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${activeTab === "sale" ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <ShoppingCart size={15} />
            Xuất bán
          </Link>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Tải lại dữ liệu mới nhất"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCcw size={14} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}
        </div>
      </div>
      <nav
        aria-label="Điều hướng quản lý kho"
        className="flex overflow-x-auto border-t border-slate-100 px-2"
      >
        {tabs.map((tab) => {
          const { id, label, path, icon: Icon, hint } = tab;
          const active =
            activeTab === id || (id === "out" && activeTab === "sale");
          return (
            <Link
              key={id}
              to={path}
              title={hint}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition lg:px-4 ${active ? "border-indigo-600 bg-indigo-50/40 text-indigo-700" : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
