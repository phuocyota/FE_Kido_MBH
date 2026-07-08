import React, { useState } from "react";

import CashHeader from "../../components/CashManagement/CashHeader";
import CashToolbar from "../../components/CashManagement/CashToolbar";
import CashTable from "../../components/CashManagement/CashTable";

import PaymentVoucher from "./PaymentVoucher";
import ReceiptVoucher from "./ReceiptVoucher";
import InternalTransfer from "./InternalTransfer";

export default function CashManagement() {
  const [screen, setScreen] = useState("cash");

  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [filters, setFilters] = useState({
    from: formatDateStr(defaultFrom),
    to: formatDateStr(today),
    search: "",
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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
    <div className="min-h-screen bg-gray-100 py-3 md:py-4">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        <CashHeader
          onRefresh={handleRefresh}
        />

        <CashToolbar
          filters={filters}
          setFilters={setFilters}
          onRefresh={handleRefresh}
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

        <CashTable
          filters={filters}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}