import React, { useState } from "react";

import PaymentVoucherHeader from "../components/PaymentVoucher/PaymentVoucherHeader";
import PaymentVoucherPurchaseInfo from "../components/PaymentVoucher/PaymentVoucherPurchaseInfo";
import PaymentVoucherOtherInfo from "../components/PaymentVoucher/PaymentVoucherOtherInfo";
import PaymentVoucherDetailTable from "../components/PaymentVoucher/PaymentVoucherDetailTable";
import PaymentVoucherFooter from "../components/PaymentVoucher/PaymentVoucherFooter";

export default function PaymentVoucher() {
  const [expenseType, setExpenseType] =
    useState("purchase");

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb]">
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