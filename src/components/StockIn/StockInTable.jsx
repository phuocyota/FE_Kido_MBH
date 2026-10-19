import React from "react";
import StockDocumentTable from "../Stock/StockDocumentTable";

export default function StockInTable(props) {
  return <StockDocumentTable {...props} priceField="costPrice" />;
}
