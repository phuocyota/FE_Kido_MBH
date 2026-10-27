import React from "react";
import { Link2, PackageCheck } from "lucide-react";
import ProductTraceCard from "./ProductTraceCard";
import TraceFullDetails from "./TraceFullDetails";
import TraceQrActions from "./TraceQrActions";
import { fullTraceModel } from "./fullTraceModel";

export default function FullTraceResult({ data, lotId, serial }) {
  const model = fullTraceModel(data, lotId);
  if (!model) return <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Không tìm thấy hồ sơ truy xuất cho ID này.</p>;
  if (serial) model.params.set("serial", serial);
  return (
    <section aria-label="Kết quả truy xuất" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><PackageCheck size={18} />Hồ sơ truy xuất sản phẩm</p>
        <a href={`/trace?id=${encodeURIComponent(model.lotId)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline"><Link2 size={14} />Mở trang truy xuất</a>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <ProductTraceCard key={lotId} name={model.params.get("name")} params={model.params} live />
        </div>
        <TraceQrActions lotId={model.lotId} productName={model.params.get("name")} lotCode={model.params.get("lot")} serial={serial} />
      </div>
      <TraceFullDetails trace={model.trace} />
    </section>
  );
}
