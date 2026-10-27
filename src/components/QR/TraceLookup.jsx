import React, { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { stockTraceApi } from "../../api/stockTraceApi";
import { useReadQuery } from "../../hooks/useReadQuery";
import { isLotReference, traceErrorMessage } from "./traceInput";
import { fullTraceModel } from "./fullTraceModel";
import ProductTraceCard from "./ProductTraceCard";
import TraceSnapshot from "./TraceSnapshot";

export default function TraceLookup() {
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const id = params.get("id") || params.get("lotId") || "";
  const load = useCallback((signal) => stockTraceApi.getFull(id, signal), [id]);
  const query = useReadQuery({
    queryKey: [id], scopeKey: ["qr-trace", id],
    enabled: isLotReference(id), load, getErrorMessage: traceErrorMessage,
  });
  if (!id) return <TraceSnapshot key={hash} params={new URLSearchParams(hash.slice(1))} />;
  const error = !isLotReference(id) ? "ID hoặc mã lô trên đường dẫn không hợp lệ." : query.error;
  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
    {error}{query.error && <button type="button" onClick={query.refetch} className="ml-2 font-semibold underline">Thử lại</button>}
  </p>;
  if (query.loading) return <p role="status" className="p-6 text-center text-sm text-slate-500">Đang tải hồ sơ truy xuất...</p>;
  const model = fullTraceModel(query.data, id);
  if (!model) return <p role="status" className="p-6 text-sm text-slate-500">Không tìm thấy hồ sơ truy xuất cho ID này.</p>;
  if (params.get("serial")) model.params.set("serial", params.get("serial"));
  return <ProductTraceCard key={id} name={model.params.get("name")} params={model.params} live />;
}
