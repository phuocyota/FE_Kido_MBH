import React, { useState } from "react";
import { PackageOpen } from "lucide-react";
import { lookupImage } from "./lookupHelpers";
import { productLookupModel } from "./productLookupModel";
import { lookupValues } from "./lookupPresentation";

export default function ProductDetails({ data }) {
  const [failedImage, setFailedImage] = useState("");
  const { product, origin = {}, location = {} } = data;
  const model = productLookupModel(data);
  const image = lookupImage(data.imageUrl || product.imageUrl);
  return <article aria-label="Thông tin sản phẩm tra cứu" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {image && failedImage !== image ? <img src={image} alt={product.name || "Sản phẩm"} onError={() => setFailedImage(image)} className="h-64 w-full object-cover" /> : <div className="flex h-48 flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400"><PackageOpen size={56} strokeWidth={1.3} /><p className="text-sm">Chưa có hình ảnh sản phẩm</p></div>}
    <div className="space-y-5 p-5 sm:p-6">
      {image && failedImage !== image && data.imageSource === "ILLUSTRATION" && <p className="text-xs text-slate-500">Ảnh minh họa sản phẩm</p>}
      <div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Thông tin sản phẩm</p><h2 className="mt-2 break-words text-2xl font-bold text-slate-900">{product.name || "Chưa có tên sản phẩm"}</h2></div>
      {model.status && <p className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${model.status === "EXPIRED" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>{lookupValues[model.status] || model.status}</p>}
      <dl className="space-y-3 text-sm">{model.milestones.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-line font-semibold text-slate-900">{value}</dd></div>)}</dl>
      <dl className="grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">{[
        ["Nhà cung cấp", origin.supplier?.name], ["Kho", location.stockName], ["Chi nhánh", location.branchName],
        [model.finished ? "Sản lượng thực tế" : "Số lượng hiện tại", model.quantity == null ? null : `${Number(model.quantity).toLocaleString("vi-VN")} ${product.unit || ""}`],
      ].filter(([, value]) => !model.finished || value != null).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium text-slate-800">{value || "Chưa ghi nhận"}</dd></div>)}</dl>
      <p className="text-xs leading-5 text-slate-400">Thời gian theo múi giờ Việt Nam (UTC+7). Dữ liệu lấy từ hồ sơ hiện tại.</p>
    </div>
  </article>;
}
