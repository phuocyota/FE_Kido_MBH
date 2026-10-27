import React from "react";
import TraceDataFields, { TraceValue } from "./TraceDataFields";
import TraceTimeline from "./TraceTimeline";

function Section({ title, data }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="mb-4 font-semibold text-slate-900">{title}</h3><TraceValue value={data} /></section>;
}

export default function TraceFullDetails({ trace }) {
  const known = new Set(["product", "lot", "location", "quantities", "origin", "recipe", "consumption", "movements", "timeline"]);
  const metadata = Object.fromEntries(Object.entries(trace).filter(([key]) => !known.has(key)));
  return <div className="space-y-4">
    <Section title="Thông tin lô hàng" data={trace.lot} />
    <Section title="Thông tin sản phẩm" data={trace.product} />
    <Section title="Kho và chi nhánh" data={trace.location} />
    <Section title="Số lượng nhập, xuất và tồn" data={trace.quantities} />
    <Section title="Nguồn nhập và nhà cung cấp" data={trace.origin} />
    <TraceTimeline events={Array.isArray(trace.timeline) ? trace.timeline : []} />
    <Section title="Lịch sử xuất nhập" data={trace.movements} />
    <Section title="Sử dụng trong sản xuất" data={trace.consumption} />
    <Section title="Công thức và nguyên liệu" data={trace.recipe} />
    <section className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="mb-4 font-semibold text-slate-900">Thông tin hồ sơ</h3><TraceDataFields data={metadata} /></section>
  </div>;
}
