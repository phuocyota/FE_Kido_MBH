import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { stockLotApi } from "../../api/stockLotApi";
import { LotDetails } from "./StockLots";
import { Panel, RequestState } from "../../components/Warehouse/WarehouseUI";
import { inputClass, date } from "../../components/Warehouse/warehouseFormat";

export default function UnifiedTrace() {
  const [params, setParams] = useSearchParams();
  const id = params.get("id") || "";
  const [input, setInput] = useState(id);
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({
    id: "",
    data: null,
    loading: false,
    error: "",
    matches: [],
  });
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    stockLotApi
      .lookup(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ id, data, loading: false, error: "", matches: [] });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        const payload = error.response?.data;
        setState({
          id,
          data: null,
          loading: false,
          error:
            typeof payload?.message === "string"
              ? payload.message
              : "Không thể truy xuất nguồn gốc. Vui lòng thử lại.",
          matches:
            payload?.code === "TRACE_ID_AMBIGUOUS" ? payload.matches || [] : [],
        });
      });
    return () => controller.abort();
  }, [id, refresh]);
  const loading = !!id && (state.id !== id || state.loading);
  const data = state.id === id ? state.data : null;
  const serial = data?.serial;
  return (
    <>
      <Panel
        title="Truy xuất nguồn gốc"
        description="Nhập ID lô hoặc số serial của sản phẩm. Hệ thống tự xác định loại để truy xuất."
      >
        <form
          className="flex flex-wrap gap-2 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!input.trim()) return;
            setState({
              id: "",
              data: null,
              loading: true,
              error: "",
              matches: [],
            });
            setParams({ id: input.trim() });
            setRefresh((value) => value + 1);
          }}
        >
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              aria-label="ID lô hoặc số serial"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập ID lô hoặc số serial..."
              className={`${inputClass} pl-9`}
              maxLength={128}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-9 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white disabled:opacity-50"
          >
            Truy xuất
          </button>
        </form>
        <RequestState
          loading={loading}
          error={!loading && state.id === id ? state.error : ""}
          retry={() => {
            setState((s) => ({ ...s, loading: true }));
            setRefresh((value) => value + 1);
          }}
        />
        {!loading && state.id === id && state.matches.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 p-4">
            <p className="text-xs text-slate-500">
              Chọn đúng bản ghi để xem nguồn gốc:
            </p>
            {state.matches.map((match) => (
              <Link
                key={
                  match.type === "LOT"
                    ? match.lotId
                    : `${match.detailId}:${match.position}`
                }
                to={
                  match.type === "LOT"
                    ? `/warehouse/trace?lotId=${encodeURIComponent(
                        match.lotId,
                      )}`
                    : `/warehouse/trace?mode=serial&detailId=${encodeURIComponent(
                        match.detailId,
                      )}&position=${match.position}`
                }
                className="block rounded-lg border border-slate-200 p-3 text-sm text-indigo-700 hover:bg-indigo-50"
              >
                {match.type === "LOT"
                  ? `Lô ${match.lotId}`
                  : `${match.serial} · ${match.productName} · ${match.receiptCode}`}
              </Link>
            ))}
          </div>
        )}
        {serial && (
          <div className="space-y-4 border-t border-slate-100 p-4">
            <p className="break-all font-mono font-semibold text-indigo-700">
              {serial.serial}
            </p>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Ngày nhập kho", serial.purchasedAt || serial.receivedAt],
                ["Ngày hết hạn", serial.expiresAt],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="mt-2 text-xl font-bold text-slate-900">
                    {value ? date(value) : "Chưa có thông tin"}
                  </dd>
                </div>
              ))}
            </dl>
            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Hàng hóa", serial.productName],
                ["Mã hàng", serial.productCode],
                ["Số lô", serial.lotCode],
                ["Kho nhập", serial.stockName],
                ["Phiếu nhập", serial.receiptCode],
                ["Nhà cung cấp", serial.supplierName],
                [
                  "Trạng thái phiếu",
                  {
                    COMPLETED: "Đã nhập",
                    DRAFT: "Phiếu nháp",
                    CANCELLED: "Phiếu đã hủy",
                  }[serial.receiptStatus] || serial.receiptStatus,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words font-semibold text-slate-800">
                    {value || "Chưa có thông tin"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-slate-500">
              Nguồn nhập trên thuộc đúng serial này. Lịch sử phía dưới là lịch
              sử chung của lô, chưa xác định xuất/chuyển theo từng serial.
            </p>
          </div>
        )}
      </Panel>
      {data?.type === "LOT" && (
        <LotDetails
          key={data.id}
          lot={{ id: data.id }}
          initialTrace={data.trace}
          onClose={() => setParams({})}
        />
      )}
      {serial?.lotId && data.lotTrace && (
        <LotDetails
          key={`${id}:${serial.lotId}`}
          lot={{ id: serial.lotId, lotCode: serial.lotCode }}
          initialTrace={data.lotTrace}
          onClose={() => setParams({})}
        />
      )}
    </>
  );
}
