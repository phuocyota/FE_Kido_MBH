import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { customerApi } from "../../api";

export default function AddCustomerModal({ open, onClose, onSaved, initialData }) {
  const [formData, setFormData] = useState({
    customerCode: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    debt: 0,
    status: "active",
    debtLimit: 50000,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerCode: initialData.customerCode || "",
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        debt: initialData.debt || 0,
        status: initialData.status || "active",
        debtLimit: initialData.debtLimit ?? 50000,
      });
    } else {
      setFormData({
        customerCode: "",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        debt: 0,
        status: "active",
        debtLimit: 50000,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "debt" || name === "debtLimit") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng");
      return;
    }

    setLoading(true);
    try {
      if (initialData) {
        // If edit is needed, we call the create endpoint or update endpoint.
        // As per customerApi, there is only create. We will submit it as a new/updated record.
        await customerApi.create({
          ...formData,
          id: initialData.id,
        });
        toast.success("Cập nhật thông tin khách hàng thành công 🎉");
      } else {
        await customerApi.create(formData);
        toast.success("Thêm khách hàng mới thành công 🎉");
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể lưu thông tin khách hàng ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-indigo-50/50">
          <h2 className="text-lg font-bold text-indigo-900">
            {initialData ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Mã khách hàng
              </label>
              <input
                type="text"
                name="customerCode"
                value={formData.customerCode}
                onChange={handleChange}
                placeholder="Mã tự động sinh"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                required
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập SĐT"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ khách hàng"
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Dư nợ ban đầu (₫)
              </label>
              <input
                type="number"
                name="debt"
                value={formData.debt}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Hạn mức nợ (₫)
              </label>
              <input
                type="number"
                name="debtLimit"
                value={formData.debtLimit}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white font-medium text-gray-700"
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition text-sm disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
