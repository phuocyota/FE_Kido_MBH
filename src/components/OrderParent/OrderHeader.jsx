import React from "react";
import {
  CreditCard,
  Search,
  Wallet,
} from "lucide-react";

export default function OrderHeader({
  student,
  search,
  setSearch,
}) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Đặt món căn tin
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Xin chào,
                <span className="font-semibold text-gray-700 ml-1">
                  {student?.name}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">


            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${
              Number(student?.balance || 0) < 0 
                ? "bg-red-50 border-red-200" 
                : "bg-green-50 border-green-200"
            }`}>
              <Wallet
                size={22}
                className={Number(student?.balance || 0) < 0 ? "text-red-600" : "text-green-600"}
              />

              <div>
                <div className={`text-xs ${Number(student?.balance || 0) < 0 ? "text-red-700" : "text-green-700"}`}>
                  {Number(student?.balance || 0) < 0 ? "Nợ" : "Số dư"}
                </div>

                <div className={`font-bold ${Number(student?.balance || 0) < 0 ? "text-red-700" : "text-green-700"}`}>
                  {Math.abs(Number(student?.balance || 0)).toLocaleString()} đ
                </div>

                <div className={`mt-1 text-xs font-medium ${Number(student?.balance || 0) < 0 ? "text-red-700/80" : "text-green-700/80"}`}>
                  Tạm ứng: {Number(student?.advanceAmount || 0).toLocaleString()} đ
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm món ăn..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
