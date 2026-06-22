import React from "react";
import { useNavigate } from "react-router-dom";
import StockOutHeader from "../../components/StockOut/StockOutHeader";
import StockOutInfo from "../../components/StockOut/StockOutInfo";
import StockOutTable from "../../components/StockOut/StockOutTable";
import StockOutFooter from "../../components/StockOut/StockOutFooter";

export default function StockOutCreate({ onBack }) {
       const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col bg-white">
      <StockOutHeader onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        <StockOutInfo />

        <StockOutTable />

        <StockOutFooter
   
      />
      </div>
    </div>
  );
}