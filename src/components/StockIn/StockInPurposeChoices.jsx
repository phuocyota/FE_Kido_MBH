import React from "react";
import { ArrowRight, Flame, PackagePlus } from "lucide-react";
import { stockInPurposes } from "./stockInPurposes";

export default function StockInPurposeChoices({ onChoose }) {
  return (
    <section aria-label="Chọn mục đích nhập kho" className="mb-5">
      <h2 className="text-base font-bold text-slate-900">Bạn muốn nhập kho theo mục đích nào?</h2>
      <p className="mt-1 text-sm text-slate-500">Chọn mục đích để mở phiếu và danh sách hàng phù hợp.</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {stockInPurposes.map((purpose) => {
          const Icon = purpose.code === "NHNNL" ? Flame : PackagePlus;
          return (
            <button
              key={purpose.code}
              type="button"
              onClick={() => onChoose(purpose.code)}
              aria-label={purpose.action}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:p-5"
            >
              <span className="flex items-center gap-3 text-lg font-bold text-slate-900"><span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Icon size={22} /></span>{purpose.title}</span>
              <span className="mt-3 text-sm leading-6 text-slate-600">{purpose.description}</span>
              <span className="mt-1 text-xs leading-5 text-slate-500">{purpose.example}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">{purpose.action}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
