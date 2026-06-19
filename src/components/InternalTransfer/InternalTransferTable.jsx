import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import internalTransferData from "../../datas/internalTransferData";

export default function InternalTransferTable() {
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil(
    internalTransferData.length /
      ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const currentData =
    internalTransferData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  const totalAmount =
    internalTransferData.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  return (
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 bg-white font-semibold text-gray-800">
        CHI TIẾT CHUYỂN TIỀN
      </div>

      {/* Table */}
      <div className="overflow-auto h-full ">

        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-blue-50 z-10 border-b border-gray-300">
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">

              <th className="p-3 text-center w-20">
                STT
              </th>

              <th className="p-3 text-left">
                Diễn giải
              </th>

              <th className="p-3 text-right w-56">
                Số tiền
              </th>

            </tr>
          </thead>

          <tbody>
            {currentData.map(
              (item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-center">
                    {startIndex +
                      index +
                      1}
                  </td>

                  <td className="p-3">
                    {
                      item.description
                    }
                  </td>

                  <td className="p-3 text-right font-medium">
                    {item.amount.toLocaleString(
                      "vi-VN"
                    )}
                  </td>
                </tr>
              )
            )}

            {currentData.length ===
              0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-10 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 bg-white">
  <div className="flex items-center justify-between px-4 py-3">

    {/* Tổng tiền */}
    <div className="ml-auto flex items-center gap-3">

      <span className="text-gray-600 font-medium uppercase">
        TỔNG TIỀN
      </span>

      <span className="text-xl font-bold text-blue-600">
        {totalAmount.toLocaleString("vi-VN")} đ
      </span>

    </div>

    {/* Phân trang */}
    <div className="flex items-center gap-2 ml-8">

      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
        className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="font-medium min-w-[50px] text-center">
        {currentPage}/{totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage(currentPage + 1)
        }
        className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>

    </div>

  </div>
</div>

    </div>
  );
}