import React from "react";
import StockOutEmptyState from "../StockOut/StockOutEmptyState";

const detailColumns = [
  { label: "#", className: "w-12 text-center" },
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
    <div className="min-h-[320px] border-t-8 border-gray-300 bg-white">
      <div className="flex justify-center bg-gray-50">
        <div className="-mt-1 h-3 w-12 rounded-b bg-gray-300"></div>
      </div>

      <div className="px-4 pt-3 sm:px-5">
        <span className="inline-flex rounded-t-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          Chi tiết hàng hóa chuyển
        </span>
      </div>

      {/* Mobile/Tablet view */}
      <div className="grid gap-3 border-t border-gray-300 bg-gray-100 p-3 lg:hidden">
        {details.map((item, index) => {
          const product = getProduct(item);

          return (
            <div
              key={item.id || `${item.productId}-${index}`}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="mt-1 font-bold text-indigo-600">
                    {product.code || item.productCode || item.productId}
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm font-bold tabular-nums text-gray-900">
                  {formatNumber(getAmount(item))}
                </div>
              </div>

              <p className="mt-3 text-sm leading-5 text-gray-800 font-medium">
                {product.name || item.productName || ""}
              </p>
            </div>
          );
        })}

        {details.length === 0 && <StockOutEmptyState minHeight="min-h-[260px]" />}
      </div>

      {/* Desktop view */}
      <div className="hidden overflow-x-auto border-t border-gray-300 lg:block">
        {details.length === 0 ? (
          <StockOutEmptyState minHeight="min-h-[300px]" />
        ) : (
          <table className="w-full min-w-[1500px] border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
                {detailColumns.map((column) => (
                  <th
                    key={column.label}
                    className={`border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 ${column.className}`}
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
                    className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors bg-white"
                  >
                    <td className="px-4 py-3 text-center text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      {product.code || item.productCode || item.productId}
                    </td>
                    <td className="px-4 py-3 leading-5 text-gray-800">
                      {product.name || item.productName || ""}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.fromWarehouseName || fromWarehouse}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.toWarehouseName || toWarehouse}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.unit || item.unit || ""}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                      {formatDecimal(item.quantity)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                      {formatDecimal(unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                      {formatNumber(getAmount(item))}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="bg-gray-50 font-bold text-gray-800">
                <td colSpan={6} className="px-4 py-3 border-t border-gray-300">
                  Tổng cộng
                </td>
                <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-indigo-600">
                  {formatDecimal(totalQuantity)}
                </td>
                <td className="px-4 py-3 border-t border-gray-300"></td>
                <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-indigo-600">
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
