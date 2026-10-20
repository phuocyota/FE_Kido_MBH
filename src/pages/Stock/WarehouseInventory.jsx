import DataRefresh from "../../components/common/DataRefresh";
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, SlidersHorizontal, Search, X, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import StockHeader from "../../components/Stock/StockHeader";
import StockInPagination from "../../components/StockIn/StockInPagination";
import { inventoryWorkbook } from "../../components/Warehouse/warehouseExport";
import { warehouseApi } from "../../api/warehouseApi";
import { useWarehouseData } from "../../hooks/useWarehouseData";
import {
  Panel,
  Empty,
  RequestState,
  StockBadge,
} from "../../components/Warehouse/WarehouseUI";
import {
  inputClass,
  cellClass,
  headingClass,
  number,
  money,
  date,
  types,
} from "../../components/Warehouse/warehouseFormat";

const statuses = {
  AVAILABLE: "Có tồn sử dụng được",
  LOW: "Dưới định mức",
  OUT: "Hết hàng",
  EXPIRING: "Có lô sắp hết hạn",
  EXPIRED: "Có lô đã hết hạn",
};
const columns = [
  "Mã hàng",
  "Tên hàng",
  "Phân loại",
  "Kho",
  "Tồn thực tế",
  "Đã giữ chỗ",
  "Khả dụng",
  "Đơn vị",
  "Trạng thái",
  "",
];

