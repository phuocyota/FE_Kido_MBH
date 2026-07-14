import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Plus,
} from "lucide-react";

export default function ReceiptVoucherTable({ items = [], setItems, selectedSource }) {
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentData = items.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "category" && value === "Thu hồi công nợ") {
      newItems[index]["amount"] = selectedSource?.debt || 0;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    const newTotalPages = Math.ceil(newItems.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleAddNewRow = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      description: "",
      amount: 0,
      category: "Doanh thu bán hàng",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    const newTotalPages = Math.ceil(newItems.length / ITEMS_PER_PAGE) || 1;
    setCurrentPage(newTotalPages);
  };

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

            <th className="px-4 py-3 text-center w-16 text-xs font-semibold uppercase tracking-wide text-indigo-900 border-b border-indigo-200">
              Hành động
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item, index) => {
            const globalIndex = startIndex + index;
            return (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-indigo-50/50 transition-colors"
              >
                <td className="px-4 py-2 text-gray-700">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateItem(globalIndex, "description", e.target.value)
                    }
                    className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-2 py-1 outline-none transition"
                    placeholder="Nhập diễn giải..."
                  />
                </td>

                <td className="px-4 py-2 text-right font-semibold text-green-600">
                  <input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) =>
                      handleUpdateItem(
                        globalIndex,
                        "amount",
                        Number(e.target.value) || 0
                      )
                    }
                    className="w-full text-right bg-transparent border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-2 py-1 outline-none font-semibold text-green-600 transition"
                    placeholder="0"
                  />
                </td>

                <td className="px-4 py-2">
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleUpdateItem(globalIndex, "category", e.target.value)
                    }
                    className="bg-blue-100 text-blue-700 border border-transparent hover:border-blue-300 focus:border-indigo-500 rounded px-2 py-1 outline-none text-xs font-semibold rounded-full cursor-pointer transition"
                  >
                    <option value="Doanh thu bán hàng">Doanh thu bán hàng</option>
                    <option value="Thu hồi công nợ">Thu hồi công nợ</option>
                    <option value="Tiền đặt cọc">Tiền đặt cọc</option>
                    <option value="Phí dịch vụ">Phí dịch vụ</option>
                    <option value="Doanh thu online">Doanh thu online</option>
                    <option value="Thu khác">Thu khác</option>
                  </select>
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(globalIndex)}
                    className="text-gray-400 hover:text-red-500 hover:scale-110 transition p-1 cursor-pointer"
                    title="Xóa dòng"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="h-[200px]">
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p>Không có dữ liệu. Hãy thêm dòng mới!</p>
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
            <td></td>
          </tr>
        </tfoot>
      </table>

      {/* Toolbar */}
      <div className="flex gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <button
          type="button"
          onClick={handleAddNewRow}
          className="flex items-center gap-1 px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 text-sm transition font-medium cursor-pointer"
        >
          <Plus size={16} /> Thêm dòng
        </button>
        <button
          type="button"
          onClick={() => setItems([])}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 active:bg-red-100 text-sm transition font-medium cursor-pointer"
        >
          Xóa hết dòng
        </button>
      </div>

      {/* phân trang  */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-300 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="text-sm text-gray-600">
          Hiển thị
          <span className="mx-1 font-semibold text-indigo-600">
            {items.length === 0 ? 0 : startIndex + 1}
          </span>
          -
          <span className="mx-1 font-semibold text-indigo-600">
            {Math.min(startIndex + ITEMS_PER_PAGE, items.length)}
          </span>
          trên
          <span className="mx-1 font-semibold text-indigo-600">{items.length}</span>
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-9 h-9 rounded-lg font-medium transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
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