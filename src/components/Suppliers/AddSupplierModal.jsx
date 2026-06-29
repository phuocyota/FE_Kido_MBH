import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import toast from "react-hot-toast";
import { supplierApi } from "../../api";

const emptyForm = {
  name: "",
  code: "",
  phone: "",
  email: "",
  cccd: "",
  address: "",
  city: "",
  district: "",
  ward: "",
  group: "",
  note: "",
  taxCode: "",
  company: "",
  status: "active",
};

export default function AddSupplierModal({
  open,
  onClose,
  onSaved,
  initialData = null,
}) {
  const isEdit = !!initialData;
  const [showAddress, setShowAddress] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [showInvoice, setShowInvoice] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    setForm({
      name: initialData?.name || "",
      code: initialData?.code || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      cccd: initialData?.cccd || initialData?.idCard || "",
      address: initialData?.address || "",
      city: initialData?.city || initialData?.province || "",
      district: initialData?.district || "",
      ward: initialData?.ward || "",
      group: initialData?.group || "",
      note: initialData?.note || "",
      taxCode: initialData?.taxCode || "",
      company: initialData?.company || initialData?.companyName || "",
      status: initialData?.status || "active",
    });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }

    setSaving(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([key, value]) => {
        const trimmedValue = typeof value === "string" ? value.trim() : value;
        if (trimmedValue !== "") {
          payload[key] = trimmedValue;
        }
      });

      if (isEdit) {
        await supplierApi.update(initialData.id, payload);
        toast.success("Cập nhật nhà cung cấp thành công");
      } else {
        await supplierApi.create(payload);
        toast.success("Thêm nhà cung cấp thành công");
      }

      onSaved?.();
      onClose();
    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          (isEdit
            ? "Không thể cập nhật nhà cung cấp"
            : "Không thể thêm nhà cung cấp")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-2xl font-semibold">
            {isEdit ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
          </h2>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Field label="Tên nhà cung cấp" required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Bắt buộc"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </Field>

            <Field label="Mã nhà cung cấp">
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Tự động"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </Field>

            <Field label="Điện thoại">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </Field>

            <Field label="CCCD">
              <input
                name="cccd"
                value={form.cccd}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </Field>

            <Field label="Trạng thái">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              >
                <option value="active">Đang giao dịch</option>
                <option value="inactive">Ngừng giao dịch</option>
              </select>
            </Field>
          </div>

          <Section
            title="Địa chỉ"
            open={showAddress}
            onToggle={() => setShowAddress((prev) => !prev)}
          >
            <label className="block mb-2 text-sm">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="w-full h-11 border border-gray-300 rounded-xl px-4 mb-4"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Field label="Tỉnh / Thành phố">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full h-11 border border-gray-300 rounded-xl px-4"
                />
              </Field>
              <Field label="Quận / Huyện">
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full h-11 border border-gray-300 rounded-xl px-4"
                />
              </Field>
              <Field label="Phường / Xã">
                <input
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  className="w-full h-11 border border-gray-300 rounded-xl px-4"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Nhóm nhà cung cấp, ghi chú"
            open={showNote}
            onToggle={() => setShowNote((prev) => !prev)}
          >
            <Field label="Nhóm nhà cung cấp">
              <input
                name="group"
                value={form.group}
                onChange={handleChange}
                placeholder="Nhập nhóm nhà cung cấp"
                className="w-full h-11 border border-gray-300 rounded-xl px-4 mb-4"
              />
            </Field>

            <label className="block mb-2 text-sm">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập ghi chú"
              className="w-full border border-gray-300 rounded-xl p-4"
            />
          </Section>

          <Section
            title="Thông tin xuất hóa đơn"
            open={showInvoice}
            onToggle={() => setShowInvoice((prev) => !prev)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Field label="Mã số thuế">
                <input
                  name="taxCode"
                  value={form.taxCode}
                  onChange={handleChange}
                  className="w-full h-11 border border-gray-300 rounded-xl px-4"
                />
              </Field>
              <Field label="Công ty">
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full h-11 border border-gray-300 rounded-xl px-4"
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 h-11 border border-gray-300 rounded-xl font-medium cursor-pointer disabled:opacity-50"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required = false, children }) {
  return (
    <div>
      <label className="block mb-2 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="mt-6 border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button onClick={onToggle}>{open ? <ChevronUp /> : <ChevronDown />}</button>
      </div>
      {open && children}
    </div>
  );
}
