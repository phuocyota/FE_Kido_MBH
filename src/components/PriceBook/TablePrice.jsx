import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "../../api";

export default function PriceTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedPrices, setEditedPrices] = useState({});
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
        price: parseFloat(p.price),
        cost: parseFloat(p.costPrice),
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

  const handlePriceChange = (id, value) => {
    const originalPrice = products.find(p => p.id === id)?.price;
    const newPrice = parseFloat(value);
    
    if (newPrice === originalPrice || isNaN(newPrice)) {
      const newEdited = { ...editedPrices };
      delete newEdited[id];
      setEditedPrices(newEdited);
    } else {
      setEditedPrices({ ...editedPrices, [id]: newPrice });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedPrices).map(([id, price]) => 
        productApi.update(id, { price })
      );
      await Promise.all(updates);
      toast.success("Cập nhật giá thành công");
      setEditedPrices({});
      fetchProducts();
    } catch (error) {
      toast.error("Không thể cập nhật giá");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Bảng giá chung</h1>

        <div className="flex gap-2">
          <button
            onClick={handleSaveAll}
            disabled={saving || Object.keys(editedPrices).length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Xuất file
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="max-h-[800px] overflow-y-auto">
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Mã hàng hóa</th>
                <th className="p-3 text-left">Tên hàng</th>
                <th className="p-3 text-center">Giá vốn</th>
                <th className="p-3 text-center">Đơn giá nhập cuối</th>
                <th className="p-3 text-center">Giá mới</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-gray-400">
                    Không có dữ liệu sản phẩm
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="p-4">{item.code}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-center">{item.cost}</td>
                  <td className="p-4 text-center">{item.cost}</td>

                  <td className="p-4 text-center">
                    <input
                      type="number"
                      defaultValue={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className={`border rounded-lg px-3 py-1 w-24 text-right ${editedPrices[item.id] !== undefined ? 'border-blue-500 bg-blue-50' : ''}`}
                    />
                  </td>
                </tr>
              ))
              )}
            </tbody>

          </table>
        </div>
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
  );
}