import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { productApi, mealItemApi } from "../../api";
import { getBranchIdFromToken } from "../../api/authSession";
import { X } from "lucide-react";

export default function MealItemModal({ open, onClose, initialData, onSuccess }) {
  const isEdit = !!initialData;
  const branchId = getBranchIdFromToken() || "";

  const [formData, setFormData] = useState({
    productId: "",
    mealPeriod: "BREAKFAST",
    sortOrder: 0,
    status: "ACTIVE",
    note: "",
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
      if (initialData) {
        setFormData({
          productId: initialData.productId,
          mealPeriod: initialData.mealPeriod,
          sortOrder: initialData.sortOrder || 0,
          status: initialData.status || "ACTIVE",
          note: initialData.note || "",
        });
      } else {
        setFormData({
          productId: "",
          mealPeriod: "BREAKFAST",
          sortOrder: 0,
          status: "ACTIVE",
          note: "",
        });
      }
    }
  }, [open, initialData]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productApi.getAll({ displayStatus: "active" });
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách món ăn");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error("Vui lòng chọn món ăn");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        branchId, // required by backend for creating
        sortOrder: Number(formData.sortOrder),
      };

      if (isEdit) {
        // Exclude productId & branchId if not required for PUT, but passing them is usually fine. BE expects partial update.
        const updatePayload = {
          mealPeriod: formData.mealPeriod,
          sortOrder: payload.sortOrder,
          status: formData.status,
          note: formData.note
        };
        await mealItemApi.update(initialData.id, updatePayload);
        toast.success("Cập nhật thành công");
      } else {
        await mealItemApi.create(payload);
        toast.success("Thêm món thành công");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{isEdit ? "Cập nhật món ăn theo buổi" : "Thêm món ăn theo buổi"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <form id="mealItemForm" onSubmit={handleSave} className="space-y-4">
            
            {/* Sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Món ăn <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
                value={formData.productId}
                onChange={(e) => handleChange("productId", e.target.value)}
                disabled={isEdit || loadingProducts}
                required
              >
                <option value="">-- Chọn món ăn --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.code || p.sku} - {p.name}</option>
                ))}
              </select>
            </div>

            {/* Buổi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buổi bán <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={formData.mealPeriod}
                onChange={(e) => handleChange("mealPeriod", e.target.value)}
                required
              >
                <option value="BREAKFAST">Sáng</option>
                <option value="LUNCH">Trưa</option>
                <option value="AFTERNOON">Chiều</option>
                <option value="DINNER">Tối</option>
              </select>
            </div>

            {/* Thứ tự */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={formData.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 min-h-[80px]"
                placeholder="Ví dụ: Chỉ bán từ thứ 2 - thứ 6"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
              />
            </div>

          </form>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="submit"
            form="mealItemForm"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thiết lập"}
          </button>
        </div>
      </div>
    </div>
  );
}
