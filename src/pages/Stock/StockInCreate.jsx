import React, { useState } from "react";
import StockInHeader from "../../components/StockIn/StockInHeader";
import StockInInfo from "../../components/StockIn/StockInInfo";
import StockInTable from "../../components/StockIn/StockInTable";
import StockInFooter from "../../components/StockIn/StockInFooter";

export default function StockInCreate() {
  const [items, setItems] = useState([
    {
      id: 1,
      code: "",
      name: "",
      warehouse: "Kho mặc định",
      position: "",
      unit: "",
      quantity: 1,
      price: 0,
      amount: 0,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-3">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-visible">

        {/* Header */}
        <StockInHeader />

        {/* Thông tin phiếu */}
        <StockInInfo />

        {/* Bảng chi tiết */}
        <div className="flex-1 overflow-hidden">
          <StockInTable
            items={items}
            setItems={setItems}
          />
        </div>

        {/* Footer */}
        <StockInFooter />

      </div>
    </div>
  );
}