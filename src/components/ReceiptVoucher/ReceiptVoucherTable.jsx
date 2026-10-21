import React from "react";
import VoucherDetailTable from "../CashManagement/VoucherDetailTable";
export default function ReceiptVoucherTable({ receiptType, ...props }) {
  const categories =
    receiptType === "Thu khách hàng"
      ? ["Thu hồi công nợ"]
      : [
          "Doanh thu bán hàng",
          "Thu hồi công nợ",
          "Tiền đặt cọc",
          "Phí dịch vụ",
          "Doanh thu online",
          "Thu khác",
        ];
  return <VoucherDetailTable {...props} categories={categories} />;
}
