import React, { useState } from "react";
import { Search } from "lucide-react";

export default function TraceSearchForm({ initialValue = "", loading, onSearch }) {
  const [value, setValue] = useState(initialValue);
  return (
    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); onSearch(value); }}>
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
        <input aria-label="ID lô hoặc đường dẫn QR" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Nhập UUID, mã lô hoặc dán đường dẫn QR..." autoComplete="off" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <button type="submit" disabled={!value.trim() || loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"><Search size={17} />{loading ? "Đang tìm..." : "Tra cứu"}</button>
    </form>
  );
}
