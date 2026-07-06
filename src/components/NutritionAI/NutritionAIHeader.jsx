import React from "react";
import { ClipboardList, ShieldCheck, Sparkles } from "lucide-react";

export default function NutritionAIHeader({ menuSummary }) {
  return (
    <header className="border-b border-emerald-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.35fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
            <Sparkles className="h-5 w-5 text-emerald-700" />
          </div>

          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-lg font-bold text-slate-900 sm:text-xl">
              AI Dinh dưỡng
            </h1>

            <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Hỏi đáp về thực đơn, khẩu phần và chế độ ăn cho học sinh.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:text-sm">
          <ClipboardList className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="truncate">{menuSummary}</span>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Sẵn sàng tư vấn</span>
        </div>
      </div>
    </header>
  );
}
