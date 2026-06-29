import React from "react";
import {
  Search,
  Wallet,
  UserRound,
  CreditCard,
} from "lucide-react";

export default function OrderHeader({
  student,
  search,
  setSearch,
}) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* LEFT */}
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

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Student Card */}

            <div className="flex items-center gap-3 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">

              <CreditCard
                size={22}
                className="text-indigo-600"
              />

              <div>

                <div className="text-xs text-gray-500">
                  Mã học sinh
                </div>

                <div className="font-semibold">
                  {student?.cardId}
                </div>

              </div>

            </div>

            {/* Balance */}

            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">

              <Wallet
                size={22}
                className="text-green-600"
              />

              <div>

                <div className="text-xs text-green-700">
                  Số dư
                </div>

                <div className="font-bold text-green-700">

                  {student?.balance?.toLocaleString()} đ

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SEARCH */}

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