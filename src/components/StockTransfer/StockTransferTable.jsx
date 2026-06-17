import React, { useState } from "react";
import stockTransferItemsData from "../../datas/stockTransferItemsData";

export default function StockTransferTable() {

const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(
  stockTransferItemsData.length / ITEMS_PER_PAGE
);

const startIndex =
  (currentPage - 1) * ITEMS_PER_PAGE;

const currentData =
  stockTransferItemsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );


  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">

      <div className="p-4 border-b border-gray-300">
        <h2 className="font-semibold text-base sm:text-lg">
          CHI TIẾT
        </h2>
      </div>

      <div className="p-4">
 
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" />
          <span>Quét mã vạch</span>
        </label>

        <div className="overflow-x-auto">

         <table className="w-full min-w-[1100px] border-collapse text-sm">
  <thead>
    <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Mã hàng hóa
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Tên hàng hóa
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Đơn vị tính
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Kho xuất
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Vị trí xuất kho
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Kho nhập
      </th>

      <th className="border-b border-indigo-200 p-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Vị trí nhập kho
      </th>

      <th className="border-b border-indigo-200 p-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
        Số lượng
      </th>
    </tr>
  </thead>

  <tbody>
    {currentData.map((item) => (
      <tr
        key={item.id}
        className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors"
      >
        <td className="p-3">
          <button className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
            {item.code}
          </button>
        </td>

        <td className="p-3 text-gray-700">
          {item.name}
        </td>

        <td className="p-3 text-gray-700">
          {item.unit}
        </td>

        <td className="p-3 text-gray-700">
          {item.fromWarehouse}
        </td>

        <td className="p-3 text-gray-700">
          {item.fromLocation}
        </td>

        <td className="p-3 text-gray-700">
          {item.toWarehouse}
        </td>

        <td className="p-3 text-gray-700">
          {item.toLocation}
        </td>

        <td className="p-3 text-right font-semibold text-indigo-700">
          {item.quantity}
        </td>
      </tr>
    ))}

    {stockTransferItemsData.length === 0 && (
      <tr>
        <td
          colSpan={8}
          className="py-16 text-center text-gray-500"
        >
          Chưa có hàng hóa
        </td>
      </tr>
    )}
  </tbody>
</table>

          {/* phân trang */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">

  <div className="text-sm text-gray-600">
    Hiển thị {startIndex + 1} -{" "}
    {Math.min(
      startIndex + ITEMS_PER_PAGE,
      stockTransferItemsData.length
    )}{" "}
    / {stockTransferItemsData.length} sản phẩm
  </div>

  <div className="flex items-center gap-2">

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={currentPage === 1}
      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
    >
      Trước
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() =>
          setCurrentPage(index + 1)
        }
        className={`px-3 py-1 border rounded ${
          currentPage === index + 1
            ? "bg-blue-600 text-white border-blue-600"
            : "border-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
    >
      Sau
    </button>

  </div>

</div>

        </div>

      </div>

    </div>
  );
}