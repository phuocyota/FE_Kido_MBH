import CashSidebarFilters from "../../components/CashManagement/CashSidebarFilters";
import React, { useState } from "react";

import CashHeader from "../../components/CashManagement/CashHeader";
import CashToolbar from "../../components/CashManagement/CashToolbar";
import CashTable from "../../components/CashManagement/CashTable";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

import PaymentVoucher from "./PaymentVoucher";
import ReceiptVoucher from "./ReceiptVoucher";

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

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <div
        className="erp-page"
      >
        <CashHeader
          onRefresh={handleRefresh}
        />

        <div
          className="space-y-4"
        >

          <main className="min-w-0">
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
              filterControl={
                  <ToolbarFilterDropdown panelClassName="sm:w-[420px]">
                    <CashSidebarFilters filters={filters} setFilters={setFilters} />
                  </ToolbarFilterDropdown>
              }
            />

            <CashTable
              filters={filters}
              refreshTrigger={refreshTrigger}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
