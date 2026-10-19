import React from "react";
import StockDocumentTable from "../Stock/StockDocumentTable";

export default function StockOutTable(props) {
  return (
    <StockDocumentTable
      {...props}
      priceField="price"
      showWarehouse
      showRowNumbers
    />
  );
}
