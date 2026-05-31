import React, { useState } from "react";
import {
  X,
  ImagePlus,
  Info,
  ChevronDown,
} from "lucide-react";

export default function AddProductModal({
  open,
  onClose,
  onSave,
}) {
  const [imagePreview, setImagePreview] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    tag: "",
    type: "Đồ ăn",
    code: "",
    cost: "",
    price: "",
    location: "",
    weight: "",
    active: true,
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  return (
<div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-end md:items-center">
<div className="bg-white w-full max-w-[1100px] h-screen md:h-auto md:max-h-[95vh] rounded-none md:rounded-2xl shadow-xl overflow-hidden flex flex-col">        {/* HEADER */}
<div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">
            Thêm sản phẩm
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
<div className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
          {/* TÊN */}
          <div>
            <label className="font-medium">
              Tên sản phẩm
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Bắt buộc"
              className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          {/* ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

  <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nhóm sản phẩm
        </label>

        <select className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3">
          <option>Chọn nhóm sản phẩm</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tag sản phẩm
        </label>

        <input
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
          placeholder="Tự động"
          className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3"
        />
      </div>

    </div>

  </div>

  <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">

    <label className="cursor-pointer">
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleImage}
      />

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

          {/* GIÁ */}
          <div className="border border-gray-300 rounded-2xl p-5">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">
                Giá & Thuế
              </h3>

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

          {/* VỊ TRÍ */}
          <div className="border border-gray-300 rounded-2xl p-5">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">
                Vị trí, trọng lượng
              </h3>

              {/* <ChevronDown size={18} /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label>Vị trí</label>

                <select
                  className="w-full mt-2 border border-gray-300 rounded-xl p-3"
                >
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

                  <select className="border border-gray-300 border-l-0 rounded-r-xl px-3">
                    <option>g</option> 
                    <option>kg</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-300 px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={form.active}
      onChange={() =>
        setForm({
          ...form,
          active: !form.active,
        })
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

    <button
      className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl"
    >
      Lưu & Tạo thêm
    </button>

    <button
      onClick={() => onSave(form)}
      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
    >
      Lưu
    </button>

  </div>

</div>

      </div>
    </div>
  );
}