import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PaymentVoucherHeader from "../../components/PaymentVoucher/PaymentVoucherHeader";
import PaymentVoucherPurchaseInfo from "../../components/PaymentVoucher/PaymentVoucherPurchaseInfo";
import PaymentVoucherDetailTable from "../../components/PaymentVoucher/PaymentVoucherDetailTable";
import PaymentVoucherFooter from "../../components/PaymentVoucher/PaymentVoucherFooter";

export default function PaymentVoucher({ onBack }) {
  const [expenseType, setExpenseType] = useState("purchase");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [voucherDate] = useState(() => new Date().toISOString());
  return (
    <div className="erp-page bg-gray-100">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 mb-4 mt-2"
      >
        <ArrowLeft size={18} /> Quay lại
      </button>
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <PaymentVoucherHeader
          expenseType={expenseType}
          setExpenseType={setExpenseType}
          paymentMethod={paymentMethod}
          onChangePaymentMethod={setPaymentMethod}
        />
        <div className="p-4 space-y-4">
          <PaymentVoucherPurchaseInfo
            selectedSupplier={selectedSupplier}
            onChangeSupplier={setSelectedSupplier}
            note={note}
            onChangeNote={setNote}
            reference={reference}
            onChangeReference={setReference}
            voucherDate={voucherDate}
          />
          <PaymentVoucherDetailTable
            items={items}
            setItems={setItems}
            selectedSource={selectedSupplier}
          />
        </div>
        <PaymentVoucherFooter
          onCancel={onBack}
          onChangeFile={(event) =>
            setSelectedFile(event.target.files?.[0] || null)
          }
          selectedFile={selectedFile}
          onClearFile={() => setSelectedFile(null)}
        />
      </div>
    </div>
  );
}
