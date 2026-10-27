import React, { useState } from "react";
import { Search } from "lucide-react";

export default function LookupForm({ reference, loading, onSubmit }) {
  const [value, setValue] = useState(reference);
  return <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); onSubmit(value); }}>
    <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-semibold text-slate-700">ID hoặc mã lô</span>
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Nhập UUID, mã lô hoặc dán link API từ QR" autoComplete="off" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
    </label>
    <button type="submit" disabled={!value.trim() || loading} className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"><Search size={18} />{loading ? "Đang tra cứu..." : "Tra cứu"}</button>
  </form>;
}
