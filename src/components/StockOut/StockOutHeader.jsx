import React from "react";
import { useNavigate } from "react-router-dom";
import FormPageHeader from "../Management/FormPageHeader";

export default function StockOutHeader({ saleMode = false }) {
  const navigate = useNavigate();
  return (
    <FormPageHeader
      bare
      eyebrow={saleMode ? "Kho / Xuất bán" : "Kho / Xuất kho"}
      title={saleMode ? "Thêm mới phiếu xuất bán" : "Thêm mới phiếu xuất kho"}
      onBack={() => navigate(saleMode ? "/stock-sale" : "/stock-out")}
    />
  );
}
