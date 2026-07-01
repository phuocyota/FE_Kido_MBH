import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  FileSpreadsheet,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
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

export default function StockOutToolbar({ searchKeyword, onSearchChange }) {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const iconButtonClass =
    "min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition";

  const handleFilterChange = (field, value) => {
    // Lưu lựa chọn lọc ở toolbar để sau này có thể nối API dễ dàng.
    setFilterValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span className="truncate">Thực hiện hàng loạt</span>
              <ChevronDown size={15} className="shrink-0" />
            </button>

            <div className="relative">
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
                  type="out"
                  values={filterValues}
                  onChange={handleFilterChange}
                  onReset={() => setFilterValues(defaultFilterValues)}
                  onApply={() => setIsFilterOpen(false)}
                />
              )}
            </div>

            {/* Khoảng thời gian lọc chứng từ xuất kho đang xem. */}
            <span className="text-sm font-medium text-gray-600 sm:px-3 text-center sm:text-left">
              {filterValues.reportPeriod}
            </span>
          </div>

          {/* Search & Main Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto lg:justify-end">
            <div className="relative flex-1 sm:flex-none">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchKeyword}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm kiếm phiếu xuất..."
                className="h-11 w-full sm:w-[280px] lg:w-[320px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <button type="button" className={iconButtonClass} title="Tải lại">
                <RefreshCcw size={17} className="text-gray-600" />
              </button>

              <button type="button" className={iconButtonClass} title="Xuất Excel">
                <FileSpreadsheet size={17} className="text-green-600" />
              </button>

              <button type="button" className={iconButtonClass} title="Thiết lập">
                <Settings size={17} className="text-gray-600" />
              </button>

              <div className="relative flex-shrink-0">
                <div className="flex overflow-hidden rounded-xl border border-indigo-600 shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate("/stock-out/create")}
                    className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap"
                  >
                    <Plus size={18} />
                    Thêm phiếu
                  </button>

                  <button
                    type="button"
                    className="w-10 h-10 bg-indigo-600 border-l border-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 transition"
                    title="Tùy chọn thêm"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
