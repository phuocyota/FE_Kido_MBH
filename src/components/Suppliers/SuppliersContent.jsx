import React, { useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function SuppliersContent({
  suppliers,
  currentSuppliers,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  onEdit,
  onDelete,
  onBulkDelete,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedSuppliers = useMemo(
    () => suppliers.filter((supplier) => selectedIds.includes(supplier.id)),
    [selectedIds, suppliers]
  );

  // Toggle individual row checkbox
  const handleToggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all row checkboxes on current page
  const handleToggleAll = () => {
    const visibleIds = currentSuppliers.map((s) => s.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const next = [...prev];
        visibleIds.forEach((id) => {
          if (!next.includes(id)) {
            next.push(id);
          }
        });
        return next;
      });
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-[#eaf2ff] border-b border-gray-200">
              <th className="p-3 text-center w-12">
                <input
                  type="checkbox"
                  checked={
                    currentSuppliers.length > 0 &&
                    currentSuppliers.every((supplier) => selectedIds.includes(supplier.id))
                  }
                  onChange={handleToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>

              <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Mã nhà cung cấp
              </th>

              <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Tên nhà cung cấp
              </th>

              <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Điện thoại
              </th>

              <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Email
              </th>

              <th className="p-3 text-right font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Nợ cần trả hiện tại
              </th>

              <th className="p-3 text-right font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                Tổng mua
              </th>

              <th className="p-3 text-center font-semibold text-gray-900 text-[14px] whitespace-nowrap w-28">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {currentSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(supplier.id)}
                    onChange={() => handleToggleRow(supplier.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>

                <td 
                  onClick={() => onEdit?.(supplier)}
                  className="p-3 text-sm text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  {supplier.code}
                </td>

                <td className="p-3 text-sm text-gray-900 font-medium">
                  {supplier.name}
                </td>

                <td className="p-3 text-sm text-gray-700">
                  {supplier.phone || ""}
                </td>

                <td className="p-3 text-sm text-gray-700">
                  {supplier.email || ""}
                </td>

                <td className="p-3 text-sm text-right text-gray-900 font-medium">
                  {Number(supplier.debt || 0).toLocaleString("vi-VN")}
                </td>

                <td className="p-3 text-sm text-right text-gray-900 font-medium">
                  {Number(supplier.totalPurchase || 0).toLocaleString("vi-VN")}
                </td>

                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(supplier)}
                      title="Sửa nhà cung cấp"
                      aria-label="Sửa nhà cung cấp"
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(supplier)}
                      title="Xoá nhà cung cấp"
                      aria-label="Xoá nhà cung cấp"
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSuppliers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-slate-50">
          <span className="text-sm font-medium text-gray-700">
            Đã chọn {selectedSuppliers.length} nhà cung cấp
          </span>

          <button
            type="button"
            onClick={async () => {
              const deleted = await onBulkDelete?.(selectedSuppliers);
              if (deleted) {
                setSelectedIds([]);
              }
            }}
            className="h-9 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 size={16} />
            Xoá đã chọn
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage?.(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 outline-none cursor-pointer text-xs font-semibold"
          >
            <option value={10}>10 dòng</option>
            <option value={15}>15 dòng</option>
            <option value={20}>20 dòng</option>
            <option value={30}>30 dòng</option>
            <option value={50}>50 dòng</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="h-9 px-4 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            Trước
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center justify-center
                ${
                  currentPage === page
                    ? "bg-[#0f62fe] text-white border-[#0f62fe] shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="h-9 px-4 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
