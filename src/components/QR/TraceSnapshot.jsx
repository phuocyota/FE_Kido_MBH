import React from "react";
import ProductTraceCard from "./ProductTraceCard";

export default function TraceSnapshot({ params }) {
  const name = params.get("name");
  const valid = params.get("type") === "lot" ? !!params.get("lot") : params.has("serial");
  if (!name || !valid) return <div className="mx-auto max-w-lg p-6">
    <h1 className="text-xl font-bold">Truy xuất nguồn gốc</h1>
    <p className="mt-4">Mã QR không có thông tin sản phẩm. Vui lòng quét lại tem.</p>
  </div>;
  return <ProductTraceCard name={name} params={params} />;
}
