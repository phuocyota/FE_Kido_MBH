import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function StockSearchToolbar({
  search,
  onSearchChange,
  placeholder,
  filters,
  children,
  quickFilters,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="space-y-3 border-b border-slate-100 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-3 text-slate-400"
          />
          <input
            aria-label={placeholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        {quickFilters}
        {filters && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold ${
              expanded
                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={14} />
            Lọc thêm
          </button>
        )}
        {children}
      </div>
      {expanded && (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          {typeof filters === "function" ? filters(() => setExpanded(false)) : filters}
        </div>
      )}
    </div>
  );
}
