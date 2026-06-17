import React from "react";

import CashHeader from "../../components/CashManagement/CashHeader";
import CashToolbar from "../../components/CashManagement/CashToolbar";
import CashTable from "../../components/CashManagement/CashTable";

export default function CashManagement() {
  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-4">
  <CashHeader />

  <div className="bg-white border border-gray-300 rounded-lg mt-4 overflow-hidden">
    <CashToolbar />
    <CashTable />
  </div>
</div>
  );
}