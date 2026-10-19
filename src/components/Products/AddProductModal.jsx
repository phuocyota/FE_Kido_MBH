import React, { useEffect, useState } from "react";
import { ImagePlus, Info, X } from "lucide-react";
import toast from "react-hot-toast";
import { stockLotApi } from "../../api/stockLotApi";
import { getBranchIdFromToken } from "../../api/authSession";
import { productApi } from "../../api";

const emptyForm = {
  name: "",
  categoryId: "",
  tag: "",
  type: "Đồ ăn",
  productType: "",
  baseUnitId: "",
  minimumStock: "",
  code: "",
  cost: "",
  price: "",
  location: "",
  weight: "",
  isCanteenItem: true,
  isBoarding: false,
  isFreshFood: false,
  unit: "",
  imageUrl: "",
  ingredients: "",
  description: "",
};

export default function AddProductModal({
  open,
  onClose,
  onSave,
  onTrackingEnabled,
  initialData = null,
}) {
  const isEditMode = !!initialData;
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [unitError, setUnitError] = useState("");
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [enablingTracking, setEnablingTracking] = useState(false);

  useEffect(() => {
    if (!open) return;

    let previewUrl = initialData?.imageUrl || null;
    if (previewUrl && !previewUrl.startsWith("http") && !previewUrl.startsWith("data:")) {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
      if (!previewUrl.startsWith("/")) {
        previewUrl = `/${previewUrl}`;
      }
      previewUrl = `${baseUrl}${previewUrl}`;
    }
    setImagePreview(previewUrl);
    setTrackingEnabled(initialData?.lotTrackingEnabled === true);

    setForm({
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || "",
      tag: initialData?.tag || "",
      type: initialData?.type || "Đồ ăn",
      productType: initialData?.productType || "",
      baseUnitId: initialData?.baseUnitId || "",
      minimumStock: initialData?.minimumStock ?? "",
      code: initialData?.code || "",
      cost: initialData?.costPrice || initialData?.cost || "",
      price: initialData?.price || "",
      location: initialData?.location || "",
      weight: initialData?.weight || "",
      isCanteenItem: initialData?.isCanteenItem ?? true,
      isBoarding: initialData?.isBoarding ?? false,
      isFreshFood: initialData?.isFreshFood ?? false,
      unit: initialData?.unit || "",
      imageUrl: initialData?.imageUrl || "",
      ingredients: initialData?.ingredients || "",
      description: initialData?.description || "",
    });
  }, [initialData, open]);

  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Không thể tải nhóm hàng. Vui lòng đóng và mở lại để thử lại.");
        setCategories([]);
      }
    };

    loadCategories();
    const loadUnits = async () => {
      setUnitError("");
      try {
        const data = await productApi.getMeasurementUnits();
        setUnits(Array.isArray(data) ? data : []);
      } catch {
        setUnitError("Không thể tải đơn vị cơ sở. Đóng và mở lại form để thử lại.");
      }
    };
    loadUnits();
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
    setImageFile(file);
  };

  const handleSubmit = async (keepOpen = false) => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (["INGREDIENT", "FUEL"].includes(form.productType) && !form.baseUnitId) {
      toast.error("Vui lòng chọn đơn vị cơ sở cho nguyên liệu / nhiên liệu.");
      return;
    }
    if (form.minimumStock !== "" && (!Number.isFinite(Number(form.minimumStock)) || Number(form.minimumStock) < 0)) {
      toast.error("Định mức tồn tối thiểu phải là số không âm.");
      return;
    }
    let finalImageUrl = form.imageUrl;

    if (imageFile) {
      setIsUploading(true);
      try {
        const res = await productApi.uploadImage(imageFile);
        finalImageUrl = res.path ? res.path.replace(/^\//, "") : "";
      } catch (err) {
        toast.error("Lỗi khi tải ảnh lên");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload = { ...form, imageUrl: finalImageUrl };
    const saved = await onSave(payload, isEditMode, initialData?.id, keepOpen);
    if (saved && keepOpen && !isEditMode) {
      setForm(emptyForm);
      setImagePreview(null);
      setImageFile(null);
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

          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
            <h3 className="mb-3 font-semibold">Phân loại kho</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">Loại hàng trong kho
                <select aria-label="Loại hàng trong kho" name="productType" value={form.productType} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3">
                  <option value="">Chưa phân loại</option>
                  <option value="INGREDIENT">Nguyên liệu</option><option value="FUEL">Nhiên liệu</option>
                  <option value="FINISHED_GOOD">Thành phẩm</option><option value="MERCHANDISE">Hàng hóa thương mại</option>
                </select>
              </label>
              <label className="text-sm font-medium">Đơn vị cơ sở
                <select aria-label="Đơn vị cơ sở" name="baseUnitId" value={form.baseUnitId} onChange={(event) => {
                  const unit = units.find((item) => item.id === event.target.value);
                  setForm((prev) => ({ ...prev, baseUnitId: event.target.value, ...(unit ? { unit: unit.code } : {}) }));
                }} className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3">
                  <option value="">Chọn đơn vị cơ sở</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.code})</option>)}
                </select>
                {unitError && <span className="mt-1 block text-xs text-red-600">{unitError}</span>}
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">Định mức tồn tối thiểu mỗi kho
              <input name="minimumStock" type="number" min="0" step="0.0001" value={form.minimumStock} onChange={handleChange} placeholder="Chưa thiết lập" className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3" />
              <span className="mt-1 block text-xs font-normal text-slate-500">Theo đơn vị cơ sở, áp dụng từng kho. Để trống khi chưa có định mức.</span>
            </label>
            <p className="mt-3 text-xs text-slate-600">Nhập nguyên, nhiên liệu cần loại Nguyên liệu hoặc Nhiên liệu, có đơn vị cơ sở và bật theo dõi lô. Hàng tươi sống là tùy chọn tính hạn dùng.</p>
            {isEditMode && ["INGREDIENT", "FUEL"].includes(initialData.productType) && initialData.baseUnitId && (
              trackingEnabled ? <p className="mt-3 text-sm font-medium text-emerald-700">Đã bật theo dõi lô.</p> : <button type="button" disabled={enablingTracking || form.productType !== initialData.productType || form.baseUnitId !== initialData.baseUnitId} onClick={async () => {
                setEnablingTracking(true);
                try {
                  await stockLotApi.enableEmptyProductTracking(initialData.id, initialData.branchId || getBranchIdFromToken());
                  setTrackingEnabled(true);
                  onTrackingEnabled?.();
                  toast.success("Đã bật theo dõi lô. Mở lại phiếu nhập để tải cấu hình mới.");
                } catch (error) {
                  const message = error.response?.data?.message || error.message || "Không thể bật theo dõi lô.";
                  toast.error(Array.isArray(message) ? message.join("\n") : message);
                } finally { setEnablingTracking(false); }
              }} className="mt-3 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 disabled:opacity-50">{enablingTracking ? "Đang bật..." : "Bật theo dõi lô (hàng chưa có tồn)"}</button>
            )}
            {!isEditMode && ["INGREDIENT", "FUEL"].includes(form.productType) && <p className="mt-2 text-xs text-blue-700">Sau khi lưu, mở sửa hàng hóa để bật theo dõi lô trước khi nhập kho.</p>}
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

          {form.isBoarding && (
            <div className="border border-gray-300 rounded-2xl p-5 space-y-5">
              <div>
                <label className="font-semibold text-gray-900 block mb-2">Thành phần</label>
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Ví dụ: Cơm trắng, thịt heo, rau luộc"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-900 block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn để phụ huynh xem chi tiết món"
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer" title="Dùng để nhập kho nguyên liệu hoặc nhiên liệu; chọn loại cụ thể ở phần Phân loại kho">
              <input
                type="checkbox"
                checked={["INGREDIENT", "FUEL"].includes(form.productType)}
                onChange={(event) => setForm((prev) => ({
                  ...prev,
                  productType: event.target.checked
                    ? (["INGREDIENT", "FUEL"].includes(prev.productType) ? prev.productType : "INGREDIENT")
                    : "MERCHANDISE",
                }))}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              Nguyên, nhiên liệu
            </label>
            <label className="flex items-center gap-2 cursor-pointer" title="Hạn dùng mặc định 7 ngày sau ngày mua khi nhập kho">
              <input
                type="checkbox"
                checked={form.isFreshFood}
                onChange={(event) => setForm((prev) => ({ ...prev, isFreshFood: event.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              Hàng tươi sống (HSD mặc định 7 ngày)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isCanteenItem}
                onChange={(event) => setForm((prev) => ({ ...prev, isCanteenItem: event.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              Cho phép bán
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBoarding}
                onChange={(event) => setForm((prev) => ({ ...prev, isBoarding: event.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              Bán trú
            </label>
          </div>

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
              disabled={isUploading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {isUploading ? "Đang tải..." : (isEditMode ? "Cập nhật" : "Lưu")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
