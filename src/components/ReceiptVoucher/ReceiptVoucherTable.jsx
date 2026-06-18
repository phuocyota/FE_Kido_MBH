import React, { useState } from "react";
import receiptVoucherItemsData from "../../datas/receiptVoucherItemsData";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function ReceiptVoucherTable() {
  const totalAmount = receiptVoucherItemsData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(
  receiptVoucherItemsData.length / ITEMS_PER_PAGE
);

const startIndex =
  (currentPage - 1) * ITEMS_PER_PAGE;

const currentData =
  receiptVoucherItemsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 border-b border-indigo-200">
              Diễn giải
            </th>

            <th className="px-4 py-3 text-right w-48 text-xs font-semibold uppercase tracking-wide text-indigo-900 border-b border-indigo-200">
              Số tiền thu
            </th>

            <th className="px-4 py-3 text-left w-56 text-xs font-semibold uppercase tracking-wide text-indigo-900 border-b border-indigo-200">
              Mục thu
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-indigo-50/50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-700">
                {item.description}
              </td>

              <td className="px-4 py-3 text-right font-semibold text-green-600">
                {item.amount.toLocaleString("vi-VN")} ₫
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {item.category}
                </span>
              </td>
            </tr>
          ))}

          {receiptVoucherItemsData.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="h-[450px]"
              >
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p>Không có dữ liệu</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr className="bg-indigo-50 border-t border-indigo-200">
            <td className="px-4 py-3 font-semibold text-indigo-900">
              Tổng cộng
            </td>

            <td className="px-4 py-3 text-right font-bold text-green-600">
              {totalAmount.toLocaleString("vi-VN")} ₫
            </td>

            <td></td>
          </tr>
        </tfoot>
      </table>

      {/* phân trang  */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-300 bg-gradient-to-r from-slate-50 to-gray-50">
  <div className="text-sm text-gray-600">
    Hiển thị
    <span className="mx-1 font-semibold text-indigo-600">
      {startIndex + 1}
    </span>
    -
    <span className="mx-1 font-semibold text-indigo-600">
      {Math.min(
        startIndex + ITEMS_PER_PAGE,
        receiptVoucherItemsData.length
      )}
    </span>
    trên
    <span className="mx-1 font-semibold text-indigo-600">
      {receiptVoucherItemsData.length}
    </span>
    dòng
  </div>

  <div className="flex items-center gap-1">
    <button
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <ChevronsLeft size={16} />
    </button>

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={currentPage === 1}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <ChevronLeft size={16} />
    </button>

    {Array.from(
      { length: totalPages },
      (_, index) => (
        <button
          key={index}
          onClick={() =>
            setCurrentPage(index + 1)
          }
          className={`w-9 h-9 rounded-lg font-medium transition ${
            currentPage === index + 1
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
          }`}
        >
          {index + 1}
        </button>
      )
    )}

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <ChevronRight size={16} />
    </button>

    <button
      onClick={() =>
        setCurrentPage(totalPages)
      }
      disabled={currentPage === totalPages}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <ChevronsRight size={16} />
    </button>
  </div>
</div>
    </div>
  );
}