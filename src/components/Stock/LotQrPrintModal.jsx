import React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import { warehouseApi } from "../../api/warehouseApi";
import { buildLotLabelDocument } from "./lotLabelPrint";

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const isNumberInRange = (value, min, max) => Number.isFinite(Number(value)) && value !== "" && Number(value) >= min && Number(value) <= max;
const MAX_LABELS = 10000;

export default function LotQrPrintModal({ lot, trace, onClose }) {
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [mode, setMode] = useState("all");
  const [selectedSerial, setSelectedSerial] = useState("");
  const [copies, setCopies] = useState(1);
  const [loadedPreview, setLoadedPreview] = useState("");
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState("");
  const frame = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = [...document.querySelectorAll('[data-lot-print-dialog] button:not(:disabled), [data-lot-print-dialog] input, [data-lot-print-dialog] select')];
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previousFocus?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const rows = [];
        const size = 100;
        let page = 1;
        let total;
        do {
          const result = await warehouseApi.get("serials", { lotId: lot.id, receiptStatus: "COMPLETED", page, size }, controller.signal);
          if (controller.signal.aborted) return;
          total = Number(result.total);
          if (!Number.isInteger(total) || total < 0 || !Array.isArray(result.data)) throw new Error("Dữ liệu serial không hợp lệ.");
          rows.push(...result.data);
          if (rows.length < total && result.data.length === 0) throw new Error("Chưa tải đủ serial của lô. Vui lòng thử lại.");
          page += 1;
        } while (rows.length < total);
        if (rows.some((row) => typeof row.serial !== "string" || !row.serial.trim())) throw new Error("Có serial không hợp lệ. Vui lòng kiểm tra dữ liệu lô.");
        const values = [...new Set(rows.map((row) => row.serial))];
        setSerials(values);
        setSelectedSerial(values[0] || "");
      } catch (err) {
        if (!controller.signal.aborted) setError(err.response ? "Không thể tải serial. Vui lòng thử lại." : err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [lot.id, retry]);

  const allSerials = serials.length > 0 && mode === "all";
  const chosenSerials = useMemo(() => serials.length ? (mode === "all" ? serials : [selectedSerial]) : [], [serials, mode, selectedSerial]);
  const total = allSerials ? serials.length : Number(copies);
  const lotCode = trace.lot?.code || lot.lotCode;
  const validationError = !allSerials && (!Number.isInteger(Number(copies)) || !isNumberInRange(copies, 1, MAX_LABELS))
    ? `Số lượng phải là số nguyên từ 1 đến ${MAX_LABELS.toLocaleString("vi-VN")}.`
    : total > MAX_LABELS ? `Mỗi lần in tối đa ${MAX_LABELS.toLocaleString("vi-VN")} tem. Vui lòng chọn một serial.`
    : serials.length && !allSerials && !serials.includes(selectedSerial) ? "Vui lòng chọn serial cần in."
    : !serials.length && !lotCode ? "Thiếu mã lô để tạo QR." : "";
  const preview = useMemo(() => {
    if (loading || error || validationError) return { html: "" };
    try {
      return { html: buildLotLabelDocument({ productName: trace.product?.name || lot.product?.name, lotCode, receivedAt: trace.origin?.receivedAt, expiresAt: trace.lot?.expiresAt || lot.expiresAt, serials: chosenSerials, quantity: total }) };
    } catch {
      return { html: "", error: "Không thể tạo QR. Mã lô hoặc serial quá dài hoặc không hợp lệ." };
    }
  }, [loading, error, validationError, trace, lot, lotCode, chosenSerials, total]);

  const ready = !!preview.html && loadedPreview === preview.html;
  const change = (setter) => (event) => { setPrintError(""); setter(event.target.value); };
  const print = async () => {
    if (!ready || !preview.html || printing) return;
    setPrinting(true);
    setPrintError("");
    try {
      await frame.current.contentDocument.fonts.ready;
      frame.current.contentWindow.focus();
      frame.current.contentWindow.print();
    } catch {
      setPrintError("Không thể mở hộp thoại in. Vui lòng thử lại trên trình duyệt hỗ trợ in.");
    } finally { setPrinting(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3">
      <section data-lot-print-dialog role="dialog" aria-modal="true" aria-labelledby="lot-print-title" className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 p-4">
          <div><h2 id="lot-print-title" className="text-lg font-bold">In tem QR lô hàng</h2><p className="text-sm text-slate-500">{lotCode} · Hai tem mỗi hàng</p></div>
          <button ref={closeButton} type="button" onClick={onClose} aria-label="Đóng in tem QR" className="rounded p-2 hover:bg-slate-100"><X size={20} /></button>
        </header>
        <div className="overflow-y-auto p-4">
          {loading ? <p role="status">Đang tải toàn bộ serial của lô...</p> : error ? <p role="alert" className="text-red-700">{error} <button type="button" onClick={() => setRetry((value) => value + 1)} className="underline">Thử lại</button></p> : <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serials.length > 0 && <label className="text-sm">Serial cần in<select aria-label="Serial cần in" className={inputClass} value={mode} onChange={change(setMode)}><option value="all">In tất cả ({serials.length} serial)</option><option value="single">In một serial</option></select></label>}
              {serials.length > 0 && !allSerials && <label className="text-sm">Chọn serial<select aria-label="Chọn serial" className={inputClass} value={selectedSerial} onChange={change(setSelectedSerial)}>{serials.map((serial) => <option key={serial} value={serial}>{serial}</option>)}</select></label>}
              {!allSerials && <label className="text-sm">Số lượng tem<input type="number" min="1" max={MAX_LABELS} step="1" className={inputClass} value={copies} onChange={change(setCopies)} /></label>}
            </div>
            {validationError || preview.error ? <p role="alert" className="mt-4 text-sm text-red-700">{validationError || preview.error}</p> : <>
              <h3 className="mb-2 mt-4 font-semibold">Xem trước · {total.toLocaleString("vi-VN")} tem / {Math.ceil(total / 2).toLocaleString("vi-VN")} hàng</h3>
              <iframe ref={frame} title="Xem trước tem QR hai cột" srcDoc={preview.html} sandbox="allow-same-origin allow-modals" tabIndex={-1} onLoad={(event) => setLoadedPreview(event.currentTarget.srcdoc)} className="h-[360px] w-full rounded-lg border border-slate-300" />
            </>}
          </>}
          {printError && <p role="alert" className="mt-3 text-sm text-red-700">{printError}</p>}
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 p-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Đóng</button>
          <button type="button" onClick={print} disabled={loading || !!error || !!validationError || !preview.html || !ready || printing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Printer size={16} />{printing ? "Đang mở in..." : "In QR"}</button>
        </footer>
      </section>
    </div>, document.body,
  );
}
