import React from "react";
import StockSearchToolbar from "../Stock/StockSearchToolbar";
import StockFilterPanel from "../Stock/StockFilterPanel";
import { stockInPurposes } from "./stockInPurposes";

const selectClass =
  "h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function StockInListToolbar({
  searchKeyword,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
}) {
  const change = (field, value, apply = false) => {
    const next = { ...filters, [field]: value };
    onFiltersChange(next);
    if (apply) onApplyFilters(next);
  };
  return (
    <StockSearchToolbar
      search={searchKeyword}
      onSearchChange={onSearchChange}
      placeholder="Tìm kiếm phiếu nhập..."
      quickFilters={
        <>
          <select
            aria-label="Loại nhập"
            className={selectClass}
            value={filters.documentType}
            onChange={(event) =>
              change("documentType", event.target.value, true)
            }
          >
            <option value="Tất cả">Tất cả loại nhập</option>
            {stockInPurposes.map((purpose) => (
              <option key={purpose.code} value={purpose.title}>
                {purpose.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Trạng thái thanh toán"
            className={selectClass}
            value={filters.secondaryStatus}
            onChange={(event) =>
              change("secondaryStatus", event.target.value, true)
            }
          >
            <option value="Tất cả">Tất cả thanh toán</option>
            <option>Đã thanh toán</option>
            <option>Chưa thanh toán</option>
          </select>
        </>
      }
      filters={(close) => (
        <StockFilterPanel
          embedded
          type="in"
          values={filters}
          onChange={change}
          onApply={() => { if (onApplyFilters(filters) !== false) close(); }}
          onReset={onResetFilters}
        />
      )}
    />
  );
}
