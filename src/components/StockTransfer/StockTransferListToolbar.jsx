import React, { useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import StockSearchToolbar from "../Stock/StockSearchToolbar";
import StockFilterPanel from "../Stock/StockFilterPanel";

const initialFilters = {
  documentType: "Tất cả",
  secondaryStatus: "Tất cả",
  fromDate: "",
  toDate: "",
};

export default function StockTransferListToolbar({
  searchKeyword,
  onSearchChange,
  onReload,
  onCreateClick,
}) {
  const [filters, setFilters] = useState(initialFilters);
  return (
    <StockSearchToolbar
      search={searchKeyword}
      onSearchChange={onSearchChange}
      placeholder="Tìm kiếm phiếu chuyển..."
      filters={(close) => (
        <StockFilterPanel
          embedded
          type="transfer"
          values={filters}
          onChange={(field, value) =>
            setFilters((current) => ({ ...current, [field]: value }))
          }
          onReset={() => setFilters(initialFilters)}
          onApply={close}
        />
      )}
    >
      {onReload && (
        <button
          type="button"
          onClick={onReload}
          title="Tải lại"
          aria-label="Tải lại"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <RefreshCcw size={15} />
        </button>
      )}
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700"
      >
        <Plus size={15} />
        Thêm phiếu
      </button>
    </StockSearchToolbar>
  );
}
