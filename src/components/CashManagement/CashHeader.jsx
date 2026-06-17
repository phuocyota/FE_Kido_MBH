import React from "react";
import { Landmark, Wallet, RefreshCcw } from "lucide-react";

export default function CashHeader() {
  return (
    <div className="mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Quản lý tiền
        </h1>

        <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
              <Landmark size={28} className="text-violet-600" />
            </div>

            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                Tồn quỹ tiền gửi
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                0 ₫
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <Wallet size={28} className="text-emerald-600" />
            </div>

            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                Tồn quỹ tiền mặt
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-1">
                -460.000 ₫
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}