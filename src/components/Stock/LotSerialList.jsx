import DataRefresh from "../common/DataRefresh";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useWarehouseData } from "../../hooks/useWarehouseData";
import { RequestState } from "../Warehouse/WarehouseUI";
import { inputClass, number } from "../Warehouse/warehouseFormat";
import StockInPagination from "../StockIn/StockInPagination";

export default function LotSerialList({ lotId, refreshVersion = 0 }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [refresh, setRefresh] = useState(0);
  const state = useWarehouseData(
    "serials",
    { lotId, search, page, size, receiptStatus: "COMPLETED" },
    `${refresh}:${refreshVersion}`,
  );
  const result = state.data;
  return (
    <section
      aria-label="Serial trong lô"
      className="mb-5 overflow-hidden rounded-xl border border-slate-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3">
        <h4 className="text-sm font-semibold text-slate-800">
          Serial trong lô{" "}
          {result && (
            <span className="ml-2 rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
              {number(result.total)} serial{search ? " phù hợp" : ""}
            </span>
          )}
        </h4>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            aria-label="Tìm serial trong lô"
            className={`${inputClass} pl-9`}
            placeholder="Tìm số serial trong lô..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <RequestState
        hasData={!!result} loading={state.loading}
        error={state.error}
        retry={() => setRefresh((value) => value + 1)}
      />
      {(result || (!state.loading && !state.error)) &&
        (result?.data?.length ? (
          <DataRefresh showStatus={false} pending={state.loading} hasData={!!result}>
            <ol
              start={(page - 1) * size + 1}
              className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {result.data.map((row, index) => (
                <li
                  key={`${row.detailId}:${row.position}`}
                  className="flex min-w-0 items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="text-xs tabular-nums text-slate-400">
                    {(page - 1) * size + index + 1}.
                  </span>
                  <Link
                    title="Truy xuất nguồn gốc serial này"
                    to={`/warehouse/trace?id=${encodeURIComponent(row.serial)}`}
                    className="min-w-0 break-all font-mono text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    {row.serial}
                  </Link>
                </li>
              ))}
            </ol>
            <p className="px-3 pb-3 text-xs text-slate-500">
              Đây là các serial đã nhập của lô. Lịch sử xuất/chuyển hiện được
              ghi nhận theo lô, chưa xác định từng serial đã xuất.
            </p>
          </DataRefresh>
        ) : (
          <p className="p-5 text-sm text-slate-500">
            {search
              ? "Không tìm thấy serial phù hợp trong lô."
              : "Lô này chưa khai báo serial. Khi nhập kho, chọn nhập serial thủ công hoặc tự sinh cho từng đơn vị."}
          </p>
        ))}
      {(result || (!state.loading && !state.error)) && result?.total > 0 && (
        <StockInPagination
          total={result.total}
          currentPage={page}
          pageSize={size}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setSize(value);
            setPage(1);
          }}
        />
      )}
    </section>
  );
}
