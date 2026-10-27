import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ScanLine } from "lucide-react";
import LookupForm from "../../components/ProductLookup/LookupForm";
import LookupScanner from "../../components/ProductLookup/LookupScanner";
import LookupModeTabs from "../../components/ProductLookup/LookupModeTabs";
import ProductDetails from "../../components/ProductLookup/ProductDetails";
import ProductProfile from "../../components/ProductLookup/ProductProfile";
import { isLookupReference, readLookupReference } from "../../components/ProductLookup/lookupHelpers";
import { useProductLookup } from "../../components/ProductLookup/useProductLookup";

export default function ProductLookup() {
  const [params, setParams] = useSearchParams();
  const reference = params.get("lotId") || params.get("id") || "";
  const productView = params.get("view") === "product";
  const [inputError, setInputError] = useState("");
  const [mode, setMode] = useState("id");
  const query = useProductLookup(reference);
  const submit = (value, scanned = false) => {
    try {
      const id = readLookupReference(value);
      setInputError("");
      setParams({ lotId: id, ...(scanned ? { view: "product" } : {}) });
      if (id === reference) query.retry();
      return true;
    } catch (failure) { setInputError(failure.message); return false; }
  };
  const error = inputError || (reference && !isLookupReference(reference) ? "ID hoặc mã lô trên đường dẫn không hợp lệ." : query.error);
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
    <div className={`mx-auto space-y-6 ${productView ? "max-w-xl" : "max-w-6xl"}`}>
      {!productView && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start gap-3"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><ScanLine size={26} /></span><div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Truy xuất sản phẩm</h1><p className="mt-1 text-sm leading-6 text-slate-500">Nhập ID lô hoặc quét QR để tra cứu nguồn gốc sản phẩm.</p></div></div>
        <LookupModeTabs mode={mode} onChange={(next) => { setMode(next); setInputError(""); }} />
        <div role="tabpanel" id={`lookup-${mode}-panel`} aria-labelledby={`lookup-${mode}-tab`}>
          {mode === "id" ? <LookupForm key={reference} reference={reference} loading={query.loading} onSubmit={submit} />
            : <LookupScanner autoOpen onResult={(value) => submit(value, true)} />}
        </div>
      </section>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">{error}{query.error && <button type="button" onClick={query.retry} className="ml-2 font-semibold underline">Thử lại</button>}</p>}
      {query.loading && <p role="status" className="p-8 text-center text-sm text-slate-500">Đang tải thông tin sản phẩm...</p>}
      {!error && !query.loading && query.data && (productView
        ? <ProductDetails key={reference} data={query.data} />
        : mode === "id" && <ProductProfile key={reference} data={query.data} />)}
      {!reference && !inputError && mode === "id" && <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm leading-6 text-slate-500">Nhập UUID hoặc mã lô, quét bằng camera hoặc tải ảnh QR để bắt đầu tra cứu.</div>}
    </div>
  </main>;
}