export default function WarehouseInventory() {
  const [query] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    search: "",
    stockId: "",
    productType: "",
    status: statuses[query.get("status")] ? query.get("status") : "",
    lotCode: "",
    expiresFrom: "",
    expiresTo: "",
  }));
  const [advanced, setAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState(false);
  const result = useWarehouseData(
    "inventory",
    { ...filters, page, size },
    refresh,
  );
  const stocks = useWarehouseData("stocks");
  const reload = () => setRefresh((value) => value + 1);
  const update = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setSelected(null);
  };
  const exportExcel = async () => {
    setExporting(true);
    try {
      const rows = [];
      for (let next = 1; ; next++) {
        const data = await warehouseApi.get("inventory", {
          ...filters,
          page: next,
          size: 100,
        });
        if (!data.data?.length) break;
        rows.push(...data.data);
        if (rows.length >= Number(data.total)) break;
      }
      if (!rows.length) {
        toast.error("Không có dữ liệu để xuất.");
        return;
      }
      const XLSX = await import("xlsx");
      const book = inventoryWorkbook(XLSX, rows);
      XLSX.writeFile(
        book,
        `Ton-kho-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      toast.success(`Đã xuất ${rows.length} dòng tồn kho.`);
    } catch {
      toast.error("Không thể xuất tồn kho. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };
  return (
    <main className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
      <StockHeader activeTab="inventory" onRefresh={reload} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tồn kho tổng hợp</h2>
          <p className="mt-1 text-xs text-slate-500">
            Mỗi dòng là tồn của một mặt hàng trong một kho. Chọn hàng để xem chi
            tiết.
          </p>
        </div>
        <button
          disabled={exporting || result.loading || !!result.error}
          onClick={exportExcel}
          title="Xuất tất cả dòng phù hợp bộ lọc, gồm các trang chưa mở"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-indigo-300 disabled:opacity-50"
        >
          <Download size={15} />
          {exporting ? "Đang xuất..." : "Xuất Excel"}
        </button>
      </div>
      <Panel
        title="Danh sách tồn kho"
        action={
          <span className="text-xs text-slate-400">
            {result.data ? `${number(result.data.total)} dòng` : ""}
          </span>
        }
      >
        <div className="space-y-3 border-b border-slate-100 p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_180px_170px_190px_auto]">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                value={filters.search}
                onChange={(event) => update("search", event.target.value)}
                aria-label="Tìm mặt hàng tồn kho"
                placeholder="Mã hoặc tên hàng hóa..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <select
              className={inputClass}
              aria-label="Kho"
              value={filters.stockId}
              onChange={(event) => update("stockId", event.target.value)}
            >
              <option value="">Tất cả kho</option>
              {Array.isArray(stocks.data) &&
                stocks.data.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                  </option>
                ))}
            </select>
            <select
              className={inputClass}
              aria-label="Phân loại hàng"
              value={filters.productType}
              onChange={(event) => update("productType", event.target.value)}
            >
              <option value="">Tất cả phân loại</option>
              {Object.entries(types).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className={inputClass}
              aria-label="Trạng thái tồn kho"
              value={filters.status}
              onChange={(event) => update("status", event.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setAdvanced((value) => !value)}
              aria-expanded={advanced}
              title="Lọc thêm theo mã lô và khoảng hạn sử dụng"
              className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold ${advanced ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"}`}
            >
              <SlidersHorizontal size={14} />
              Lọc thêm
            </button>
          </div>
          {advanced && (
            <div className="grid items-end gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-3">
              <label className="text-[11px] text-slate-500">
                Số lô
                <input
                  value={filters.lotCode}
                  onChange={(event) => update("lotCode", event.target.value)}
                  placeholder="Tìm số lô..."
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="text-[11px] text-slate-500">
                Hạn dùng từ
                <input
                  type="date"
                  value={filters.expiresFrom}
                  onChange={(event) =>
                    update("expiresFrom", event.target.value)
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="text-[11px] text-slate-500">
                Hạn dùng đến
                <input
                  type="date"
                  value={filters.expiresTo}
                  onChange={(event) => update("expiresTo", event.target.value)}
                  className={`${inputClass} mt-1`}
                />
              </label>
            </div>
          )}
          {stocks.error && (
            <p className="text-xs text-red-600">
              Không tải được danh sách kho.{" "}
              <button
                onClick={() => window.location.reload()}
                className="underline"
              >
                Tải lại
              </button>
            </p>
          )}
          <p className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-400">
            <Info size={13} className="mt-1 shrink-0" />
            Giữ chỗ chưa thiết lập. Khả dụng hiện hiển thị tồn sử dụng được (tồn
            thực tế trừ tồn hết hạn), chưa trừ giữ chỗ.
          </p>
        </div>
        <RequestState
          hasData={!!result.data} loading={result.loading}
          error={result.error}
          retry={reload}
        />
        {(result.data || (!result.loading && !result.error)) &&
          (result.data?.data?.length ? (
            <DataRefresh showStatus={false} pending={result.loading} hasData={!!result.data}><div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr>
                    {columns.map((label, index) => (
                      <th key={index} className={headingClass}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.data.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition hover:bg-indigo-50/40 ${selected?.productId === row.productId ? "bg-indigo-50/50" : ""}`}
                    >
                      <td
                        className={`${cellClass} font-medium text-indigo-700`}
                      >
                        {row.code || "—"}
                      </td>
                      <td className={cellClass}>
                        <button
                          onClick={() => setSelected(row)}
                          className="text-left font-semibold text-slate-800 hover:text-indigo-700"
                        >
                          {row.name}
                        </button>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {row.categoryName || "Chưa phân nhóm"}
                        </p>
                      </td>
                      <td className={`${cellClass} text-xs`}>
                        {types[row.productType] || "Chưa phân loại"}
                      </td>
                      <td className={`${cellClass} text-xs`}>
                        {row.stockName}
                      </td>
                      <td
                        className={`${cellClass} text-right font-semibold tabular-nums`}
                      >
                        {number(row.quantity)}
                      </td>
                      <td
                        className={`${cellClass} text-center text-slate-300`}
                        title="Nghiệp vụ giữ chỗ chưa thiết lập"
                      >
                        —
                      </td>
                      <td
                        className={`${cellClass} text-right font-semibold tabular-nums text-emerald-700`}
                        title="Tồn thực tế trừ tồn đã hết hạn; chưa trừ giữ chỗ"
                      >
                        {number(row.availableQuantity)}
                      </td>
                      <td className={`${cellClass} text-xs`}>{row.unit}</td>
                      <td className={cellClass}>
                        <StockBadge row={row} />
                      </td>
                      <td className={cellClass}>
                        <button
                          onClick={() => setSelected(row)}
                          className="text-xs font-semibold text-indigo-600"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></DataRefresh>
          ) : (
            <Empty text="Không có tồn kho phù hợp bộ lọc. Các số dư được ghi nhận từ nghiệp vụ nhập, xuất và chuyển kho." />
          ))}
        {(result.data || (!result.loading && !result.error)) && (
          <StockInPagination
            total={Number(result.data?.total || 0)}
            currentPage={page}
            pageSize={size}
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setSize(value);
              setPage(1);
            }}
          />
        )}
      </Panel>
      {selected && (
        <InventoryDetail
          key={selected.productId}
          productId={selected.productId}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function InventoryDetail({ productId, onClose }) {
  const [tab, setTab] = useState("warehouses");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const panel = useRef(null);
  useEffect(() => {
    panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const [refresh, setRefresh] = useState(0);
  const result = useWarehouseData(
    `inventory/${productId}`,
    { page, size, historyKind: tab === "adjustments" ? "ADJUSTMENT" : "" },
    refresh,
  );
  const data = result.data;
  const nav = {
    warehouses: "Theo kho",
    lots: "Theo lô / hạn dùng",
    movements: "Lịch sử nhập xuất",
    adjustments: "Điều chỉnh",
    trace: "Truy xuất nguồn gốc",
  };
  return (
    <section ref={panel} className="mt-4" aria-label="Chi tiết tồn kho">
      <Panel
        title="Chi tiết tồn kho"
        description={
          data
            ? `${data.product.code || ""} · ${data.product.name}`
            : "Thông tin hàng hóa và biến động trong chi nhánh"
        }
        action={
          <button
            aria-label="Đóng chi tiết tồn kho"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        }
      >
        <div className="flex overflow-x-auto border-b border-slate-100 px-3">
          {Object.entries(nav).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setPage(1);
              }}
              className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold ${tab === key ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <RequestState
          hasData={!!result.data} loading={result.loading}
          error={result.error}
          retry={() => setRefresh((value) => value + 1)}
        />
        {data && (result.data || (!result.loading && !result.error)) && (
          <>
            <dl className="grid gap-3 bg-slate-50 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Phân loại",
                  types[data.product.productType] || "Chưa phân loại",
                ],
                ["Nhóm hàng", data.product.categoryName || "—"],
                ["Giá vốn / đơn vị", money(data.product.costPrice)],
                [
                  "Định mức mỗi kho",
                  data.product.minimumStock === null
                    ? "Chưa thiết lập"
                    : `${number(data.product.minimumStock)} ${data.product.unit}`,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
            {tab === "warehouses" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      {[
                        "Kho",
                        "Tồn thực tế",
                        "Tồn hết hạn",
                        "Khả dụng trước giữ chỗ",
                        "Đơn vị",
                        "Giá trị ước tính",
                      ].map((label) => (
                        <th key={label} className={headingClass}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.warehouses.map((row) => (
                      <tr key={row.id}>
                        {[
                          row.stockName,
                          number(row.quantity),
                          number(row.expiredQuantity),
                          number(row.availableQuantity),
                          row.unit,
                          money(row.inventoryValue),
                        ].map((value, index) => (
                          <td key={index} className={cellClass}>
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(tab === "lots" || tab === "trace") &&
              (data.lots.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr>
                        {[
                          "Số lô",
                          "Kho",
                          "Còn lại",
                          "Ngày sản xuất",
                          "Hạn dùng",
                          "",
                        ].map((label, index) => (
                          <th key={index} className={headingClass}>
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.lots.map((lot) => (
                        <tr key={lot.id}>
                          <td
                            className={`${cellClass} max-w-[280px] break-all text-xs`}
                          >
                            {lot.lotCode}
                          </td>
                          <td className={cellClass}>{lot.stockName}</td>
                          <td className={cellClass}>
                            {number(lot.quantity)} {data.product.unit}
                          </td>
                          <td className={cellClass}>
                            {date(lot.manufacturedAt)}
                          </td>
                          <td className={cellClass}>{date(lot.expiresAt)}</td>
                          <td className={cellClass}>
                            <Link
                              to={`/warehouse/trace?lotId=${lot.id}`}
                              className="whitespace-nowrap text-xs font-semibold text-indigo-600"
                            >
                              Truy xuất →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty text="Mặt hàng chưa có lô. Nguồn gốc theo lô chỉ có khi nghiệp vụ nhập và xuất đã ghi nhận lô thực tế." />
              ))}
            {(tab === "movements" || tab === "adjustments") && (
              <>
                {data.movements.data.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr>
                          {[
                            "Thời gian",
                            "Nghiệp vụ",
                            "Số lượng",
                            "Kho",
                            "Lô",
                            "Chứng từ",
                          ].map((label) => (
                            <th key={label} className={headingClass}>
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.movements.data.map((move) => (
                          <tr key={move.id}>
                            <td className={`${cellClass} text-xs`}>
                              {new Date(move.createdAt).toLocaleString("vi-VN")}
                            </td>
                            <td className={`${cellClass} text-xs`}>
                              {
                                {
                                  IMPORT: "Nhập kho",
                                  EXPORT: "Xuất kho",
                                  TRANSFER: "Chuyển kho",
                                  ADJUSTMENT: "Kiểm kê / điều chỉnh",
                                  PRODUCTION: "Chế biến",
                                  OTHER: "Khác / tồn đầu",
                                }[move.referenceType]
                              }
                            </td>
                            <td
                              className={`${cellClass} font-semibold tabular-nums ${Number(move.quantity) < 0 ? "text-red-600" : "text-emerald-700"}`}
                            >
                              {Number(move.quantity) > 0 ? "+" : ""}
                              {number(move.quantity)} {data.product.unit}
                            </td>
                            <td className={cellClass}>{move.stockName}</td>
                            <td
                              className={`${cellClass} max-w-[180px] truncate text-xs`}
                              title={move.lotCode}
                            >
                              {move.lotCode || "—"}
                            </td>
                            <td
                              className={`${cellClass} max-w-[160px] truncate text-xs`}
                              title={move.referenceId}
                            >
                              {move.referenceCode || move.referenceId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty
                    text={
                      tab === "adjustments"
                        ? "Chưa có điều chỉnh từ kiểm kê trong sổ biến động."
                        : "Chưa có biến động kho được ghi nhận."
                    }
                  />
                )}
                <StockInPagination
                  total={Number(data.movements.total)}
                  currentPage={page}
                  pageSize={size}
                  onPageChange={setPage}
                  onPageSizeChange={(value) => {
                    setSize(value);
                    setPage(1);
                  }}
                />
              </>
            )}
          </>
        )}
      </Panel>
    </section>
  );
}
