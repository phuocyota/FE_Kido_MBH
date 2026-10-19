import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  RefreshCcw,
  Save,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "../../api";

export default function PriceTable({
  filters,
  setFilters,
  filterControl,
}) {
  const requestId = useRef(0);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedPrices, setEditedPrices] = useState({});
  const searchKeyword = filters.search;
  const ITEMS_PER_PAGE = 22;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const data = await productApi.getAll({
        page: currentPage,
        size: ITEMS_PER_PAGE,
        categoryId: filters.categoryId,
        search: filters.search,
      });
      if (currentRequest !== requestId.current) return;
      setTotalPages(Math.max(1, data.totalPages || 1));
      // Map BE fields to FE format
      const mappedData = data.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        price: parseFloat(p.price),
        cost: parseFloat(p.costPrice),
      }));
      setProducts(mappedData);
    } catch {
      if (currentRequest !== requestId.current) return;
      setProducts([]);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [filters.categoryId, filters.search, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.categoryId, filters.search]);

  const currentData = products;
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
      const items = Object.entries(editedPrices).map(([id, price]) => ({ id, price }));
      await productApi.updateBulk(items);
      toast.success(`Cập nhật ${items.length} sản phẩm thành công`);
      setEditedPrices({});
      fetchProducts();
    } catch {
      toast.error("Không thể cập nhật giá");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm erp-panel">
        <div className="erp-toolbar">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">

            <div className="relative min-w-[200px] flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchKeyword}
                onChange={(event) => {
                  setFilters(prev => ({ ...prev, search: event.target.value }));
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm mã, tên hàng..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterControl}
            <button
              type="button"
              onClick={fetchProducts}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50"
              title="Làm mới"
              aria-label="Làm mới"
            >
              <RefreshCcw size={17} />
            </button>


            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-emerald-600 transition hover:bg-gray-50"
            >
              <FileSpreadsheet size={17} />
              Xuất file
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || Object.keys(editedPrices).length === 0}
              className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>

        <div className="max-h-[800px] overflow-auto">
          <table className="w-full text-sm erp-data-table">

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
                <tr key={item.id || index} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="p-4">{item.code}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-center">{item.cost}</td>
                  <td className="p-4 text-center">{item.cost}</td>

                  <td className="p-4 text-center">
                    <input
                      type="number"
                      value={editedPrices[item.id] ?? item.price}
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

        <div className="flex items-center justify-between border-t border-gray-300 p-4">
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-lg border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-lg border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
