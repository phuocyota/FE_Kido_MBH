import React from "react";
import PageHeader from "../Management/PageHeader";
export default function PaymentVoucherHeader({ expenseType, setExpenseType }) {
  return <PageHeader title="Thêm mới phiếu chi" description="Chọn loại chi và nhập thông tin để lập phiếu chi tiền." eyebrow="Tài chính / Phiếu chi" actions={<select aria-label="Loại chi" value={expenseType} onChange={(event) => setExpenseType(event.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:w-56"><option value="purchase">Chi tiền mua hàng</option><option value="other">Chi khác</option></select>} />;
}
