import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Boxes, CalendarDays, ChefHat, ClipboardList, History, MapPin, PackageOpen, Truck } from "lucide-react";
import { lookupDate, lookupImage } from "./lookupHelpers";
import { lookupNumber, lookupValues } from "./lookupPresentation";
import LookupFieldList from "./LookupFieldList";
import LookupSection from "./LookupSection";
import { productLookupModel } from "./productLookupModel";

export default function ProductProfile({ data }) {
  const { product, lot = {}, origin = {}, location = {}, quantities = {} } = data;
  const model = productLookupModel(data);
  const metrics = model.finished ? [
    ["Sản lượng thực tế", lookupNumber(model.quantity, product.unit), Boxes, "text-indigo-600 bg-indigo-50"],
    ["Nguyên liệu đầu vào", `${model.inputs.length} loại`, PackageOpen, "text-emerald-600 bg-emerald-50"],
    ["Chế biến", lookupValues[data.production?.status] || "Chưa ghi nhận", ChefHat, "text-amber-600 bg-amber-50"],
  ] : [
    ["Tổng nhập", lookupNumber(quantities.inbound, product.unit), ArrowDownLeft, "text-emerald-600 bg-emerald-50"],
    ["Tổng xuất", lookupNumber(quantities.outbound, product.unit), ArrowUpRight, "text-amber-600 bg-amber-50"],
    ["Tồn hiện tại", lookupNumber(quantities.balance ?? lot.quantity, product.unit), Boxes, "text-indigo-600 bg-indigo-50"],
  ];
  const [failedImage, setFailedImage] = useState("");
  const image = lookupImage(data.imageUrl || product.imageUrl);
  const { name: _name, ...productFields } = product;
  const { manufacturedAt: _manufacturedAt, expiresAt: _expiresAt, quantity: _quantity, status: _status, ...lotFields } = lot;
  const timeline = Array.isArray(data.timeline) ? data.timeline : [];
  const extra = Object.fromEntries(Object.entries(data).filter(([key]) => !["product", "lot", "unit", "production", "lifecycle", "inputs", "status", "origin", "location", "quantities", "timeline", "movements", "recipe", "consumption", "imageUrl", "imageSource", "type", "receivedAt", "purchasedAt", "generatedAt"].includes(key)));
  return <article aria-label="Hồ sơ sản phẩm đầy đủ" className="space-y-5">
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-[240px] bg-slate-100">
          {image && failedImage !== image ? <img src={image} alt={product.name || "Sản phẩm"} onError={() => setFailedImage(image)} className="h-full max-h-[340px] min-h-[240px] w-full object-cover" /> : <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-slate-400"><PackageOpen size={60} strokeWidth={1.2} /><p className="text-sm">Chưa có hình ảnh sản phẩm</p></div>}
          {image && failedImage !== image && data.imageSource === "ILLUSTRATION" && <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-600">Ảnh minh họa</span>}
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-500">Hồ sơ nguồn gốc</p>
          <h2 className="mt-3 break-words text-3xl font-bold tracking-tight text-slate-900">{product.name || "Chưa có tên sản phẩm"}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">{lookupValues[product.productType || data.type] || "Sản phẩm"}</span>
            {model.status && <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${model.status === "EXPIRED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{lookupValues[model.status] || model.status}</span>}
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm leading-6 text-slate-500"><MapPin size={16} className="shrink-0" />{[location.stockName, location.branchName].filter(Boolean).join(" · ") || "Chưa ghi nhận vị trí kho"}</p>
          {product.description && <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>}
        </div>
      </div>
      <dl className="grid gap-4 border-t border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-3 sm:p-6">{model.milestones.map(([label, value]) => <div key={label}><dt className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={14} />{label}</dt><dd className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-slate-900">{value}</dd></div>)}</dl>
    </section>
    <div className="grid gap-3 sm:grid-cols-3">{metrics.map((metric) => { const [label, value, Icon, tone] = metric; return <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><span className={`mb-3 inline-flex rounded-xl p-2.5 ${tone}`}><Icon size={20} /></span><p className="text-xs text-slate-500">{label}</p><p className="mt-2 break-words text-xl font-bold text-slate-900">{value}</p></div>; })}</div>
    <LookupSection title="Thông tin sản phẩm" icon={PackageOpen}><LookupFieldList data={productFields} /></LookupSection>
    {!model.finished && <div className="grid items-start gap-5 md:grid-cols-2">
      <LookupSection title="Nguồn nhập và nhà cung cấp" icon={Truck}><LookupFieldList data={origin} /></LookupSection>
      <LookupSection title="Kho và chi nhánh" icon={MapPin}><LookupFieldList data={location} /></LookupSection>
    </div>}
    {model.finished ? <>
      <LookupSection title="Thông tin chế biến" icon={ChefHat}><LookupFieldList data={data.production} /></LookupSection>
      <LookupSection title="Nguyên liệu đã sử dụng" icon={PackageOpen}><LookupFieldList data={model.inputs} /></LookupSection>
    </> : <LookupSection title="Thông tin lô hàng" icon={ClipboardList}><LookupFieldList data={{ ...lotFields, purchasedAt: data.purchasedAt || origin.purchasedAt, movementCount: quantities.movementCount }} /></LookupSection>}
    <LookupSection title="Dòng thời gian" icon={History}>
      {timeline.length ? <ol className="ml-2 border-l-2 border-indigo-100">{timeline.map((event, index) => <li key={index} className="relative pb-6 pl-5 last:pb-0">
        <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
        <p className="text-sm font-semibold text-slate-900">{lookupValues[event.type] || "Sự kiện truy xuất"}</p>
        <p className="mt-1 text-xs text-slate-500">{lookupDate(event.type === "EXPIRY_DATE" && event.detail?.expiresAt ? event.detail.expiresAt : event.at)}</p>
        {event.detail && <details className="mt-3 rounded-xl bg-slate-50 p-3"><summary className="cursor-pointer text-xs font-semibold text-indigo-600">Xem chi tiết</summary><div className="pt-4"><LookupFieldList data={event.detail} /></div></details>}
      </li>)}</ol> : <p className="text-sm text-slate-400">Chưa ghi nhận sự kiện truy xuất.</p>}
    </LookupSection>
    <LookupSection title="Sử dụng trong sản xuất" icon={ChefHat}><LookupFieldList data={data.consumption || null} /></LookupSection>
    <LookupSection title="Công thức và nguyên liệu" icon={ClipboardList}><LookupFieldList data={data.recipe} /></LookupSection>
    {Object.keys(extra).length > 0 && <LookupSection title="Thông tin bổ sung" icon={ClipboardList}><LookupFieldList data={extra} /></LookupSection>}
    <p className="px-1 text-xs leading-6 text-slate-400">Thời gian theo múi giờ Việt Nam (UTC+7). {data.generatedAt ? `Cập nhật hồ sơ: ${lookupDate(data.generatedAt)}.` : "Dữ liệu lấy từ hồ sơ hiện tại."}</p>
  </article>;
}
