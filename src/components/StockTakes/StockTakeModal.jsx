import React, { useEffect, useState } from "react";
import { Search, X, ChevronRight, Upload } from "lucide-react";
import { inventoryItemApi } from "../../api";

export default function StockTakeModal({ open, onClose }) {

      const [activeTab, setActiveTab] = useState("all");
      const [products, setProducts] = useState([]);
      const [search, setSearch] = useState("");
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");

      useEffect(() => {
        if (!open) return;

        const loadProducts = async () => {
          try {
            setLoading(true);
            setError("");
            const data = await inventoryItemApi.getAll();
            const items = Array.isArray(data) ? data : [];
            setProducts(
              items.map((item) => ({
                id: item.id,
                code: item.sku,
                name: item.name,
                stock: Number(item.quantity || 0),
                actual: null,
                price: Number(item.costPerUnit || 0),
              }))
            );
            setCurrentPage(1);
          } catch (err) {
            setProducts([]);
            setError("Không thể tải danh sách hàng hóa");
          } finally {
            setLoading(false);
          }
        };

        loadProducts();
      }, [open]);

      const filteredProducts = products.filter((item) => {
  const keyword = search.trim().toLowerCase();

  if (
    keyword &&
    !item.code?.toLowerCase().includes(keyword) &&
    !item.name?.toLowerCase().includes(keyword)
  ) {
    return false;
  }

  switch (activeTab) {
    case "match":
      return item.actual !== null && item.actual === item.stock;

    case "diff":
      return item.actual !== null && item.actual !== item.stock;

    case "unchecked":
      return item.actual === null;

    default:
      return true;
  }
});

const totalCount = products.length;

const matchCount = products.filter(
  (item) =>
    item.actual !== null &&
    item.actual === item.stock
).length;

const diffCount = products.filter(
  (item) =>
    item.actual !== null &&
    item.actual !== item.stock
).length;

const uncheckedCount = products.filter(
  (item) =>
    item.actual === null
).length;


// phân trang 
const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;
const totalPages = Math.max(
  1,
  Math.ceil(filteredProducts.length / itemsPerPage)
);
const startIndex =
  (currentPage - 1) * itemsPerPage;

const currentProducts =
  filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleChangeTab = (tab) => {
  setActiveTab(tab);
  setCurrentPage(1);
};

  if (!open) return null;
  

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* HEADER */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold whitespace-nowrap">
              Kiểm kho
            </h2>

            <div className="relative flex-1 max-w-[650px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Tìm hàng hóa theo mã hoặc tên"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col xl:flex-row flex-1 min-h-0">
        {/* LEFT */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TABS */}
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 bg-white ">
  <button
    onClick={() => handleChangeTab("all")}
    className={`px-5 h-12 text-sm font-medium border-b-2 transition cursor-pointer ${
      activeTab === "all"
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`}
  >
    Tất cả ({totalCount})
  </button>

  <button
    onClick={() => setActiveTab("match")}
    className={`px-5 h-12 text-sm font-medium border-b-2 transition cursor-pointer ${
      activeTab === "match"
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`}
  >
    Khớp ({matchCount})
  </button>

  <button
    onClick={() => setActiveTab("diff")}
    className={`px-5 h-12 text-sm font-medium border-b-2 transition cursor-pointer ${
      activeTab === "diff"
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`}
  >
    Lệch ({diffCount})
  </button>

  <button
    onClick={() => setActiveTab("unchecked")}
    className={`px-5 h-12 text-sm font-medium border-b-2 transition cursor-pointer ${
      activeTab === "unchecked"
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`}
  >
    Chưa kiểm ({uncheckedCount})
  </button>
</div>

          {/* TABLE */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
  <div className="min-w-[700px] lg:min-w-[900px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-blue-50 z-10">
                  <tr>
                    <th className="p-3 text-center">STT</th>
                    <th className="p-3 text-left">Mã hàng hóa</th>
                    <th className="p-3 text-left">Tên hàng</th>
                    <th className="p-3 text-center">Tồn kho</th>
                    <th className="p-3 text-center">Thực tế</th>
                    <th className="p-3 text-center">SL lệch</th>
                    <th className="p-3 text-center">Giá trị lệch</th>
                  </tr>
                </thead>

               <tbody>
  {/* Upload Box */}
  

  {/* Danh sách sản phẩm */}
  {loading && (
    <tr>
      <td
        colSpan="7"
        className="text-center py-10 text-gray-400"
      >
        Đang tải danh sách hàng hóa...
      </td>
    </tr>
  )}

  {!loading && error && (
    <tr>
      <td
        colSpan="7"
        className="text-center py-10 text-red-500"
      >
        {error}
      </td>
    </tr>
  )}

  {!loading && !error && currentProducts.map((item, index) => (
    <tr
      key={item.id}
      className="border-b border-gray-300 hover:bg-gray-50"
    >
      <td className="p-3 text-center">
        {startIndex + index + 1}
      </td>

      <td className="p-3">
        {item.code}
      </td>

      <td className="p-3">
        {item.name}
      </td>

      <td className="p-3 text-center">
        {item.stock}
      </td>

      <td className="p-3 text-center">
        {item.actual ?? ""}
      </td>

      <td className="p-3 text-center">
        {item.actual != null
          ? item.actual - item.stock
          : ""}
      </td>

      <td className="p-3 text-center">
        -
      </td>
    </tr>
  ))}

  {!loading && !error && filteredProducts.length === 0 && (
    <tr>
      <td
        colSpan="7"
        className="text-center py-10 text-gray-400"
      >
        Chưa có sản phẩm nào
      </td>
    </tr>
  )}

   
</tbody>
              </table>


              <div className="border-t border-gray-200 bg-white p-4 md:p-6">
  <div className="max-w-[900px] mx-auto border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/30 p-5 md:p-8 text-center">
    <p className="text-gray-700 font-medium text-sm md:text-base">
      Nhấn chọn hoặc kéo thả file dữ liệu vào đây
    </p>

    <p className="text-gray-400 text-sm mt-2 mb-5">
      Chỉ nhận file Excel định dạng .xlsx
    </p>

    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg inline-flex items-center gap-2 font-medium transition-all cursor-pointer">
      <Upload size={18} />4
      Chọn file
    </button>
  </div>
</div>
            </div>
          </div>


          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t bg-white">
  <div className="text-xs sm:text-sm text-gray-500">
    Hiển thị {currentProducts.length} /{" "}
    {filteredProducts.length} mặt hàng
  </div>

  <div className="flex items-center gap-1 overflow-x-auto pb-1">
    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((prev) => prev - 1)
      }
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Trước
    </button>

    {Array.from(
      { length: totalPages },
      (_, i) => (
        <button
          key={i}
          onClick={() =>
            setCurrentPage(i + 1)
          }
          className={`w-9 h-9 rounded ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "border"
          }`}
        >
          {i + 1}
        </button>
      )
    )}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((prev) => prev + 1)
      }
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Sau
    </button>
  </div>
</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full xl:w-[380px] xl:border-l border-t xl:border-t-0 border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center font-semibold text-gray-800">
              Danh-02/06/2026 10:46
              <ChevronRight size={16} />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Mã kiểm kho
              </label>

              <input
                type="text"
                placeholder="Mã phiếu tự động"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-5 text-sm">
              <span>Tổng SL thực tế</span>
              <span className="font-semibold">0</span>
            </div>

            <textarea
              rows={4}
              placeholder="Ghi chú"
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 p-4 min-h-[250px]">
            <div className="h-full border border-gray-300 rounded-xl p-3">
              <h4 className="font-semibold mb-3">
                Kiểm gần đây
              </h4>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-3">
            <button className="flex-1 h-11 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 cursor-pointer">
              Lưu tạm
            </button>

            <button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer ">
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}