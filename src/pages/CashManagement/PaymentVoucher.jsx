import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import PaymentVoucherHeader from "../../components/PaymentVoucher/PaymentVoucherHeader";
import PaymentVoucherPurchaseInfo from "../../components/PaymentVoucher/PaymentVoucherPurchaseInfo";
import PaymentVoucherOtherInfo from "../../components/PaymentVoucher/PaymentVoucherOtherInfo";
import PaymentVoucherDetailTable from "../../components/PaymentVoucher/PaymentVoucherDetailTable";
import PaymentVoucherFooter from "../../components/PaymentVoucher/PaymentVoucherFooter";

export default function PaymentVoucher({
  onBack,
}) {
  const [expenseType, setExpenseType] =
    useState("purchase");

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb]">
      <button
  onClick={onBack}
  className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 mb-4 mt-4"
>
  <ArrowLeft size={18} />
  Quay lại
</button>
      <PaymentVoucherHeader
        expenseType={expenseType}
        setExpenseType={setExpenseType}
        
      />

      <div className="px-3 lg:px-4">
        {expenseType === "purchase" ? (
          <PaymentVoucherPurchaseInfo />
        ) : (
          <PaymentVoucherOtherInfo />
        )}
      </div>

      <div className="flex-1 px-3 lg:px-4 pb-3 overflow-hidden">
        <PaymentVoucherDetailTable />
      </div>

      <PaymentVoucherFooter />
    </div>
  );
}