import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, RefreshCw } from "lucide-react";
import { productionTraceApi } from "../../api/productionTraceApi";
import { useReadQuery } from "../../hooks/useReadQuery";

const number = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 4 });
const dateTime = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    : "Chưa ghi nhận";
const date = (value) =>
  value ? value.slice(0, 10).split("-").reverse().join("/") : "Không ghi nhận";
const stages = {
  WAITING: "Chờ chế biến",
  PREPARING: "Đang chế biến",
  READY: "Sẵn sàng",
  COMPLETED: "Đã hoàn thành",
};

function ReadState({ query }) {
  if (query.error)
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {query.error}{" "}
        <button
          type="button"
          onClick={query.refetch}
          className="ml-2 font-semibold underline"
        >
          Thử lại
        </button>
      </p>
    );
  return query.loading ? (
    <p role="status" className="p-4 text-sm text-slate-500">
      Đang tải hồ sơ truy xuất...
    </p>
  ) : null;
}

function Pages({ page, total, size, onChange }) {
  if (total <= size && page === 1) return null;
  return (
    <div className="flex items-center justify-end gap-3 py-3 text-sm">
      <button
        type="button"
        className="rounded-lg border px-3 py-2 disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </button>
      <span>
        Trang {page} / {Math.max(1, Math.ceil(total / size))}
      </span>
      <button
        type="button"
        className="rounded-lg border px-3 py-2 disabled:opacity-40"
        disabled={page * size >= total}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}

export default function OrderProductTraceModal({
  orderId,
  productId,
  productName,
  onClose,
}) {
  const [page, setPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const container = useRef(null);
  const load = useCallback(
    (signal) =>
      productionTraceApi.getOrderProduct(orderId, productId, page, signal),
    [orderId, productId, page],
  );
  const query = useReadQuery({
    queryKey: [orderId, productId, page, refreshVersion],
    scopeKey: ["order-product-trace", orderId, productId, page],
    load,
  });
  const batches = query.data?.batches?.data || [];
  const batch =
    batches.find((row) => row.batchId === selectedBatch) || batches[0];
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    container.current?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
      if (event.key === "Tab") {
        const nodes = [
          ...container.current.querySelectorAll(
            'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]',
          ),
        ];
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === container.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === container.current)
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown, true);
      previousFocus?.focus?.();
    };
  }, [onClose]);
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={container}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-product-trace-title"
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <header className="flex items-start justify-between gap-3 border-b bg-slate-50 px-5 py-4">
          <div>
            <h2
              id="order-product-trace-title"
              className="flex items-center gap-2 text-lg font-bold text-slate-900"
            >
              <Search size={20} /> Truy xuất nguồn gốc
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {productName}
              {query.data
                ? ` · Đơn ${query.data.orderNumber || query.data.orderId} · ${number(query.data.orderedQuantity)} sản phẩm đặt`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRefreshVersion((value) => value + 1)}
              aria-label="Làm mới hồ sơ truy xuất"
              className="rounded-lg p-2 text-blue-700 hover:bg-slate-200"
            >
              <RefreshCw size={19} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng truy xuất nguồn gốc"
              className="rounded-lg p-2 hover:bg-slate-200"
            >
              <X size={21} />
            </button>
          </div>
        </header>
        <div className="space-y-4 overflow-y-auto p-5">
          <ReadState query={query} />
          {!query.loading && !query.error && query.data && !batches.length && (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Sản phẩm chưa có mẻ chế biến được liên kết với đơn này. Chưa có hồ
              sơ để truy xuất thành phẩm theo lô.
            </p>
          )}
          {batches.length > 0 && (
            <>
              <p className="text-sm text-slate-500">
                Chọn đợt chế biến để xem thành phẩm và nguồn nguyên liệu thực
                tế. Các dòng cùng sản phẩm trong đơn được truy xuất chung.
              </p>
              <div className="flex flex-wrap gap-2">
                {batches.map((row, index) => (
                  <button
                    type="button"
                    key={row.batchId}
                    aria-pressed={row.batchId === batch?.batchId}
                    onClick={() => setSelectedBatch(row.batchId)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm ${row.batchId === batch?.batchId ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-700"}`}
                  >
                    <strong>
                      Đợt {(page - 1) * 20 + index + 1} ·{" "}
                      {number(row.unitCount)} thành phẩm có mã
                    </strong>
                    <span className="mt-1 block text-xs">
                      {stages[row.productionStatus] || row.productionStatus} ·{" "}
                      {row.batchId.slice(0, 8)}
                    </span>
                  </button>
                ))}
              </div>
              <Pages
                page={page}
                total={query.data.batches.total}
                size={20}
                onChange={setPage}
              />
              {batch && (
                <BatchTrace
                  key={batch.batchId}
                  batchId={batch.batchId}
                  refreshVersion={refreshVersion}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function BatchTrace({ batchId, refreshVersion }) {
  const [page, setPage] = useState(1);
  const [unitId, setUnitId] = useState("");
  const load = useCallback(
    (signal) => productionTraceApi.getBatch(batchId, signal),
    [batchId],
  );
  const loadLabels = useCallback(
    (signal) => productionTraceApi.getLabels(batchId, page, signal),
    [batchId, page],
  );
  const query = useReadQuery({
    queryKey: [batchId, refreshVersion],
    scopeKey: ["production-batch", batchId],
    load,
  });
  const labels = useReadQuery({
    queryKey: [batchId, page, refreshVersion],
    scopeKey: ["production-labels", batchId, page],
    load: loadLabels,
  });
  const units = labels.data?.data || [];
  const unit = units.find((row) => row.unitId === unitId) || units[0];
  const batch = query.data;
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 p-4">
      <div className="flex justify-between gap-3">
        <h3 className="font-bold text-slate-900">
          Thành phẩm & nguyên liệu của mẻ
        </h3>
      </div>
      <ReadState query={query} />
      <ReadState query={labels} />
      {batch && (
        <>
          <p className="text-sm text-slate-600">
            Hoàn thành: {dateTime(batch.completedAt)} · Sản lượng:{" "}
            {batch.actualQuantity == null
              ? "Chưa ghi nhận"
              : number(batch.actualQuantity)}
          </p>
          <dl className="grid gap-3 rounded-xl bg-blue-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">In stock · Nhập kho nguyên liệu</dt>
              <dd className="mt-1 space-y-2 text-slate-600">
                {batch.inputs?.length ? batch.inputs.map((input) => (
                  <p key={input.lotId}>
                    <span className="font-medium">{input.origin?.product?.name || "Nguyên liệu"}</span>
                    {" · "}{input.origin?.lot?.code || input.lotId}<br />
                    {dateTime(input.origin?.origin?.purchasedAt || input.origin?.origin?.receivedAt)}
                  </p>
                )) : "Chưa ghi nhận lô nguyên liệu"}
              </dd>
            </div>
            <div><dt className="font-semibold text-slate-900">Make · Bắt đầu chế biến</dt><dd className="mt-1 text-slate-600">{dateTime(batch.startedAt)}</dd></div>
            <div><dt className="font-semibold text-slate-900">Ready · Chế biến xong, dùng được</dt><dd className="mt-1 text-slate-600">{dateTime(batch.readyAt)}</dd></div>
            <div><dt className="font-semibold text-slate-900">Expired at · Hạn sử dụng</dt><dd className="mt-1 text-slate-600">{dateTime(unit?.expiresAt || batch.expiresAt)}</dd></div>
          </dl>
          {!batch.traceabilityComplete && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              Mẻ chưa có đầy đủ hồ sơ nguyên liệu theo lô.
            </p>
          )}
          {units.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {units.map((row) => (
                  <button
                    type="button"
                    key={row.unitId}
                    aria-pressed={row.unitId === unit?.unitId}
                    onClick={() => setUnitId(row.unitId)}
                    className={`rounded-lg border px-3 py-2 text-sm ${row.unitId === unit?.unitId ? "border-blue-500 bg-blue-50 font-semibold text-blue-800" : "border-slate-200"}`}
                  >
                    Serial {row.serial}
                  </button>
                ))}
              </div>
              <Pages
                page={page}
                total={labels.data.total}
                size={20}
                onChange={setPage}
              />
              {unit && (
                <div className="space-y-1 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  <p>
                    <strong>Serial {unit.serial}</strong> ·{" "}
                    {unit.status === "EXPIRED"
                      ? "Hết hạn"
                      : unit.status === "READY"
                        ? "Còn hạn"
                        : unit.status}
                  </p>
                  <p className="break-all">
                    Mã thành phẩm: <code>{unit.unitId}</code>
                  </p>
                  <p>Hạn sử dụng: {dateTime(unit.expiresAt)}</p>
                  <p className="break-all">
                    Mã QR: <code>{unit.qrPayload}</code>
                  </p>
                </div>
              )}
            </>
          ) : (
            !labels.loading &&
            !labels.error && (
              <p className="text-sm text-slate-500">
                Mẻ chưa tạo thành phẩm có serial.
              </p>
            )
          )}
          <p className="text-xs text-slate-500">
            Nguồn gốc và lượng nguyên liệu dưới đây ghi nhận cho toàn mẻ. Các
            thành phẩm trong cùng mẻ cùng liên kết đến các lô này.
          </p>
          {batch.inputs?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {[
                      "Nguyên liệu",
                      "Lượng của mẻ",
                      "Lô & hạn dùng",
                      "Nguồn nhập",
                    ].map((title) => (
                      <th key={title} className="p-3">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batch.inputs.map((input) => (
                    <tr
                      key={input.lotId}
                      className="border-t border-slate-100 align-top"
                    >
                      <td className="p-3 font-semibold text-slate-900">
                        {input.origin?.product?.name ||
                          "Chưa có tên nguyên liệu"}
                      </td>
                      <td className="space-y-1 p-3 text-slate-700">
                        <p>
                          {input.usedQuantity == null
                            ? "Tiêu hao"
                            : "Thực dùng"}
                          :{" "}
                          <strong>
                            {number(
                              input.usedQuantity ?? input.consumedQuantity,
                            )}{" "}
                            {input.origin?.product?.unit}
                          </strong>
                        </p>
                        {input.wasteQuantity != null && (
                          <p className="text-xs text-slate-500">
                            Hao hụt: {number(input.wasteQuantity)}{" "}
                            {input.origin?.product?.unit}
                          </p>
                        )}
                        {input.returnedQuantity != null && (
                          <p className="text-xs text-slate-500">
                            Trả kho: {number(input.returnedQuantity)}{" "}
                            {input.origin?.product?.unit}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        <a
                          className="break-all font-medium text-blue-700 underline"
                          href={`/warehouse/trace?lotId=${encodeURIComponent(input.lotId)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {input.origin?.lot?.code || input.lotId}
                        </a>
                        <p className="mt-1 text-xs text-slate-500">
                          NSX: {date(input.origin?.lot?.manufacturedAt)} · HSD:{" "}
                          {date(input.origin?.lot?.expiresAt)}
                        </p>
                      </td>
                      <td className="space-y-1 p-3 text-slate-700">
                        <p>
                          {input.origin?.origin?.supplier?.name ||
                            "Chưa có nhà cung cấp"}
                        </p>
                        <p className="font-medium">
                          Phiếu nhập:{" "}
                          {input.origin?.origin?.receiptCode || "Chưa ghi nhận"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {input.origin?.origin?.purchasedAt ||
                          input.origin?.origin?.receivedAt
                            ? dateTime(
                                input.origin.origin.purchasedAt ||
                                  input.origin.origin.receivedAt,
                              )
                            : input.origin?.origin?.reason}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-amber-700">
              Chưa ghi nhận lô nguyên liệu đầu vào của mẻ.
            </p>
          )}
        </>
      )}
    </section>
  );
}
