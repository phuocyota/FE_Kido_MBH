import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import InternalTransferHeader from "../../components/InternalTransfer/InternalTransferHeader";

import InternalTransferDepositInfo from "../../components/InternalTransfer/InternalTransferDepositInfo";
import InternalTransferBankTransferInfo from "../../components/InternalTransfer/InternalTransferBankTransferInfo";
import InternalTransferWithdrawInfo from "../../components/InternalTransfer/InternalTransferWithdrawInfo";

import InternalTransferTable from "../../components/InternalTransfer/InternalTransferTable";
import InternalTransferFooter from "../../components/InternalTransfer/InternalTransferFooter";

export default function InternalTransfer({
  onBack,
}) {
  const [transferType, setTransferType] =
    useState("deposit");

  const renderInfo = () => {
    switch (transferType) {
      case "deposit":
        return (
          <InternalTransferDepositInfo />
        );

      case "bankTransfer":
        return (
          <InternalTransferBankTransferInfo />
        );

      case "withdraw":
        return (
          <InternalTransferWithdrawInfo />
        );

      default:
        return (
          <InternalTransferDepositInfo />
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 mb-4 mt-4 ml-4"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <InternalTransferHeader
        transferType={transferType}
        setTransferType={setTransferType}
      />

      <div className="flex-1 overflow-auto p-4 space-y-4">

        {renderInfo()}

        <InternalTransferTable />

      </div>

      <InternalTransferFooter />

    </div>
  );
}