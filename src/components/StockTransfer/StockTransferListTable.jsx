import React from "react";
import { ChevronDown } from "lucide-react";
import StockOutEmptyState from "../StockOut/StockOutEmptyState";

const columns = [
  { label: "", className: "w-10 min-w-10 text-center" },
  { label: "Ngày hạch toán", className: "min-w-[150px] text-center" },
  { label: "Số chứng từ", className: "min-w-[150px]" },
  { label: "Diễn giải", className: "min-w-[520px]" },
  { label: "Tổng tiền", className: "min-w-[150px] text-right" },
  { label: "Người vận chuyển", className: "min-w-[150px]" },
  { label: "Loại chứng từ", className: "min-w-[250px]" },
  { label: "Chức năng", className: "min-w-[100px] text-center" },
];

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("vi-VN");
};

const getDescription = (transfer) => {
  if (transfer.note) return transfer.note;

  const fromBranch = transfer.fromBranch?.name || transfer.fromBranchName || transfer.fromBranchId;
  const toBranch = transfer.toBranch?.name || transfer.toBranchName || transfer.toBranchId;

  if (fromBranch || toBranch) {
    return `Chuyển kho từ ${fromBranch || "..."} đến ${toBranch || "..."}`;
  }

  return "";
};

const getCarrier = (transfer) =>
  transfer.carrierName ||
  transfer.transporterName ||
  transfer.deliverer ||
  transfer.createdBy?.name ||
  "";

export default function StockTransferListTable({
  transfers,
  selectedTransfer,
  onSelectTransfer,
  loading,
  error,
}) {
  const selectedTransferId = selectedTransfer?.id;
  const isEmpty = !loading && transfers.length === 0;

  return (
    <>
      <div className="grid gap-3 bg-cyan-50 p-3 lg:hidden">
        {transfers.map((transfer) => {
          const isSelected = transfer.id === selectedTransferId;

          return (
            <button
              type="button"
              key={transfer.id}
              onClick={() => onSelectTransfer(transfer.id)}
              className={`w-full rounded-lg border p-3 text-left shadow-sm transition ${
                isSelected
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-sky-700">
                    {transfer.code || transfer.voucherNo || transfer.id}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {formatDate(transfer.transferredAt || transfer.createdAt)}
                  </div>
                </div>

                <div className="shrink-0 text-right text-sm font-bold tabular-nums text-slate-950">
                  {formatNumber(transfer.totalAmount)}
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-800">
                {getDescription(transfer)}
              </p>
            </button>
          );
        })}

        {isEmpty && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white">
            <StockOutEmptyState minHeight="min-h-[300px]" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {transfers.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-right text-sm font-bold text-slate-950">
            Tổng số: {transfers.length} chứng từ
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1660px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr className="bg-cyan-200 text-slate-950">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-r border-cyan-300 px-3 py-2 font-bold ${column.className}`}
                >
                  {column.label || <input type="checkbox" />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-16 text-center text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading &&
              transfers.map((transfer) => {
                const isSelected = transfer.id === selectedTransferId;

                return (
                  <tr
                    key={transfer.id}
                    onClick={() => onSelectTransfer(transfer.id)}
                    className={`cursor-pointer transition hover:bg-amber-50 ${
                      isSelected ? "bg-amber-100" : "bg-white"
                    }`}
                  >
                    <td className="border-r border-slate-200 px-3 py-2 text-center">
                      <input type="checkbox" checked={isSelected} readOnly />
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 text-center tabular-nums">
                      {formatDate(transfer.transferredAt || transfer.createdAt)}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2">
                      <button
                        type="button"
                        className="font-semibold text-sky-700 hover:underline"
                      >
                        {transfer.code || transfer.voucherNo || transfer.id}
                      </button>
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 leading-5 text-slate-900">
                      {getDescription(transfer)}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 text-right font-semibold tabular-nums">
                      {formatNumber(transfer.totalAmount)}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2">
                      {getCarrier(transfer)}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 leading-5">
                      {transfer.documentType || "Chuyển kho nội bộ"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-semibold text-sky-700 transition hover:text-sky-900"
                      >
                        Xem
                        <ChevronDown size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

            {isEmpty && (
              <tr>
                <td colSpan={columns.length}>
                  <StockOutEmptyState minHeight="min-h-[430px]" />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-3 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </>
  );
}
