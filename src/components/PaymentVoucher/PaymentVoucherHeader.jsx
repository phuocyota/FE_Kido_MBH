import React from "react";
import VoucherHeader from "../CashManagement/VoucherHeader";
export default function PaymentVoucherHeader({
  expenseType,
  setExpenseType,
  ...props
}) {
  return (
    <VoucherHeader
      {...props}
      kind="Phiếu chi"
      title="Thêm mới phiếu chi"
      value={expenseType}
      onChange={setExpenseType}
      reasonLabel="Chi trả nợ nhà cung cấp"
      description="Chọn nhà cung cấp và số tiền chi để ghi nhận trả nợ."
    />
  );
}
