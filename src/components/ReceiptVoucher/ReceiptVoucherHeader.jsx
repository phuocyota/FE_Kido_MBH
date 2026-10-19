import React from "react";
import PageHeader from "../Management/PageHeader";
export default function ReceiptVoucherHeader({ receiptType, onChangeReceiptType }) {
  return <PageHeader title="Thêm mới phiếu thu" description="Chọn loại thu và nguồn thu để ghi nhận khoản tiền nhận vào." eyebrow="Tài chính / Phiếu thu" actions={<select aria-label="Loại thu" value={receiptType} onChange={(event) => onChangeReceiptType(event.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:w-56"><option value="Thu khác">Thu khác</option><option value="Thu khách hàng">Thu khách hàng</option><option value="Thu hoàn ứng">Thu hoàn ứng</option></select>} />;
}
