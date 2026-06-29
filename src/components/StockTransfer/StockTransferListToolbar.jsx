import React, { useState } from "react";
import {
  ChevronDown,
  FileSpreadsheet,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
  Undo2,
} from "lucide-react";
import StockFilterPanel from "../Stock/StockFilterPanel";

const defaultFilterValues = {
  postingStatus: "Tất cả",
  documentType: "Tất cả",
  secondaryStatus: "Tất cả",
  reportPeriod: "Đầu năm đến hiện tại",
  fromDate: "01/01/2026",
  toDate: "22/06/2026",
};

export default function StockTransferListToolbar({
  searchKeyword,
  onSearchChange,
  onCreateClick,
  onReload,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-400 hover:text-cyan-700";

  const handleFilterChange = (field, value) => {
    setFilterValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="grid gap-3 border-b border-cyan-200 bg-slate-50 px-3 py-3 xl:grid-cols-[auto_1fr] xl:items-center">
      <div className="grid gap-2 sm:grid-cols-[auto_auto_auto_1fr] sm:items-center">
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center text-slate-500 transition hover:text-cyan-700 sm:inline-flex"
          title="Quay lại thao tác trước"
        >
          <Undo2 size={22} />
        </button>

        <button
          type="button"
          className="inline-flex h-9 min-w-0 items-center justify-center gap-2 rounded border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-500 shadow-sm sm:justify-start"
        >
          <span className="truncate">Thực hiện hàng loạt</span>
          <ChevronDown size={15} className="shrink-0" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
            className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded border bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-cyan-600 hover:text-cyan-700 sm:w-auto ${
              isFilterOpen ? "border-cyan-600" : "border-slate-700"
            }`}
          >
            Lọc
            <ChevronDown
              size={15}
              className={`transition ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isFilterOpen && (
            <StockFilterPanel
              type="transfer"
              values={filterValues}
              onChange={handleFilterChange}
              onReset={() => setFilterValues(defaultFilterValues)}
              onApply={() => setIsFilterOpen(false)}
            />
          )}
        </div>

        <span className="text-sm font-medium text-slate-700 sm:px-3">
          {filterValues.reportPeriod}
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(220px,320px)_auto] md:items-center md:justify-end">
        <label className="relative h-9 w-full">
          <input
            value={searchKeyword}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm"
            className="h-full w-full rounded border border-violet-400 bg-white pl-3 pr-10 text-sm italic text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
          <Search
            size={17}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button
            type="button"
            onClick={onReload}
            className={iconButtonClass}
            title="Tải lại"
          >
            <RefreshCcw size={20} />
          </button>

          <button type="button" className={iconButtonClass} title="Xuất Excel">
            <FileSpreadsheet size={20} />
          </button>

          <button type="button" className={iconButtonClass} title="Thiết lập">
            <Settings size={20} />
          </button>

          <div className="inline-flex flex-1 overflow-hidden rounded-full shadow-sm sm:flex-none">
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 bg-cyan-600 px-4 text-sm font-bold text-white transition hover:bg-cyan-700 sm:flex-none"
            >
              <Plus size={17} />
              Thêm
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border-l border-white/30 bg-cyan-600 text-white transition hover:bg-cyan-700"
              title="Tùy chọn thêm"
            >
              <ChevronDown size={16} />
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
}
