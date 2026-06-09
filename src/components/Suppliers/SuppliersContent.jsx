import React from "react";

export default function SuppliersContent({
  suppliers,
  currentSuppliers,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
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
                {supplier.debt.toLocaleString(
                  "vi-VN"
                )}
              </td>

              <td className="p-3 text-right">
                {supplier.totalPurchase.toLocaleString(
                  "vi-VN"
                )}
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