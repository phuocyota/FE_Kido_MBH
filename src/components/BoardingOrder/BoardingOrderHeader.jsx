import React from "react";
import { CalendarDays, UtensilsCrossed } from "lucide-react";

export default function BoardingOrderHeader() {
  return (
    <div className="border-b border-emerald-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <UtensilsCrossed size={16} />
            Bán trú
          </div>

          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Đặt món bán trú
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Đăng ký bữa ăn theo từng ngày trong tuần cho học sinh.
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sky-700 sm:flex">
          <CalendarDays size={20} />
          <span className="text-sm font-semibold">Lịch tuần</span>
        </div>
      </div>
    </div>
  );
}
