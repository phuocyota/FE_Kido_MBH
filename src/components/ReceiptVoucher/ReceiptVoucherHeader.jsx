import React from "react";
import VoucherHeader from "../CashManagement/VoucherHeader";
export default function ReceiptVoucherHeader({
  receiptType,
  onChangeReceiptType,
  ...props
}) {
  return (
    <VoucherHeader
      {...props}
      kind="Phiếu thu"
      title="Thêm mới phiếu thu"
      value={receiptType}
      onChange={onChangeReceiptType}
      reasonLabel="Thu khách hàng"
      description="Chọn khách hàng và số tiền thu để ghi nhận trả nợ."
    />
  );
}
