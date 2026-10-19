import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Info } from "lucide-react";
import { useSerialTrace } from "../../hooks/useSerialTrace";
import { useWarehouseData } from "../../hooks/useWarehouseData";
import {
  Panel,
  Empty,
  RequestState,
} from "../../components/Warehouse/WarehouseUI";
import {
  inputClass,
  cellClass,
  headingClass,
  date,
  number,
} from "../../components/Warehouse/warehouseFormat";
import StockInPagination from "../../components/StockIn/StockInPagination";

const receiptLabels = {
  COMPLETED: "Đã nhập",
  DRAFT: "Phiếu nháp",
  CANCELLED: "Phiếu đã hủy",
};
function ReceiptStatus({ value }) {
  const color =
    value === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : value === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-500";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${color}`}
    >
      {receiptLabels[value] || value || "—"}
    </span>
  );
}
export default function StockSerials({ traceMode = false }) {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    stockId: "",
    serialMode: "",
    receiptStatus: "",
  });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(() =>
    traceMode && params.get("detailId") && params.get("position")
      ? { detailId: params.get("detailId"), position: params.get("position") }
      : null,
  );
  const lotId = params.get("lotId") || "";
  const productId = params.get("productId") || "";
  const state = useWarehouseData(
    "serials",
    { ...filters, lotId, productId, page, size },
    refresh,
  );
  const stocks = useWarehouseData("stocks", {}, refresh);
  const result = state.data;
  const update = (name, value) => {
    setFilters((old) => ({ ...old, [name]: value }));
    setPage(1);
    setSelected(null);
  };
  if (traceMode && selected)
    return (
      <>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Tra cứu serial khác
        </button>
        <SerialDetails
          key={`${selected.detailId}:${selected.position}`}
          selected={selected}
          onClose={() => setSelected(null)}
        />
      </>
    );
  return (
    <>
      <Panel
        title={
          traceMode
            ? "Truy xuất nguồn gốc theo serial"
            : "Danh sách serial nhập kho"
        }
        description="Theo dõi từng serial đã khai báo khi nhập kho, nguồn nhà cung cấp và liên kết lô hàng."
        action={
          <span className="whitespace-nowrap text-xs text-slate-400">
            {result ? `${number(result.total)} serial` : ""}
          </span>
        }
      >
        <div className="space-y-3 border-b border-slate-100 p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_190px_170px_180px]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={15}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                aria-label="Tìm serial"
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                placeholder="Serial, mã/tên hàng, số lô hoặc phiếu nhập..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <select
              aria-label="Kho nhập"
              className={inputClass}
              value={filters.stockId}
              onChange={(e) => update("stockId", e.target.value)}
            >
              <option value="">Tất cả kho nhập</option>
              {stocks.data?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Cách tạo serial"
              className={inputClass}
              value={filters.serialMode}
              onChange={(e) => update("serialMode", e.target.value)}
            >
              <option value="">Tất cả cách tạo</option>
              <option value="MANUAL">Nhập thủ công</option>
              <option value="AUTO">Tự sinh</option>
            </select>
            <select
              aria-label="Trạng thái phiếu nhập"
              className={inputClass}
              value={filters.receiptStatus}
              onChange={(e) => update("receiptStatus", e.target.value)}
            >
              <option value="">Tất cả phiếu nhập</option>
              {Object.entries(receiptLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {(lotId || productId) && (
            <div className="text-xs text-indigo-700">
              Đang lọc serial theo lô/hàng hóa đã chọn.{" "}
              <Link
                to="/stock-lots?tab=serial"
                className="font-semibold underline"
              >
                Xóa bộ lọc này
              </Link>
            </div>
          )}
          <p className="flex items-start gap-2 text-xs text-slate-500">
            <Info size={14} className="shrink-0" />
            Trạng thái hiển thị là trạng thái phiếu nhập. Chưa theo dõi
            xuất/chuyển kho theo từng serial; kho hiển thị là kho nhập ban đầu.
          </p>
          {stocks.error && (
            <p role="alert" className="text-xs text-red-600">
              Không tải được bộ lọc kho.{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setRefresh((value) => value + 1)}
              >
                Tải lại
              </button>
            </p>
          )}
        </div>
        <RequestState
          loading={state.loading}
          error={state.error}
          retry={() => setRefresh((v) => v + 1)}
        />
        {!state.loading &&
          !state.error &&
          (result?.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr>
                    {[
                      "Serial",
                      "Hàng hóa",
                      "Số lô",
                      "Kho nhập",
                      "Phiếu nhập",
                      "Ngày nhập",
                      "Cách tạo",
                      "Trạng thái phiếu",
                      "",
                    ].map((h, i) => (
                      <th key={i} className={headingClass}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row) => (
                    <tr
                      key={`${row.detailId}:${row.position}`}
                      className="hover:bg-indigo-50/40"
                    >
                      <td
                        className={`${cellClass} max-w-[240px] break-all font-mono text-xs`}
                      >
                        <Link
                          title="Truy xuất nguồn gốc serial này"
                          className="text-indigo-700 hover:underline"
                          to={`/warehouse/trace?id=${encodeURIComponent(
                            row.serial,
                          )}`}
                        >
                          {row.serial}
                        </Link>
                      </td>
                      <td className={cellClass}>
                        <div className="font-semibold">{row.productName}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          {row.productCode}
                        </div>
                      </td>
                      <td className={`${cellClass} max-w-[200px] break-all`}>
                        {row.lotCode || "Không có lô"}
                      </td>
                      <td className={cellClass}>
                        {row.stockName || "Chưa có thông tin"}
                      </td>
                      <td className={cellClass}>{row.receiptCode}</td>
                      <td className={`${cellClass} whitespace-nowrap`}>
                        {date(row.receivedAt)}
                      </td>
                      <td className={cellClass}>
                        {row.serialMode === "AUTO"
                          ? "Tự sinh"
                          : row.serialMode === "MANUAL"
                          ? "Thủ công"
                          : "Chưa ghi nhận"}
                      </td>
                      <td className={cellClass}>
                        <ReceiptStatus value={row.receiptStatus} />
                      </td>
                      <td className={cellClass}>
                        <button
                          className="whitespace-nowrap font-semibold text-indigo-600 hover:underline"
                          onClick={() => setSelected(row)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty text="Chưa có serial phù hợp. Serial được tạo khi nhập kho và chọn nhập thủ công hoặc tự sinh." />
          ))}
        {!state.loading && !state.error && (
          <StockInPagination
            total={result?.total || 0}
            currentPage={page}
            pageSize={size}
            onPageChange={(value) => {
              setPage(value);
              setSelected(null);
            }}
            onPageSizeChange={(value) => {
              setSize(value);
              setPage(1);
              setSelected(null);
            }}
          />
        )}
      </Panel>
      {selected && (
        <SerialDetails
          key={`${selected.detailId}:${selected.position}`}
          selected={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
function SerialDetails({ selected, onClose }) {
  const [refresh, setRefresh] = useState(0);
  const state = useSerialTrace(selected, refresh);
  const row = state.data?.serial;
  return (
    <div className="mt-4">
      <Panel
        title="Truy xuất nguồn gốc serial"
        action={
          <button
            aria-label="Đóng chi tiết serial"
            className="rounded p-1 hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        }
      >
        <RequestState
          loading={state.loading}
          error={state.error}
          retry={() => setRefresh((v) => v + 1)}
        />
        {row && (
          <div className="space-y-4 p-4">
            <p className="break-all font-mono text-sm font-semibold text-indigo-700">
              {row.serial}
            </p>
            <dl
              aria-label="Ngày nhập kho và ngày hết hạn"
              className="grid gap-3 sm:grid-cols-2"
            >
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <dt className="text-sm text-slate-500">Ngày nhập kho</dt>
                <dd className="mt-2 text-xl font-bold text-slate-900">
                  {row.purchasedAt || row.receivedAt
                    ? date(row.purchasedAt || row.receivedAt)
                    : "Chưa có thông tin"}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Ngày hết hạn</dt>
                <dd className="mt-2 text-xl font-bold text-slate-900">
                  {row.expiresAt
                    ? date(row.expiresAt)
                    : "Chưa khai báo hạn dùng"}
                </dd>
              </div>
            </dl>
            <dl className="grid gap-4 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Hàng hóa", row.productName],
                ["Mã hàng", row.productCode],
                ["Nhà cung cấp", row.supplierName],
                ["Phiếu nhập", row.receiptCode],
                ["Kho nhập", row.stockName],
                ["Số lô", row.lotCode],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words font-semibold">
                    {value || "Chưa có thông tin"}
                  </dd>
                </div>
              ))}
            </dl>
            <section
              aria-label="Nguồn ghi nhận serial"
              className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-800">
                Nguồn ghi nhận serial này
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {row.supplierName || "Nhà cung cấp chưa ghi nhận"} → Phiếu{" "}
                {row.receiptCode} →{" "}
                {row.lotCode ? `Lô ${row.lotCode}` : row.productName} →{" "}
                <span className="break-all font-mono font-semibold text-indigo-700">
                  {row.serial}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Ghi nhận ngày {date(row.receivedAt)} tại{" "}
                {row.stockName || "kho chưa ghi nhận"}. Thông tin lấy từ đúng
                dòng phiếu nhập đã khai báo serial này.
              </p>
            </section>
            <ReceiptStatus value={row.receiptStatus} />
            <p className="text-xs text-slate-500">
              Serial được ghi nhận trên phiếu nhập này. Hệ thống chưa có lịch sử
              xuất/chuyển cho riêng serial.
            </p>
            {state.data?.lotTrace?.movements?.length > 0 && <section aria-label="Lịch sử chung của lô chứa serial" className="rounded-lg border border-slate-200 p-3">
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Lịch sử chung của lô chứa serial</h3>
              <div className="max-h-64 overflow-auto"><table className="w-full min-w-[500px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Thời gian</th><th className="p-2">Giao dịch</th><th className="p-2">Số lượng</th><th className="p-2">Kho</th></tr></thead><tbody>{state.data.lotTrace.movements.map((move) => <tr key={move.id} className="border-t border-slate-100"><td className="p-2">{date(move.at)}</td><td className="p-2">{Number(move.quantity) >= 0 ? "Nhập" : "Xuất"}</td><td className="p-2">{number(move.quantity)}</td><td className="p-2">{move.stockName || "—"}</td></tr>)}</tbody></table></div>
            </section>}
            {row.lotId && (
              <Link
                className="inline-flex rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                to={`/warehouse/trace?lotId=${encodeURIComponent(row.lotId)}`}
              >
                Xem nguồn gốc và lịch sử của lô
              </Link>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
