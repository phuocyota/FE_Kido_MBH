import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import receiptSourceData from "../../datas/receiptSourceData";
import AddSupplierModal from "../Suppliers/AddSupplierModal";
import { customerApi, employeeApi } from "../../api";

const formatToUIDate = (isoStr) => {
  if (!isoStr) return "";
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return isoStr;
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  } catch (e) {
    return isoStr;
  }
};

export default function ReceiptVoucherInfo({
  receiptType,
  selectedSource,
  onChangeSelectedSource,
  paymentMethod,
  onChangePaymentMethod,
  note,
  onChangeNote,
  reference,
  onChangeReference,
  voucherNumber,
  voucherDate,
}) {

const [openSupplierModal, setOpenSupplierModal] = useState(false);
const [sources, setSources] = useState(receiptSourceData);
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (receiptType === "Thu khách hàng") {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await customerApi.getAllWithDebt();
        const mappedCustomers = (data || []).map((cust) => ({
          id: cust.id || cust.customerCode || Math.random().toString(),
          name: cust.fullName || cust.name || "",
          type: "Khách hàng",
          debt: cust.debt || 0,
        }));
        setSources(mappedCustomers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setSources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  } else if (receiptType === "Thu hoàn ứng") {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await employeeApi.getAll();
        const mappedEmployees = (data || []).map((emp) => ({
          id: emp.id || emp.code || Math.random().toString(),
          name: emp.name || emp.fullName || "",
          type: "Nhân viên",
          debt: 0,
        }));
        setSources(mappedEmployees);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setSources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  } else {
    setSources(receiptSourceData);
  }
}, [receiptType]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="xl:col-span-9 space-y-4">
        {/* Phương thức TT */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Phương thức TT <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "CASH"}
                onChange={() => onChangePaymentMethod("CASH")}
                name="payment"
              />
              Tiền mặt
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "BANK"}
                onChange={() => onChangePaymentMethod("BANK")}
                name="payment"
              />
              Tiền gửi
            </label>
          </div>
        </div>

        {/* Thu từ */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Thu từ
          </label>

          <div className="flex">
            <select
              value={selectedSource?.id || ""}
              onChange={(e) => {
                const val = e.target.value;
                const found = sources.find((s) => String(s.id) === String(val)) || null;
                onChangeSelectedSource(found);
              }}
              className="flex-1 h-10 border border-gray-300 rounded-l-lg px-3"
            >
              <option value="">
                {loading ? "Đang tải danh sách..." : "Chọn đối tượng thu"}
              </option>

              {sources.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name} - {item.type} {item.debt > 0 ? `(Nợ: ${item.debt.toLocaleString("vi-VN")} ₫)` : ""}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOpenSupplierModal(true)}
              className="w-10 border border-l-0 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-green-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Diễn giải */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Diễn giải
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3"
            placeholder="Nhập diễn giải..."
          />
        </div>

        {/* Tham chiếu */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Tham chiếu
          </label>

          <input
            type="text"
            value={reference}
            onChange={(e) => onChangeReference(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3"
            placeholder="Nhập tham chiếu..."
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="xl:col-span-3 space-y-4">
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            value={voucherNumber}
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Thời gian <span className="text-red-500">*</span>
          </label>

          <input
            value={formatToUIDate(voucherDate)}
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Người lập phiếu
          </label>

          <input
            value="Nguyễn Hữu Phước"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>
      </div>

      <AddSupplierModal
        open={openSupplierModal}
        onClose={() => setOpenSupplierModal(false)}
      />
    </div>
  );
}