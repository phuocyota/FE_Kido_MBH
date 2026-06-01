import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddProductModal from "./AddProductModal";
import toast from "react-hot-toast";
import { productApi } from "../../api";

export default function TableProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 22;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      // Map BE fields to FE format
      const mappedData = data.map(p => ({
        id: p.id,
        code: p.sku,
        name: p.name,
        category: p.category?.name || "",
        price: parseFloat(p.price),
        cost: parseFloat(p.costPrice),
        stock: 0, // Stock not available in products table, use inventory API if needed
      }));
      setProducts(mappedData);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Hàng hóa</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer  "
          >
            + Thêm mới
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            Import
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
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
        {loading ? (
          <tr>
            <td colSpan={8} className="text-center py-14 text-gray-400">
              Đang tải dữ liệu...
            </td>
          </tr>
        ) : currentData.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-14 text-gray-400">
              Không có dữ liệu sản phẩm
            </td>
          </tr>
        ) : (
          currentData.map((item, index) => (
          <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
            <td className="p-4 text-center"><input type="checkbox" /></td>
            <td className="p-4">{item.code}</td>
            <td className="p-4">{item.name}</td>
            <td className="p-4 text-center">{item.category}</td>
            <td className="p-4 text-center">{item.price}</td>
            <td className="p-4 text-center">{item.cost}</td>
            <td className="p-4 text-center">{item.stock}</td>
            <td className="p-4 text-center">0</td>
          </tr>
        ))
        )}
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


      <AddProductModal
  open={openAddModal}
  onClose={() => setOpenAddModal(false)}
  onSave={(data) => {
    console.log("PRODUCT:", data);

    // sau này gọi API tạo sản phẩm
    // createProduct(data)
  }}
/>
    </div>
  );
}