import React from "react";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Empty({ text = "Chưa có dữ liệu phù hợp." }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-slate-400">
      <Inbox size={26} />
      <p>{text}</p>
    </div>
  );
}
export function RequestState({ loading, error, retry, hasData = false }) {
  if (hasData && (loading || error))
    return (
      <div className="relative h-0" role={error ? "alert" : "status"}>
        <div className="absolute right-3 top-2 z-20 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs shadow-sm">
          {error ? <><span className="text-red-700">{error}</span><button type="button" onClick={retry} className="ml-2 underline">Thử lại</button></> : "Đang cập nhật..."}
        </div>
      </div>
    );
  if (error)
    return (
      <div
        role="alert"
        className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-white p-6 text-sm text-red-700"
      >
        <AlertCircle size={24} />
        {error}
        <button
          type="button"
          onClick={retry}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white"
        >
          Thử lại
        </button>
      </div>
    );
  if (loading)
    return (
      <div
        role="status"
        className="flex min-h-52 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500"
      >
        <LoaderCircle size={20} className="animate-spin text-indigo-600" />
        Đang tải dữ liệu kho...
      </div>
    );
  return null;
}
export function StockBadge({ row }) {
  const [label, color] =
    Number(row.expiredQuantity) > 0
      ? ["Có hàng hết hạn", "bg-red-50 text-red-700"]
      : Number(row.quantity) <= 0
        ? ["Hết hàng", "bg-slate-100 text-slate-500"]
        : row.minimumStock !== null &&
            Number(row.quantity) < Number(row.minimumStock)
          ? ["Dưới định mức", "bg-amber-50 text-amber-800"]
          : Number(row.expiringQuantity) > 0
            ? ["Sắp hết hạn", "bg-amber-50 text-amber-800"]
            : ["Hợp lệ", "bg-emerald-50 text-emerald-700"];
  return (
    <span
      className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${color}`}
    >
      {label}
    </span>
  );
}
