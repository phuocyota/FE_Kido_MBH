import React, { useCallback, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { QrCode } from "lucide-react";
import { stockTraceApi } from "../../api/stockTraceApi";
import { useReadQuery } from "../../hooks/useReadQuery";
import { isLotReference, parseTraceInput, traceErrorMessage } from "./traceInput";
import TraceSearchForm from "./TraceSearchForm";
import QrScanner from "./QrScanner";
import FullTraceResult from "./FullTraceResult";
import ProductTraceCard from "./ProductTraceCard";

export default function TraceLookup({ refreshVersion = 0 }) {
  const [params, setParams] = useSearchParams();
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();
  const id = params.get("id") || params.get("lotId") || "";
  const snapshotParams = new URLSearchParams(hash.slice(1));
  const hasSnapshot = snapshotParams.get("name") && (snapshotParams.has("serial") || (snapshotParams.get("type") === "lot" && snapshotParams.get("lot")));
  const [inputError, setInputError] = useState("");
  const load = useCallback((signal) => stockTraceApi.getFull(id, signal), [id]);
  const query = useReadQuery({
    queryKey: [id, refreshVersion], scopeKey: ["full-qr-trace", id],
    enabled: isLotReference(id), load, getErrorMessage: traceErrorMessage,
  });
  const search = (value) => {
    try {
      const result = parseTraceInput(value);
      setInputError("");
      if (result.snapshot) {
        navigate({ pathname, search: "", hash: `#${result.snapshot}` });
      } else {
        setParams({ id: result.lotId, ...(result.serial ? { serial: result.serial } : {}) });
        if (result.lotId === id) query.refetch();
      }
      return true;
    } catch (error) { setInputError(error.message); return false; }
  };
  const error = inputError || (id && !isLotReference(id) ? "ID hoặc mã lô trên đường dẫn không hợp lệ." : query.error);
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><QrCode size={22} className="text-indigo-600" />Product Traceability</h2>
          <p className="mt-1 text-sm text-slate-500">Nhập UUID, mã lô hoặc quét mã QR để xem đầy đủ hồ sơ sản phẩm.</p>
        </div>
        <div className="space-y-4 p-5">
          <TraceSearchForm key={id} initialValue={id} loading={query.loading} onSearch={search} />
          <QrScanner onScan={search} />
          <p className="text-xs leading-5 text-slate-500">Hỗ trợ UUID lô, mã lô và đường dẫn QR. Tra cứu xong, bạn có thể tải hoặc in QR để chia sẻ hồ sơ.</p>
          {error && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}{query.error && <button type="button" onClick={query.refetch} className="ml-2 font-semibold underline">Thử lại</button>}</div>}
        </div>
      </section>
      {query.loading && <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Đang tải hồ sơ truy xuất...</p>}
      {!query.loading && !query.error && isLotReference(id) && <FullTraceResult data={query.data} lotId={id} serial={params.get("serial")} />}
      {!id && hasSnapshot && <div className="space-y-3"><p className="text-sm text-slate-500">Thông tin được lưu trên tem QR cũ.</p><ProductTraceCard key={hash} name={snapshotParams.get("name")} params={snapshotParams} /></div>}
      {!id && !hasSnapshot && <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500"><QrCode size={44} className="mx-auto mb-3 text-indigo-200" /><p className="font-semibold">Sẵn sàng truy xuất</p><p className="mt-2 text-sm">Nhập ID lô, quét bằng camera hoặc tải ảnh QR để bắt đầu.</p></div>}
    </div>
  );
}
