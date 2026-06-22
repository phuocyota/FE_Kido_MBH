import React, { useEffect, useState } from "react";
import { ImagePlus, Info, X } from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "../../api";

const emptyForm = {
  name: "",
  categoryId: "",
  tag: "",
  type: "Đồ ăn",
  code: "",
  cost: "",
  price: "",
  location: "",
  weight: "",
  active: true,
  unit: "",
};

export default function AddProductModal({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const isEditMode = !!initialData;
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!open) return;

    setImagePreview(initialData?.imageUrl || null);
    setForm({
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || "",
      tag: initialData?.tag || "",
      type: initialData?.type || "Đồ ăn",
      code: initialData?.sku || initialData?.code || "",
      cost: initialData?.costPrice || initialData?.cost || "",
      price: initialData?.price || "",
      location: initialData?.location || "",
      weight: initialData?.weight || "",
      active: initialData?.isActive ?? initialData?.active ?? true,
      unit: initialData?.unit || "",
    });
  }, [initialData, open]);

  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, [open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (keepOpen = false) => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    const saved = await onSave(form, isEditMode, initialData?.id, keepOpen);
    if (saved && keepOpen && !isEditMode) {
      setForm(emptyForm);
      setImagePreview(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-end md:items-center">
      <div className="bg-white w-full max-w-[1100px] h-screen md:h-auto md:max-h-[95vh] rounded-none md:rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="font-medium">Tên sản phẩm</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Bắt buộc"
              className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nhóm sản phẩm
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
                  >
                    <option value="">Chọn nhóm sản phẩm</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tag sản phẩm
                  </label>
                  <input
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    placeholder="Chọn tag"
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại hàng
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
                  >
                    <option>Đồ ăn</option>
                    <option>Đồ uống</option>
                    <option>Combo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã hàng
                  </label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Tự động"
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
              <label className="cursor-pointer">
                <input type="file" hidden accept="image/*" onChange={handleImage} />
                <div className="w-full max-w-[220px] h-[180px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <ImagePlus size={35} />
                      <span className="mt-2">Thêm ảnh</span>
                      <span className="text-xs mt-1">
                        Mỗi ảnh không quá 2MB
                      </span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="border border-gray-300 rounded-2xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Giá & Thuế</h3>
              <div className="text-sm text-gray-500">
                Lợi nhuận ròng dự kiến: -
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2">
                  Giá vốn
                  <Info size={14} />
                </label>
                <input
                  type="number"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  className="w-full mt-2 border border-gray-300 rounded-xl p-3"
                />
              </div>

              <div>
                <label>Giá bán</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full mt-2 border border-gray-300 rounded-xl p-3"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-2xl p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Vị trí, trọng lượng</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label>Vị trí</label>
                <select className="w-full mt-2 border border-gray-300 rounded-xl p-3">
                  <option>Chọn vị trí</option>
                </select>
              </div>

              <div>
                <label>Trọng lượng</label>
                <div className="flex mt-2">
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="Nhập trọng lượng"
                    className="flex-1 border border-gray-300 rounded-l-xl p-3"
                  />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="border border-gray-300 border-l-0 rounded-r-xl px-3"
                  >
                    <option value="">Đơn vị</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="cái">cái</option>
                    <option value="ly">ly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={() =>
                setForm((prev) => ({ ...prev, active: !prev.active }))
              }
            />
            Cho phép bán
          </label>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl"
            >
              Bỏ qua
            </button>

            {!isEditMode && (
              <button
                onClick={() => handleSubmit(true)}
                className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl"
              >
                Lưu & Tạo thêm
              </button>
            )}

            <button
              onClick={() => handleSubmit(false)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
            >
              {isEditMode ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
