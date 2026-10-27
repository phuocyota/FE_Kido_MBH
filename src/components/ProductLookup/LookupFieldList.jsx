import React from "react";
import { lookupDate } from "./lookupHelpers";
import { lookupLabels, lookupValues, visibleLookupFields } from "./lookupPresentation";

function FieldValue({ value }) {
  if (value === null || value === undefined || value === "") return <span className="font-normal text-slate-400">Chưa ghi nhận</span>;
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "number") return value.toLocaleString("vi-VN", { maximumFractionDigits: 4 });
  if (Array.isArray(value)) return value.length ? <div className="space-y-3">{value.map((item, index) => <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"><FieldValue value={item} /></div>)}</div> : <span className="font-normal text-slate-400">Chưa ghi nhận</span>;
  if (typeof value === "object") return <LookupFieldList data={value} />;
  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return lookupDate(value);
  return lookupValues[value] || String(value);
}

export default function LookupFieldList({ data }) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return <FieldValue value={data} />;
  const fields = visibleLookupFields(data);
  if (!fields.length) return <p className="text-sm text-slate-400">Chưa có thông tin bổ sung.</p>;
  return <dl className="grid gap-x-6 gap-y-5 text-sm sm:grid-cols-2">{fields.map(([key, value]) => <div key={key} className={`min-w-0 ${value && typeof value === "object" ? "sm:col-span-2" : ""}`}>
    <dt className="mb-1.5 text-xs leading-5 text-slate-500">{lookupLabels[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2")}</dt>
    <dd className="break-words font-medium leading-6 text-slate-800"><FieldValue value={value} /></dd>
  </div>)}</dl>;
}
