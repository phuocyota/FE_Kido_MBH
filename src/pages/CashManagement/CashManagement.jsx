import React, { useState } from "react";

import CashHeader from "../../components/CashManagement/CashHeader";
import CashToolbar from "../../components/CashManagement/CashToolbar";
import CashTable from "../../components/CashManagement/CashTable";

import PaymentVoucher from "./PaymentVoucher";
import ReceiptVoucher from "./ReceiptVoucher";
import InternalTransfer from "./InternalTransfer";

export default function CashManagement() {
  const [screen, setScreen] =
    useState("cash");

  if (screen === "paymentVoucher") {
    return (
      <PaymentVoucher
        onBack={() =>
          setScreen("cash")
        }
      />
    );
  }

  if (screen === "receiptVoucher") {
    return (
      <ReceiptVoucher
        onBack={() =>
          setScreen("cash")
        }
      />
    );
  }

    if (screen === "internalTransfer") {
    return (
      <InternalTransfer
        onBack={() =>
          setScreen("cash")
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-4">
      <CashHeader />

      <CashToolbar
        onAddPaymentVoucher={() =>
          setScreen("paymentVoucher")
        }
        onAddReceiptVoucher={() =>
          setScreen("receiptVoucher")
        }
        onAddInternalTransfer={() =>
          setScreen("internalTransfer")
        }
      />

      <CashTable />
    </div>
  );
}