import React from "react";
import { Search, RefreshCw, FileSpreadsheet, Printer, ArrowDownLeft, ArrowUpRight } from "lucide-react";
export default function CashToolbar({
  onAddPaymentVoucher,
  onAddReceiptVoucher,
  filters,
  setFilters,
  onRefresh,
  filterControl,
}) {
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-0">
        <div className="erp-toolbar">
          {/* Filter */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">

            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                placeholder="Nhập số phiếu, đối tượng"
                className="h-9 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={filters?.search || ""}
                onChange={(e) =>
                  setFilters?.((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {filterControl}
            <button
              onClick={onRefresh}
              className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
            >
              <RefreshCw size={17} className="text-gray-600" />
            </button>


            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <FileSpreadsheet size={17} className="text-green-600" />
            </button>

            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <Printer size={17} className="text-gray-600" />
            </button>

            <button
              type="button"
              onClick={onAddReceiptVoucher}
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <ArrowDownLeft size={18} aria-hidden="true" />
              Thu nợ khách hàng
            </button>
            <button
              type="button"
              onClick={onAddPaymentVoucher}
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <ArrowUpRight size={18} aria-hidden="true" />
              Chi trả nợ nhà cung cấp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
