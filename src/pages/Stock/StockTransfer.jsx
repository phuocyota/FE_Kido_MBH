import React from "react";
import StockTransferInfo from "../../components/StockTransfer/StockTransferInfo";
import StockTransferTable from "../../components/StockTransfer/StockTransferTable";
import StockTransferFooter from "../../components/StockTransfer/StockTransferFooter";

export default function StockTransfer() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-300 px-4 sm:px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Thêm mới phiếu chuyển kho
        </h1>
      </div>

      <div className="p-2 sm:p-4 space-y-4">
        <StockTransferInfo />
        <StockTransferTable />
        <StockTransferFooter />
      </div>
    </div>
  );
}