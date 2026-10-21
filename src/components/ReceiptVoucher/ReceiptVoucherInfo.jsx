import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import receiptSourceData from "../../datas/receiptSourceData";
import AddSupplierModal from "../Suppliers/AddSupplierModal";
import { customerApi, employeeApi } from "../../api";
import VoucherInfoLayout from "../CashManagement/VoucherInfoLayout";

export default function ReceiptVoucherInfo({
  receiptType,
  selectedSource,
  onChangeSelectedSource,
  note,
  onChangeNote,
  reference,
  onChangeReference,
  voucherNumber,
  voucherDate,
}) {
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [sources, setSources] = useState([]);
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
    <>
      <VoucherInfoLayout
        sourceLabel="Thu từ"
        sourceControl={
          <div className="flex min-w-0">
            <select
              aria-label="Chọn khách hàng thu nợ"
              value={selectedSource?.id || ""}
              onChange={(e) => {
                const val = e.target.value;
                const found =
                  sources.find((s) => String(s.id) === String(val)) || null;
                onChangeSelectedSource(found);
              }}
              className="min-w-0 flex-1 h-10 border border-gray-300 rounded-l-lg px-3"
            >
              <option value="">
                {loading ? "Đang tải danh sách..." : "Chọn đối tượng thu"}
              </option>

              {sources.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.type}{" "}
                  {item.debt > 0
                    ? `(Nợ: ${item.debt.toLocaleString("vi-VN")} ₫)`
                    : ""}
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
        }
        note={note}
        onChangeNote={onChangeNote}
        reference={reference}
        onChangeReference={onChangeReference}
        voucherNumber={voucherNumber}
        voucherDate={voucherDate}
      />
      <AddSupplierModal
        open={openSupplierModal}
        onClose={() => setOpenSupplierModal(false)}
      />
    </>
  );
}
