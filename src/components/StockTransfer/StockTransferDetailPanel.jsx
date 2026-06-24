import React from "react";
import StockOutEmptyState from "../StockOut/StockOutEmptyState";

const detailColumns = [
  { label: "#", className: "w-10 min-w-10 text-center" },
  { label: "Mã hàng", className: "min-w-[150px]" },
  { label: "Tên hàng", className: "min-w-[280px]" },
  { label: "Kho xuất", className: "min-w-[190px]" },
  { label: "Kho nhập", className: "min-w-[190px]" },
  { label: "ĐVT", className: "min-w-[100px]" },
  { label: "Số lượng", className: "min-w-[120px] text-right" },
  { label: "Đơn giá", className: "min-w-[140px] text-right" },
  { label: "Thành tiền", className: "min-w-[140px] text-right" },
];

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const formatDecimal = (value) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const getProduct = (item) => item.product || item.inventoryItem || {};

const getUnitPrice = (item) => {
  const product = getProduct(item);

  return item.unitPrice || item.price || product.costPerUnit || product.price || 0;
};

const getAmount = (item) =>
  item.amount || item.totalAmount || Number(item.quantity || 0) * Number(getUnitPrice(item));

export default function StockTransferDetailPanel({ transfer }) {
  const details = transfer?.items || [];
  const totalQuantity = details.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalAmount = details.reduce((sum, item) => sum + Number(getAmount(item)), 0);
  const fromWarehouse =
    transfer?.fromBranch?.name || transfer?.fromBranchName || transfer?.fromBranchId || "";
  const toWarehouse =
    transfer?.toBranch?.name || transfer?.toBranchName || transfer?.toBranchId || "";

  return (
    <div className="min-h-[320px] border-t-8 border-cyan-100 bg-white">
      <div className="flex justify-center bg-cyan-50">
        <div className="-mt-1 h-3 w-12 rounded-b bg-slate-300"></div>
      </div>

      <div className="px-3 pt-2 sm:px-4">
        <span className="inline-flex rounded-t-md border border-b-0 border-amber-300 bg-amber-100 px-4 py-2 text-sm font-bold text-slate-900">
          Chi tiết
        </span>
      </div>

      <div className="grid gap-3 border-t border-cyan-500 bg-white p-3 lg:hidden">
        {details.map((item, index) => {
          const product = getProduct(item);

          return (
            <div
              key={item.id || `${item.productId}-${index}`}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500">
                    #{index + 1}
                  </div>
                  <div className="mt-1 font-bold text-sky-700">
                    {product.sku || item.productCode || item.productId}
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm font-bold tabular-nums text-slate-950">
                  {formatNumber(getAmount(item))}
                </div>
              </div>

              <p className="mt-3 text-sm leading-5 text-slate-800">
                {product.name || item.productName || ""}
              </p>
            </div>
          );
        })}

        {details.length === 0 && <StockOutEmptyState minHeight="min-h-[260px]" />}
      </div>

      <div className="hidden overflow-x-auto border-t border-cyan-500 lg:block">
        {details.length === 0 ? (
          <StockOutEmptyState minHeight="min-h-[300px]" />
        ) : (
          <table className="w-full min-w-[1500px] border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr className="bg-cyan-200 text-slate-950">
                {detailColumns.map((column) => (
                  <th
                    key={column.label}
                    className={`border-r border-cyan-300 px-3 py-2 font-bold ${column.className}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {details.map((item, index) => {
                const product = getProduct(item);
                const unitPrice = getUnitPrice(item);

                return (
                  <tr
                    key={item.id || `${item.productId}-${index}`}
                    className="bg-white hover:bg-cyan-50"
                  >
                    <td className="border-r border-slate-200 px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 font-semibold">
                      {product.sku || item.productCode || item.productId}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 leading-5">
                      {product.name || item.productName || ""}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2">
                      {item.fromWarehouseName || fromWarehouse}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2">
                      {item.toWarehouseName || toWarehouse}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2">
                      {product.unit || item.unit || ""}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 text-right tabular-nums">
                      {formatDecimal(item.quantity)}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-2 text-right tabular-nums">
                      {formatDecimal(unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                      {formatNumber(getAmount(item))}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="bg-slate-200 font-bold">
                <td colSpan={6} className="border-r border-slate-300 px-3 py-2">
                  Tổng
                </td>
                <td className="border-r border-slate-300 px-3 py-2 text-right tabular-nums">
                  {formatDecimal(totalQuantity)}
                </td>
                <td className="border-r border-slate-300 px-3 py-2"></td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatNumber(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
