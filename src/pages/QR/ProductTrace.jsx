import React from "react";
import { useLocation } from "react-router-dom";
import ProductTraceCard from "../../components/QR/ProductTraceCard";

export default function ProductTrace() {
  const { hash } = useLocation();
  const params = new URLSearchParams(hash.slice(1));
  const name = params.get("name");
  const isLot = params.get("type") === "lot";
  if (!name || (isLot ? !params.get("lot") : !params.has("serial"))) {
    return <main className="mx-auto max-w-lg p-6"><h1 className="text-xl font-bold">Truy xuất nguồn gốc</h1><p className="mt-4">Mã QR không có thông tin sản phẩm. Vui lòng quét lại tem.</p></main>;
  }
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <ProductTraceCard name={name} params={params} />
    </main>
  );
}
