import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function SuppliersContent({
  suppliers,
  currentSuppliers,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">
  <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-[#eaf2ff] border-b">
            <th className="p-3">
              <input type="checkbox" />
            </th>

            <th className="p-3 text-left">
              Mã nhà cung cấp
            </th>

            <th className="p-3 text-left">
              Tên nhà cung cấp
            </th>

            <th className="p-3 text-left">
              Điện thoại
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-right">
              Nợ cần trả hiện tại
            </th>

            <th className="p-3 text-right">
              Tổng mua
            </th>
            <th className="p-3 text-center">
              Thao tÃ¡c
            </th>
          </tr>
        </thead>

        <tbody>
          {currentSuppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="border-b border-gray-200"
            >
              <td className="p-3">
                <input type="checkbox" />
              </td>

              <td className="p-3">
                {supplier.code}
              </td>

              <td className="p-3">
                {supplier.name}
              </td>

              <td className="p-3">
                {supplier.phone}
              </td>

              <td className="p-3">
                {supplier.email}
              </td>

              <td className="p-3 text-right">
                {Number(supplier.debt || 0).toLocaleString(
                  "vi-VN"
                )}
              </td>

              <td className="p-3 text-right">
                {Number(supplier.totalPurchase || 0).toLocaleString(
                  "vi-VN"
                )}
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => onEdit?.(supplier)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Sua nha cung cap"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete?.(supplier)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Xoa nha cung cap"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody> 
      </table>
      </div>

       {/* Pagination */}
<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">

  <div className="text-sm text-gray-500">
    Hiển thị{" "}
    <span className="font-medium">
      {startIndex + 1}
    </span>
    {" - "}
    <span className="font-medium">
      {Math.min(
        startIndex + itemsPerPage,
        suppliers.length
      )}
    </span>
    {" / "}
    <span className="font-medium">
      {suppliers.length}
    </span>
    {" "}nhà cung cấp
  </div>

  <div className="flex items-center gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((prev) => prev - 1)
      }
      className="h-9 px-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Trước
    </button>

    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`h-9 w-9 rounded-lg border text-sm font-medium transition
          ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    })}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((prev) => prev + 1)
      }
      className="h-9 px-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Sau
    </button>

  </div>

</div>
    </div>
  );
}
