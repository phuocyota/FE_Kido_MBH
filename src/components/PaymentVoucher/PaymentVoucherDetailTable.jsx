import React from "react";
import VoucherDetailTable from "../CashManagement/VoucherDetailTable";
export default function PaymentVoucherDetailTable(props) {
  return (
    <VoucherDetailTable
      {...props}
      direction="payment"
      categories={["Trả nợ nhà cung cấp"]}
    />
  );
}
