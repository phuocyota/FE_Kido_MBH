import React, { useState } from "react";
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
    <div className="erp-page">
      <div className="erp-panel overflow-hidden">
        <PaymentVoucherHeader
          onBack={onBack}
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
