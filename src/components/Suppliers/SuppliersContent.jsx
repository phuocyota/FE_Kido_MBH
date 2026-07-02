import React, { useMemo, useState, useRef, useEffect } from "react";
import { Edit2, Trash2, ChevronDown } from "lucide-react";
import SupplierDebtDetail from "./SupplierDebtDetail";

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
  const [selectedDebtSupplier, setSelectedDebtSupplier] = useState(null);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const sizeDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

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
    <div className="flex-1 bg-white overflow-hidden h-fit">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              <th className="border-b border-indigo-200 px-4 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    currentSuppliers.length > 0 &&
                    currentSuppliers.every((supplier) => selectedIds.includes(supplier.id))
                  }
                  onChange={handleToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Mã nhà cung cấp
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Tên nhà cung cấp
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Điện thoại
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Email
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Nợ cần trả hiện tại
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Tổng mua
              </th>

              <th className="border-b border-indigo-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-indigo-900 w-28">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {currentSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className={`border-b border-gray-300 transition-colors ${
                  selectedDebtSupplier?.id === supplier.id
                    ? "bg-indigo-50"
                    : "hover:bg-indigo-50/60 bg-white"
                }`}
              >
                <td className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(supplier.id)}
                    onChange={() => handleToggleRow(supplier.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </td>

                <td
                  onClick={() => onEdit?.(supplier)}
                  className="px-4 py-3 font-medium text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  {supplier.code}
                </td>

                <td className="px-4 py-3 text-gray-800 font-semibold">
                  {supplier.name}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {supplier.phone || "-"}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {supplier.email || "-"}
                </td>

                <td 
                  onClick={() => setSelectedDebtSupplier(supplier)}
                  className="px-4 py-3 text-right text-[#5b45ff] font-semibold cursor-pointer hover:underline"
                  title="Nhấn để xem chi tiết công nợ"
                >
                  {Number(supplier.debt || 0).toLocaleString("vi-VN")} ₫
                </td>

                <td className="px-4 py-3 text-right text-gray-700 font-medium">
                  {Number(supplier.totalPurchase || 0).toLocaleString("vi-VN")} ₫
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(supplier)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium"
                    >
                      <Edit2 size={13} />
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(supplier)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
                    >
                      <Trash2 size={13} />
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSuppliers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-300 bg-indigo-50/50">
          <span className="text-sm font-medium text-gray-700">
            Đã chọn <span className="font-semibold">{selectedSuppliers.length}</span> nhà cung cấp
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-300 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Hiển thị</span>
          <div className="relative inline-block" ref={sizeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
              className="h-9 min-w-[95px] rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 flex items-center justify-between gap-1.5 font-medium text-gray-700 transition"
            >
              <span>{itemsPerPage} dòng</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isSizeDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isSizeDropdownOpen && (
              <div className="absolute bottom-[calc(100%+6px)] left-0 z-50 min-w-[105px] bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                {[10, 15, 20, 30, 50].map((size) => {
                  const isSelected = itemsPerPage === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setItemsPerPage?.(size);
                        setCurrentPage(1);
                        setIsSizeDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 ${
                        isSelected ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      {size} dòng
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-md border text-sm font-semibold transition flex items-center justify-center
                  ${
                    currentPage === page
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Debt Detail Panel */}
      {selectedDebtSupplier && (
        <SupplierDebtDetail 
          supplier={selectedDebtSupplier} 
          onClose={() => setSelectedDebtSupplier(null)} 
        />
      )}
    </div>
  );
}
