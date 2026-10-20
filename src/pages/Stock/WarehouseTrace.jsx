import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, History } from "lucide-react";
import UnifiedTrace from "./UnifiedTrace";
import StockSerials from "./StockSerials";
import StockHeader from "../../components/Stock/StockHeader";
import { stockLotApi } from "../../api/stockLotApi";
import { LotDetails } from "./StockLots";
import {
  Panel,
  Empty,
  RequestState,
} from "../../components/Warehouse/WarehouseUI";
import {
  inputClass,
  date,
  number,
} from "../../components/Warehouse/warehouseFormat";

export default function WarehouseTrace() {
  const [params, setParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const serialMode = params.get("mode") === "serial" || params.has("detailId");
  const unified =
    params.has("id") ||
    (!params.has("mode") && !params.has("lotId") && !params.has("detailId"));
  return (
    <main className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
      <StockHeader
        activeTab="trace"
        onRefresh={() => setRefresh((value) => value + 1)}
      />
      {!unified && (
        <button
          type="button"
          onClick={() => setParams({})}
          className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700"
        >
          Nhập ID lô hoặc số serial
        </button>
      )}
      {!unified && (
        <nav
          aria-label="Cách truy xuất nguồn gốc"
          className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1"
        >
          {[
            [false, "Theo lô hàng"],
            [true, "Theo serial"],
          ].map(([serial, label]) => (
            <button
              type="button"
              key={label}
              aria-pressed={serialMode === serial}
              onClick={() => setParams(serial ? { mode: "serial" } : {})}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
                serialMode === serial
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      {unified ? (
        <UnifiedTrace key={params.toString()} refreshVersion={refresh} />
      ) : serialMode ? (
        <StockSerials traceMode key={params.toString()} refreshVersion={refresh} />
      ) : (
        <LotTrace key={params.toString()} refreshVersion={refresh} />
      )}
    </main>
  );
}

function LotTrace({ refreshVersion = 0 }) {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() =>
    params.get("lotId")
      ? { id: params.get("lotId"), lotCode: params.get("lotId") }
      : null,
  );
  const [state, setState] = useState({
    loading: false,
    error: "",
    items: null,
  });
  const find = async (event) => {
    event?.preventDefault();
    if (!search.trim()) return;
    setSelected(null);
    if (/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(search.trim())) {
      setSelected({ id: search.trim(), lotCode: search.trim() });
      setState({ loading: false, error: "", items: null });
      return;
    }
    setState({ loading: true, error: "", items: null });
    try {
      const result = await stockLotApi.getAll({
        search: search.trim(),
        page: 1,
        size: 100,
      });
      setState({ loading: false, error: "", items: result.items });
      if (result.items.length === 1) setSelected(result.items[0]);
    } catch {
      setState({
        loading: false,
        error: "Không thể tìm lô hàng. Vui lòng thử lại.",
        items: null,
      });
    }
  };
  return (
    <>
      <Panel
        title="Truy xuất nguồn gốc"
        description="Tra cứu từ lô thực tế đến nguồn nhập, nhà cung cấp, lịch sử biến động và đầu ra chế biến đã ghi nhận."
      >
        <form onSubmit={find} className="flex gap-2 p-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              aria-label="Số lô hoặc UUID lô"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nhập số lô, tên hàng hoặc UUID lô..."
              className={`${inputClass} pl-9`}
            />
          </div>
          <button
            disabled={!search.trim() || state.loading}
            className="rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white disabled:opacity-50"
          >
            Tra cứu
          </button>
        </form>
        <RequestState
          loading={state.loading}
          error={state.error}
          retry={find}
        />
        {!state.loading &&
          !state.error &&
          state.items &&
          (state.items.length ? (
            <div className="divide-y divide-slate-100">
              {state.items.map((lot) => (
                <button
                  key={lot.id}
                  onClick={() => setSelected(lot)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left text-xs hover:bg-indigo-50"
                >
                  <span className="min-w-0 flex-1">
                    <strong className="text-slate-700">
                      {lot.product?.name}
                    </strong>
                    <span className="mt-1 block break-all text-indigo-600">
                      {lot.lotCode}
                    </span>
                  </span>
                  <span className="text-slate-500">
                    {number(lot.quantity)}{" "}
                    {lot.baseUnit?.code || lot.product?.unit} · HSD{" "}
                    {date(lot.expiresAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Empty text="Không tìm thấy lô phù hợp trong chi nhánh." />
          ))}
        {!selected && !state.items && !state.loading && !state.error && (
          <div className="flex items-center gap-3 border-t border-slate-100 p-5 text-xs leading-6 text-slate-500">
            <History size={24} className="shrink-0 text-indigo-400" />
            Chọn một lô để xem nguồn gốc. Hàng chưa ghi nhận lô sẽ không được tự
            gán thông tin truy xuất.
          </div>
        )}
      </Panel>
      {selected && (
        <LotDetails
          key={selected.id}
          lot={selected}
          refreshVersion={refreshVersion}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
