import React, { useState } from "react";
import StockHeader from "../../components/Stock/StockHeader";
import TraceLookup from "../../components/QR/TraceLookup";

export default function WarehouseQr() {
  const [refresh, setRefresh] = useState(0);
  return <main className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
    <StockHeader activeTab="qr" onRefresh={() => setRefresh((value) => value + 1)} />
    <TraceLookup refreshVersion={refresh} />
  </main>;
}
