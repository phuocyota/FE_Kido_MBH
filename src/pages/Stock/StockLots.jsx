import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Plus, Search, X } from "lucide-react";
import LotSerialList from "../../components/Stock/LotSerialList";
import StockSerials from "./StockSerials";
import StockHeader from "../../components/Stock/StockHeader";
import StockInPagination from "../../components/StockIn/StockInPagination";
import { stockLotApi } from "../../api/stockLotApi";
import { lotTypes, lotStatus, lotDate, lotNumber } from "../../components/Stock/stockLotDisplay";

const errorText = (error, fallback) => {
  if (error.response?.status === 403) return "Bạn không có quyền xem lô hàng của chi nhánh này.";
  if (error.response?.status === 404) return "Chưa truy cập được API lô hàng. Vui lòng thử lại sau.";
  return fallback;
};
const fieldClass = "h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function Status({ lot }) {
  const status = lotStatus(lot);
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>;
}

export default function StockLots() {
  const [params] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const serial = params.get("tab") === "serial";
  return (
    <div className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
      <StockHeader
        activeTab="lots"
        onRefresh={() => setRefresh((v) => v + 1)}
      />
      <nav
        aria-label="Quản lý lô và serial"
        className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1"
      >
        {[
          [false, "Lô hàng", "/stock-lots"],
          [true, "Serial", "/stock-lots?tab=serial"],
        ].map(([active, label, to]) => (
          <Link
            key={label}
            to={to}
            aria-current={serial === active ? "page" : undefined}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
              serial === active
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {serial ? (
        <StockSerials key={`${refresh}:${params.toString()}`} />
      ) : (
        <StockLotList key={`${refresh}:${params.toString()}`} />
      )}
    </div>
  );
}

function StockLotList() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(() => ({ search: params.get("search") || "", status: ["AVAILABLE", "EXPIRING", "EXPIRED", "DEPLETED"].includes(params.get("status")) ? params.get("status") : "", productType: "" }));
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await stockLotApi.getAll({ ...filters, page, size }, controller.signal);
        if (!controller.signal.aborted) {
          if (page > 1 && page > Math.max(1, Math.ceil(data.total / size))) {
            setPage(Math.max(1, Math.ceil(data.total / size)));
          } else setResult(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(errorText(err, "Không thể tải lô hàng. Vui lòng thử lại."));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filters, page, size, refresh]);

  const updateFilters = (name, value) => {
    setLoading(true);
    setSelected(null);
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };
  const reload = () => { setLoading(true); setSelected(null); setRefresh((value) => value + 1); };

  return (
    <div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><Package size={22} className="text-blue-600" />Lô hàng hóa</h2>
            <p className="mt-1 text-sm text-slate-500">Theo dõi tồn kho theo lô và hạn sử dụng. Lô sắp hết hạn trong 7 ngày được đánh dấu.</p>
          </div>
          <Link to="/stock-in/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} />Nhập kho</Link>
        </div>
        <div className="grid gap-2 border-b border-slate-100 bg-white p-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_220px_220px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input aria-label="Tìm lô hàng" placeholder="Tìm số lô, mã hoặc tên hàng hóa..." value={filters.search} onChange={(event) => updateFilters("search", event.target.value)} className={`${fieldClass} w-full pl-10`} />
          </div>
          <select aria-label="Trạng thái lô" value={filters.status} onChange={(event) => updateFilters("status", event.target.value)} className={fieldClass}>
            <option value="">Tất cả trạng thái</option><option value="AVAILABLE">Còn sử dụng, còn tồn</option><option value="EXPIRING">Sắp hết hạn (7 ngày)</option><option value="EXPIRED">Đã hết hạn, còn tồn</option><option value="DEPLETED">Đã hết hàng</option>
          </select>
          <select aria-label="Loại hàng hóa" value={filters.productType} onChange={(event) => updateFilters("productType", event.target.value)} className={fieldClass}>
            <option value="">Tất cả loại hàng</option>{Object.entries(lotTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        {error ? <div role="alert" className="p-8 text-center text-red-700">{error}<button onClick={reload} className="ml-3 font-semibold underline">Thử lại</button></div> : loading ? <div role="status" className="p-12 text-center text-slate-500">Đang tải lô hàng...</div> : result.items.length === 0 ? <div className="p-12 text-center text-slate-500">Không có lô hàng phù hợp. Các lô được tạo khi nhập kho hàng có bật theo dõi lô.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-blue-600 text-xs uppercase text-white"><tr>{["Số lô", "Hàng hóa", "Kho", "Ngày sản xuất", "Hạn sử dụng", "Tồn còn lại", "Trạng thái", ""].map((title, index) => <th key={index} className="whitespace-nowrap px-4 py-3">{title}</th>)}</tr></thead>
              <tbody>{result.items.map((lot) => (
                <tr key={lot.id} className={`border-b border-slate-100 hover:bg-blue-50 ${selected?.id === lot.id ? "bg-blue-50" : ""}`}>
                  <td className="max-w-[240px] break-all px-4 py-4 font-medium text-blue-700"><button type="button" onClick={() => setSelected(lot)} className="break-all text-left hover:underline" aria-label={`Xem chi tiết và serial lô ${lot.lotCode}`}>{lot.lotCode}</button></td>
                  <td className="px-4 py-4"><div className="font-semibold text-slate-800">{lot.product?.name || "—"}</div><div className="mt-1 text-xs text-slate-500">{lot.product?.code} · {lotTypes[lot.product?.productType] || "Chưa phân loại"}{lot.product?.isFreshFood ? " · Tươi sống" : ""}</div></td>
                  <td className="px-4 py-4 text-slate-600">{lot.stock?.name || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-4">{lotDate(lot.manufacturedAt)}</td><td className="whitespace-nowrap px-4 py-4">{lotDate(lot.expiresAt)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums">{lotNumber(lot.quantity)} <span className="font-normal text-slate-500">{lot.baseUnit?.code || lot.product?.unit || ""}</span></td>
                  <td className="px-4 py-4"><Status lot={lot} /></td>
                  <td className="px-4 py-4"><button onClick={() => setSelected(lot)} className="whitespace-nowrap font-semibold text-blue-600 hover:underline" aria-label={`Chi tiết lô ${lot.lotCode}`}>Chi tiết</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {!loading && !error && <StockInPagination total={result.total} currentPage={page} pageSize={size} onPageChange={(value) => { setLoading(true); setSelected(null); setPage(value); }} onPageSizeChange={(value) => { setLoading(true); setSelected(null); setSize(value); setPage(1); }} />}
      </section>
      {selected && <LotDetails key={selected.id} lot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export function LotDetails({ lot, onClose, initialTrace }) {
  const panel = useRef(null);
  const [trace, setTrace] = useState(initialTrace || null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  useEffect(() => {
    if (initialTrace) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await stockLotApi.getTrace(lot.id, controller.signal);
        if (!controller.signal.aborted) setTrace(data);
      } catch (err) {
        if (!controller.signal.aborted) setError(errorText(err, "Không thể tải lịch sử lô hàng. Vui lòng thử lại."));
      }
    };
    load();
    return () => controller.abort();
  }, [lot.id, retry, initialTrace]);
  return (
    <section ref={panel} aria-label="Chi tiết lô hàng" className="mt-4 rounded-xl border border-blue-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold text-slate-900">Chi tiết lô hàng</h3><p className="mt-1 break-all text-sm text-blue-700">{trace?.lot?.code || lot.lotCode}</p></div><button onClick={onClose} aria-label="Đóng chi tiết lô" className="rounded p-1 hover:bg-slate-100"><X size={20} /></button></div>
      {error ? <div role="alert" className="py-6 text-red-700">{error}<button onClick={() => { setError(""); setRetry((value) => value + 1); }} className="ml-2 underline">Thử lại</button></div> : !trace ? <p role="status" className="py-6 text-slate-500">Đang tải nguồn gốc và lịch sử...</p> : <>
        <dl className="my-5 grid gap-4 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[["Sản phẩm", trace.product?.name], ["Kho / chi nhánh", [trace.location?.stockName, trace.location?.branchName].filter(Boolean).join(" / ")], ["Nhà cung cấp", trace.origin?.supplier?.name], ["Phiếu nhập gốc", trace.origin?.receiptCode], ["Ngày nhập", lotDate(trace.origin?.receivedAt)], ["Ngày sản xuất", lotDate(trace.lot?.manufacturedAt)], ["Hạn sử dụng", lotDate(trace.lot?.expiresAt)], ["Tồn hiện tại", `${lotNumber(trace.lot?.quantity)} ${lot.baseUnit?.code || lot.product?.unit || trace.product?.unit || ""}`]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-slate-800">{value || "Chưa có thông tin"}</dd></div>)}
        </dl>
        <LotSerialList key={lot.id} lotId={lot.id} />
        <h4 className="mb-3 font-semibold text-slate-800">Lịch sử xuất nhập</h4>
        {trace.movements?.length ? <div className="max-h-[400px] overflow-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="sticky top-0 bg-slate-100"><tr>{["Thời gian", "Giao dịch", "Số lượng", "Kho", "Tham chiếu"].map((label) => <th key={label} className="px-3 py-2">{label}</th>)}</tr></thead><tbody>{trace.movements.map((move) => <tr key={move.id} className="border-b border-slate-100"><td className="px-3 py-3">{move.at ? new Date(move.at).toLocaleString("vi-VN") : "—"}</td><td className="px-3 py-3">{Number(move.quantity) >= 0 ? "Nhập" : "Xuất"}</td><td className={`px-3 py-3 font-semibold tabular-nums ${Number(move.quantity) >= 0 ? "text-emerald-700" : "text-red-600"}`}>{Number(move.quantity) > 0 ? "+" : ""}{lotNumber(move.quantity)}</td><td className="px-3 py-3">{move.stockName || "—"}</td><td className="max-w-[240px] break-all px-3 py-3 text-xs text-slate-500">{move.referenceId || "—"}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">Chưa có giao dịch cho lô này.</p>}
        {trace.consumption?.consumedBy?.some((use) => use.referenceType === "PRODUCTION_BATCH") && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h4 className="mb-3 font-semibold text-slate-800">Đầu ra chế biến thực tế</h4>
            {trace.consumption.consumedBy.filter((use) => use.referenceType === "PRODUCTION_BATCH").map((use) => <div key={use.movementId} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 py-3 text-xs text-slate-600"><span>{use.finishedGood?.name || "Mẻ chế biến"}</span><span>Đã dùng {lotNumber(use.consumedQuantity)} {trace.product?.unit}</span><span>{use.consumedAt ? new Date(use.consumedAt).toLocaleString("vi-VN") : "—"}</span></div>)}
          </div>
        )}
      </>}
    </section>
  );
}
