import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { customerApi } from "../../api";

export default function AddCustomerModal({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  if (!open) return null;
  return (
    <CustomerForm
      key={initialData?.id || "new"}
      onClose={onClose}
      onSaved={onSaved}
      initialData={initialData}
    />
  );
}

function CustomerForm({ onClose, onSaved, initialData }) {
  const [formData, setFormData] = useState(() => ({
    customerCode: initialData?.customerCode || "",
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    status: initialData?.status?.toUpperCase() || "ACTIVE",
    type: initialData?.type || "GUEST",
    debtLimit: initialData?.debtLimit ?? 50000,
  }));
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(!initialData);
  const [codeError, setCodeError] = useState("");
  const [codeRetry, setCodeRetry] = useState(0);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    const generateCode = async () => {
      try {
        const result = await customerApi.generateCode();
        if (!result?.customerCode)
          throw new Error("Không nhận được mã khách hàng");
        if (!cancelled)
          setFormData((current) => ({
            ...current,
            customerCode: result.customerCode,
          }));
      } catch {
        if (!cancelled)
          setCodeError("Không thể tạo mã khách hàng. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoadingCode(false);
      }
    };
    generateCode();
    return () => {
      cancelled = true;
    };
  }, [initialData, codeRetry]);

  const retryCode = () => {
    setCodeError("");
    setLoadingCode(true);
    setFormData((current) => ({ ...current, customerCode: "" }));
    setCodeRetry((value) => value + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "debtLimit" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || loadingCode || codeError) return;
    if (!formData.customerCode.trim()) {
      toast.error("Vui lòng nhập mã khách hàng");
      return;
    }
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng");
      return;
    }

    setLoading(true);
    try {
      let savedCustomer;
      const payload = {
        customerCode: formData.customerCode.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        type: formData.type,
        status: formData.status,
        debtLimit: Number(formData.debtLimit),
      };
      if (initialData) {
        savedCustomer = await customerApi.update(initialData.id, payload);
        toast.success("Cập nhật thông tin khách hàng thành công");
      } else {
        savedCustomer = await customerApi.create(payload);
        toast.success("Thêm khách hàng mới thành công");
      }
      onSaved?.(savedCustomer);
      onClose();
    } catch (err) {
      if (!initialData && err.response?.status === 409) {
        setCodeError("Mã khách hàng đã tồn tại. Vui lòng lấy mã mới.");
      }
      toast.error(
        [err.response?.data?.message || "Không thể lưu thông tin khách hàng"]
          .flat()
          .join("\n"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-blue-50/50">
          <h2 className="text-lg font-bold text-blue-900">
            {initialData ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Mã khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerCode"
                value={formData.customerCode}
                onChange={handleChange}
                placeholder={loadingCode ? "Đang tạo mã..." : "Mã tự động"}
                readOnly={!initialData}
                required
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              {codeError && (
                <div role="alert" className="mt-2 text-sm text-red-600">
                  {codeError}
                  <button
                    type="button"
                    onClick={retryCode}
                    className="ml-2 underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}
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
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium text-gray-700"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Ngừng hoạt động</option>
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
              disabled={loading || loadingCode || !!codeError}
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-sm disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
