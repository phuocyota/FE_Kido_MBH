import React, { useState } from "react";
import { Star, FolderMinus } from "lucide-react";

export default function OrdersContent({
  orders,
  currentOrders,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  setItemsPerPage,
  onResetFilters,
  onOrderClick,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("orders_favorites");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    const visibleIds = currentOrders.map((o) => o.id);
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

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("orders_favorites", JSON.stringify(next));
      } catch (e) {
        console.error("Error saving favorites to localStorage:", e);
      }
      return next;
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã hoàn thành":
        return "bg-green-50 text-green-700 border-green-200";
      case "Phiếu tạm":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Đã hủy":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit flex flex-col">
      {orders.length === 0 ? (
        // Empty State matching the screenshot
        <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center p-8 bg-white">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <FolderMinus size={48} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-500 text-center max-w-md text-sm leading-relaxed">
            Không tìm thấy giao dịch nào phù hợp trong tháng này. Nhấn{" "}
            <button
              onClick={onResetFilters}
              className="text-blue-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              vào đây
            </button>{" "}
            để tiếp tục tìm kiếm.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[#eaf2ff] border-b border-gray-200">
                  <th className="p-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={
                        currentOrders.length > 0 &&
                        currentOrders.every((order) => selectedIds.includes(order.id))
                      }
                      onChange={handleToggleAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>

                  <th className="p-3 text-center w-10">
                    {/* Star column header */}
                  </th>

                  <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Mã đặt hàng
                  </th>

                  <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Thời gian
                  </th>

                  <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Mã KH
                  </th>

                  <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Khách hàng
                  </th>

                  <th className="p-3 text-right font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Khách cần trả
                  </th>

                  <th className="p-3 text-right font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Khách đã trả
                  </th>

                  <th className="p-3 text-left font-semibold text-gray-900 text-[14px] whitespace-nowrap">
                    Trạng thái
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => handleToggleRow(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    <td className="p-3 text-center w-10">
                      <button
                        onClick={() => toggleFavorite(order.id)}
                        className="text-gray-300 hover:text-yellow-500 transition cursor-pointer"
                      >
                        <Star
                          size={16}
                          fill={favorites[order.id] ? "#eab308" : "none"}
                          className={favorites[order.id] ? "text-yellow-500" : "text-gray-300"}
                        />
                      </button>
                    </td>

                    <td 
                      onClick={() => onOrderClick?.(order.id)}
                      className="p-3 text-sm text-blue-600 font-medium hover:underline cursor-pointer"
                    >
                      {order.code}
                    </td>

                    <td className="p-3 text-sm text-gray-700">
                      {order.time}
                    </td>

                    <td className="p-3 text-sm text-gray-900">
                      {order.customerCode}
                    </td>

                    <td className="p-3 text-sm text-gray-900 font-medium">
                      {order.customerName}
                    </td>

                    <td className="p-3 text-sm text-right text-gray-900 font-semibold">
                      {Number(order.amountDue || 0).toLocaleString("vi-VN")}
                    </td>

                    <td className="p-3 text-sm text-right text-gray-900 font-semibold">
                      {Number(order.amountPaid || 0).toLocaleString("vi-VN")}
                    </td>

                    <td className="p-3 text-sm">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
}
