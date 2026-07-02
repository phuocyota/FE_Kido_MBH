import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { inventoryItemApi, stockTakeApi } from "../../api";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

export default function StockTakeModal({ open, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
            code: item.code,
            name: item.name,
            stock: Number(item.quantity || 0),
            actual: Number(item.quantity || 0),
            price: Number(item.costPerUnit || item.price || 0),
          }))
        );
        setSearch("");
        setNote("");
        setCurrentPage(1);
      } catch (err) {
        setProducts([]);
        setError(err?.response?.data?.message || "Không thể tải danh sách hàng hóa");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [open]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      if (
        keyword &&
        !item.code?.toLowerCase().includes(keyword) &&
        !item.name?.toLowerCase().includes(keyword)
      ) {
        return false;
      }

      const diff = Number(item.actual || 0) - Number(item.stock || 0);
      if (activeTab === "match") return diff === 0;
      if (activeTab === "diff") return diff !== 0;
      if (activeTab === "increase") return diff > 0;
      if (activeTab === "decrease") return diff < 0;
      return true;
    });
  }, [activeTab, products, search]);

  const totalCount = products.length;
  const diffCount = products.filter((item) => Number(item.actual || 0) !== Number(item.stock || 0)).length;
  const matchCount = totalCount - diffCount;
  const increaseCount = products.filter((item) => Number(item.actual || 0) > Number(item.stock || 0)).length;
  const decreaseCount = products.filter((item) => Number(item.actual || 0) < Number(item.stock || 0)).length;

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const payload = {
    countedAt: new Date().toISOString(),
    note,
    items: products.map((item) => ({
      productId: item.id,
      actualQuantity: Number(item.actual || 0),
    })),
  };

  const saveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      await stockTakeApi.createDraft(payload);
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể lưu phiếu kiểm kho");
    } finally {
      setSaving(false);
    }
  };

  const complete = async () => {
    try {
      setSaving(true);
      setError("");
      const draft = await stockTakeApi.createDraft(payload);
      await stockTakeApi.complete(draft.id);
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể hoàn thành kiểm kho");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold whitespace-nowrap">Kiểm kho</h2>

          <div className="relative flex-1 max-w-[650px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1 min-h-0">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 bg-white">
            {[
              ["all", `Tất cả (${totalCount})`],
              ["match", `Khớp (${matchCount})`],
              ["diff", `Lệch (${diffCount})`],
              ["increase", `Lệch tăng (${increaseCount})`],
              ["decrease", `Lệch giảm (${decreaseCount})`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentPage(1);
                }}
                className={`px-5 h-12 text-sm font-medium border-b-2 transition cursor-pointer ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="min-w-[900px]">
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
                  {loading && (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-400">
                        Đang tải danh sách hàng hóa...
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-red-500">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    currentProducts.map((item, index) => {
                      const diff = Number(item.actual || 0) - Number(item.stock || 0);
                      return (
                        <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="p-3 text-center">{startIndex + index + 1}</td>
                          <td className="p-3">{item.code}</td>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3 text-center">{item.stock}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.actual}
                              onChange={(event) => {
                                const value = event.target.value;
                                setProducts((prev) =>
                                  prev.map((product) =>
                                    product.id === item.id
                                      ? { ...product, actual: value === "" ? "" : Number(value) }
                                      : product
                                  )
                                );
                              }}
                              className="w-24 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className={`p-3 text-center ${diff === 0 ? "text-gray-700" : "text-blue-600 font-semibold"}`}>
                            {diff}
                          </td>
                          <td className="p-3 text-center">{formatMoney(diff * Number(item.price || 0))}</td>
                        </tr>
                      );
                    })}

                  {!loading && !error && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-400">
                        Chưa có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t bg-white">
            <div className="text-xs sm:text-sm text-gray-500">
              Hiển thị {currentProducts.length} / {filteredProducts.length} mặt hàng
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-9 h-9 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "border"}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[380px] xl:border-l border-t xl:border-t-0 border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center font-semibold text-gray-800">Phiếu kiểm kho mới</div>
            <div className="flex justify-between mt-5 text-sm">
              <span>Tổng SL thực tế</span>
              <span className="font-semibold">
                {products.reduce((sum, item) => sum + Number(item.actual || 0), 0)}
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Ghi chú"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 p-4 min-h-[250px]">
            <div className="h-full border border-gray-300 rounded-xl p-3">
              <h4 className="font-semibold mb-3">Tóm tắt</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Mặt hàng</span><span>{products.length}</span></div>
                <div className="flex justify-between"><span>Khớp</span><span>{matchCount}</span></div>
                <div className="flex justify-between"><span>Lệch</span><span>{diffCount}</span></div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={saveDraft}
              disabled={saving || loading || products.length === 0}
              className="flex-1 h-11 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu tạm"}
            </button>
            <button
              onClick={complete}
              disabled={saving || loading || products.length === 0}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer disabled:opacity-50"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
