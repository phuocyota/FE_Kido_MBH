import React from "react";
import { formatLabelDate } from "../Stock/lotLabelPrint";
import TraceDataFields from "./TraceDataFields";
import { traceValueLabels } from "./traceLabels";

export default function TraceTimeline({ events = [] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5">
    <h3 className="mb-4 font-semibold text-slate-900">Dòng thời gian truy xuất</h3>
    {events.length ? <ol className="ml-2 border-l-2 border-indigo-100">{events.map((event, index) => <li key={`${event.type}-${event.at}-${index}`} className="relative pb-6 pl-5 last:pb-0">
      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
      <p className="font-semibold text-slate-800">{traceValueLabels[event.type] || event.type || "Sự kiện"}</p>
      <p className="mt-1 text-xs text-slate-500">{formatLabelDate(event.type === "EXPIRY_DATE" && event.detail?.expiresAt ? event.detail.expiresAt : event.at)}</p>
      <details className="mt-2 rounded-lg bg-slate-50 p-3"><summary className="cursor-pointer text-xs font-semibold text-indigo-700">Chi tiết sự kiện</summary><div className="pt-3"><TraceDataFields data={event} /></div></details>
    </li>)}</ol> : <p className="text-sm text-slate-400">Chưa ghi nhận sự kiện truy xuất.</p>}
  </section>;
}
