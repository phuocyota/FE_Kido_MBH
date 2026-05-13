import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductsFull } from "../../api/products";

export default function TableProduct() {
  const ITEMS_PER_PAGE = 22;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const categories = await getProductsFull();
        setData(categories.flatMap((category) => category.products || []));
      } catch (error) {
        console.error("Không tải được danh sách hàng hóa", error);
        setData([]);
      }
    };

    loadProducts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Hàng hóa</h1>

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Thêm mới
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Import
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Xuất file
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="max-h-[900px] overflow-y-auto">
    <table className="w-full text-sm">
      
      {/* HEADER */}
      <thead className="bg-blue-50 text-gray-700 sticky top-0 z-10">
        <tr>
          <th className="p-2"><input type="checkbox" /></th>
          <th className="p-2 text-left">Mã hàng</th>
          <th className="p-2 text-left">Tên hàng</th>
          <th className="p-2 text-center">Loại</th>
          <th className="p-2 text-center">Giá bán</th>
          <th className="p-2 text-center">Giá vốn</th>
          <th className="p-2 text-center">Tồn kho</th>
          <th className="p-2 text-center">Đặt hàng</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {currentData.length === 0 && (
          <tr>
            <td colSpan={8} className="p-6 text-center text-gray-500">
              Không có hàng hóa để hiển thị
            </td>
          </tr>
        )}

        {currentData.map((item, index) => (
          <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
            <td className="p-4 text-center"><input type="checkbox" /></td>
            <td className="p-4">{item.sku || item.id}</td>
            <td className="p-4">{item.name}</td>
            <td className="p-4 text-center">{item.category}</td>
            <td className="p-4 text-center">{Number(item.price || 0).toLocaleString()}đ</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">-</td>
            <td className="p-4 text-center">0</td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
