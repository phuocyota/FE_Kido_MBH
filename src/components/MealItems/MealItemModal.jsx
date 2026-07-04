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
    expectedQuantity: 0,
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
          expectedQuantity: initialData.expectedQuantity || 0,
          status: initialData.status || "ACTIVE",
          note: initialData.note || "",
        });
      } else {
        setFormData({
          productId: "",
          mealPeriod: "BREAKFAST",
          sortOrder: 0,
          expectedQuantity: 0,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
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
        expectedQuantity: Number(formData.expectedQuantity) || 0,
      };

      if (isEdit) {
        const updatePayload = {
          mealPeriod: formData.mealPeriod,
          sortOrder: payload.sortOrder,
          expectedQuantity: payload.expectedQuantity,
          status: formData.status,
          note: formData.note,
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

  const handleSaveAndAdd = async () => {
    if (!formData.productId) {
      toast.error("Vui lòng chọn món ăn");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        branchId,
        sortOrder: Number(formData.sortOrder),
        expectedQuantity: Number(formData.expectedQuantity) || 0,
      };

      await mealItemApi.create(payload);
      toast.success("Thêm món thành công");
      onSuccess();
      // Reset form but keep modal open
      setFormData({
        productId: "",
        mealPeriod: "BREAKFAST",
        sortOrder: 0,
        expectedQuantity: 0,
        status: "ACTIVE",
        note: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-[20px] font-semibold text-gray-800">
            {isEdit ? "Cập nhật món ăn theo buổi" : "Thêm món ăn theo buổi"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition cursor-pointer text-gray-500"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
          <form id="mealItemForm" onSubmit={handleSave}>
            {/* Card 1: Thông tin chung */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-5">Thông tin chung</h3>
              
              <div className="space-y-5">
                {/* Tên sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Món ăn <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.productId}
                    onChange={(e) => handleChange("productId", e.target.value)}
                    disabled={isEdit || loadingProducts}
                    required
                  >
                    <option value="">Chọn món ăn</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Buổi bán */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Buổi bán <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.sortOrder}
                      onChange={(e) => handleChange("sortOrder", e.target.value)}
                    />
                  </div>

                  {/* Số lượng dự kiến */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Số lượng dự kiến
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.expectedQuantity}
                      onChange={(e) => handleChange("expectedQuantity", e.target.value)}
                    />
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Ví dụ: Chỉ bán từ thứ 2 - thứ 6"
                    value={formData.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-gray-200 bg-white flex items-center justify-between">
          {/* Cho phép bán Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-800 font-medium text-sm hover:text-blue-600 transition">
            <input
              type="checkbox"
              className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              checked={formData.status === "ACTIVE"}
              onChange={(e) => handleChange("status", e.target.checked ? "ACTIVE" : "INACTIVE")}
            />
            <span>Cho phép bán</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-11 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer"
              disabled={saving}
            >
              Bỏ qua
            </button>
            
            {!isEdit && (
              <button
                type="button"
                onClick={handleSaveAndAdd}
                className="px-6 h-11 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer"
                disabled={saving}
              >
                Lưu & Tạo thêm
              </button>
            )}

            <button
              type="submit"
              form="mealItemForm"
              className="px-8 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
