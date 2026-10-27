import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import { buildTraceQrExport } from "./traceQrExport";

export default function TraceQrPrintModal({ lotId, productName, lotCode, serial, onClose }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const frame = useRef(null);
  const [quantity, setQuantity] = useState("1");
  const [loaded, setLoaded] = useState("");
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const preview = useMemo(() => {
    try { return buildTraceQrExport({ lotId, productName, lotCode, serial, quantity: Number(quantity) }); }
    catch (failure) { return { error: failure.message }; }
  }, [lotId, productName, lotCode, serial, quantity]);
  const ready = !!preview.html && loaded === preview.html && !printing;

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    input.current?.focus();
    input.current?.select();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  const print = async () => {
    if (!ready) return;
    setPrinting(true); setError("");
    try {
      await frame.current.contentDocument.fonts.ready;
      frame.current.contentWindow.focus();
      frame.current.contentWindow.print();
    } catch { setError("Không thể mở hộp thoại in. Vui lòng thử lại."); }
    finally { setPrinting(false); }
  };

  return createPortal(<dialog ref={dialog} aria-labelledby="trace-print-title" onCancel={(event) => { event.preventDefault(); onClose(); }} className="m-auto max-h-[92vh] w-[95vw] max-w-3xl overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl backdrop:bg-black/50">
    <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
      <div><h2 id="trace-print-title" className="text-lg font-bold text-slate-900">Xem trước khi in QR</h2><p className="mt-1 break-words text-sm text-slate-500">{productName} · {lotCode || lotId}</p></div>
      <button type="button" aria-label="Đóng xem trước" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
    </header>
    <div className="space-y-4 p-5">
      <label className="block text-sm font-semibold text-slate-700">Số lượng tem cần in
        <input ref={input} type="number" min="1" max="1000" step="1" value={quantity} onChange={(event) => { setQuantity(event.target.value); setError(""); }} className="ml-3 w-24 rounded-lg border border-slate-300 px-3 py-2 font-normal" />
      </label>
      {preview.error ? <p role="alert" className="text-sm text-red-700">{preview.error}</p> : <>
        <p className="text-sm font-semibold text-slate-700">Xem trước: {Number(quantity)} tem · {Math.ceil(Number(quantity) / 2)} hàng</p>
        <iframe ref={frame} title="Xem trước tem QR truy xuất" srcDoc={preview.html} onLoad={(event) => {
          setLoaded(event.currentTarget.srcdoc);
          event.currentTarget.contentDocument.addEventListener("keydown", (keyEvent) => {
            if (keyEvent.key === "Escape") { keyEvent.preventDefault(); onClose(); }
          });
        }} sandbox="allow-same-origin allow-modals" tabIndex={-1} className="h-[min(45vh,360px)] w-full rounded-lg border border-slate-200" />
      </>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
    <footer className="flex justify-end gap-3 border-t border-slate-200 p-4">
      <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Đóng</button>
      <button type="button" onClick={print} disabled={!ready} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Printer size={16} />{printing ? "Đang mở in..." : "Xác nhận in"}</button>
    </footer>
  </dialog>, document.body);
}
