import React from "react";
import VoucherInfoLayout from "../CashManagement/VoucherInfoLayout";
import PaymentVoucherSupplierSelect from "./PaymentVoucherSupplierSelect";
export default function PaymentVoucherPurchaseInfo({
  selectedSupplier,
  onChangeSupplier,
  ...props
}) {
  return (
    <VoucherInfoLayout
      {...props}
      sourceLabel="Chi cho"
      sourceControl={
        <PaymentVoucherSupplierSelect onChange={onChangeSupplier} />
      }
      sourceHint={
        selectedSupplier
          ? `Nợ nhà cung cấp: ${Number(selectedSupplier.debt || 0).toLocaleString("vi-VN")} ₫`
          : undefined
      }
    />
  );
}
