import React from "react";
import { ChevronDown } from "lucide-react";
import StockOutEmptyState from "../StockOut/StockOutEmptyState";

const columns = [
  { label: "", className: "w-12 text-center" },
  { label: "Ngày hạch toán", className: "min-w-[150px] text-center" },
  { label: "Số chứng từ", className: "min-w-[150px]" },
  { label: "Diễn giải", className: "min-w-[520px]" },
  { label: "Tổng tiền", className: "min-w-[150px] text-right" },
  { label: "Người vận chuyển", className: "min-w-[155px]" },
  { label: "Loại chứng từ", className: "min-w-[250px]" },
  { label: "Chức năng", className: "min-w-[110px] text-center" },
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
  transfers = [],
  selectedTransfer,
  onSelectTransfer,
  loading,
  error,
}) {
  const selectedTransferId = selectedTransfer?.id;
  const isEmpty = !loading && transfers.length === 0;

  return (
    <>
      {/* Mobile view */}
      <div className="grid gap-3 bg-gray-100 p-3 lg:hidden">
        {transfers.map((transfer) => {
          const isSelected = transfer.id === selectedTransferId;

          return (
            <button
              type="button"
              key={transfer.id}
              onClick={() => onSelectTransfer(transfer.id)}
              className={`w-full rounded-xl border p-3 text-left shadow-sm transition ${
                isSelected
                  ? "border-indigo-300 bg-indigo-50/70"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-indigo-600">
                    {transfer.code || transfer.voucherNo || transfer.id}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-gray-500">
                    {formatDate(transfer.transferredAt || transfer.createdAt)}
                  </div>
                </div>

                <div className="shrink-0 text-right text-sm font-bold tabular-nums text-gray-900">
                  {formatNumber(transfer.totalAmount)}
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-5 text-gray-800">
                {getDescription(transfer)}
              </p>
            </button>
          );
        })}

        {isEmpty && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white">
            <StockOutEmptyState minHeight="min-h-[300px]" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {transfers.length > 0 && (
          <div className="rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-right text-sm font-bold text-gray-800">
            Tổng số: {transfers.length} chứng từ
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1660px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 ${column.className}`}
                >
                  {column.label || <input type="checkbox" />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-gray-500 bg-white">
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
                    className={`cursor-pointer border-b border-gray-300 transition-colors hover:bg-indigo-50/60 ${
                      isSelected ? "bg-indigo-50/80" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={isSelected} readOnly />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 tabular-nums">
                      {formatDate(transfer.transferredAt || transfer.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline text-left"
                      >
                        {transfer.code || transfer.voucherNo || transfer.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 leading-5 text-gray-800">
                      {getDescription(transfer)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                      {formatNumber(transfer.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {getCarrier(transfer)}
                    </td>
                    <td className="px-4 py-3 leading-5 text-gray-700">
                      {transfer.documentType || "Chuyển kho nội bộ"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium"
                        >
                          Xem
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {isEmpty && (
              <tr>
                <td colSpan={columns.length} className="bg-white">
                  <StockOutEmptyState minHeight="min-h-[430px]" />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-red-600 bg-white">
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
