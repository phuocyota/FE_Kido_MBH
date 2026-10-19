import React, { useState } from "react";
import {
  ChevronDown,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Search,
  Settings,
} from "lucide-react";
import { defaultStockInFilters } from "./stockInFilters";
import StockFilterPanel from "../Stock/StockFilterPanel";

const defaultFilterValues = defaultStockInFilters;

export default function StockInListToolbar({
  searchKeyword,
  onSearchChange,
  showFilterButton = false,
  isWideView = false,
  onToggleWideView,
  filters, onFiltersChange, onApplyFilters, onResetFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilterValues, setFilterValues] = useState(defaultFilterValues);
  const filterValues = filters || localFilterValues;
  const iconButtonClass =
    "min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition";

  const handleFilterChange = (field, value) => {
    if (onFiltersChange) onFiltersChange({ ...filterValues, [field]: value });
    else setFilterValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {showFilterButton && <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((current) => !current)}
                className={`h-10 px-4 w-full sm:w-auto rounded-xl border bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 ${
                  isFilterOpen ? "border-indigo-600 text-indigo-600 ring-2 ring-indigo-100" : "border-gray-300"
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
                  type="in"
                  values={filterValues}
                  onChange={handleFilterChange}
                  onReset={() => onResetFilters ? onResetFilters() : setFilterValues(defaultFilterValues)}
                  onApply={() => { if (onApplyFilters?.(filterValues) !== false) setIsFilterOpen(false); }}
                />
              )}
            </div>}

          </div>

          {/* Search & Main Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto lg:justify-end">
            <div className="relative flex-1 sm:flex-none">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchKeyword}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm kiếm phiếu nhập..."
                className="h-11 w-full sm:w-[280px] lg:w-[320px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <button type="button" className={iconButtonClass} title="Tải lại">
                <RefreshCcw size={17} className="text-gray-600" />
              </button>

              <button
                type="button"
                onClick={onToggleWideView}
                className={iconButtonClass}
                title={isWideView ? "Thu gọn, hiện bộ lọc bên trái" : "Xem rộng"}
              >
                {isWideView ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <button type="button" className={iconButtonClass} title="Xuất Excel">
                <FileSpreadsheet size={17} className="text-green-600" />
              </button>

              <button type="button" className={iconButtonClass} title="Thiết lập">
                <Settings size={17} className="text-gray-600" />
              </button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
