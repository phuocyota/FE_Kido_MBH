import React, { useMemo, useState } from "react";
import { Download, Printer, QrCode } from "lucide-react";
import { buildTraceQrExport } from "./traceQrExport";
import TraceQrPrintModal from "./TraceQrPrintModal";

export default function TraceQrActions({ lotId, productName, lotCode, serial }) {
  const [printOpen, setPrintOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const qr = useMemo(() => {
    try { return buildTraceQrExport({ lotId, productName, lotCode, serial }); }
    catch { return { error: "Không thể tạo mã QR cho hồ sơ này." }; }
  }, [lotId, productName, lotCode, serial]);
  const download = async () => {
    setBusy("download"); setError("");
    try {
      const { default: QRCode } = await import("qrcode");
      const png = await QRCode.toDataURL(qr.url, { width: 1024, margin: 4, errorCorrectionLevel: "M" });
      const link = document.createElement("a");
      link.href = png;
      link.download = `QR-${String(lotCode || lotId).replace(/[^a-zA-Z0-9_.-]/g, "_")}.png`;
      document.body.appendChild(link); link.click(); link.remove();
    } catch { setError("Không thể tải ảnh QR. Vui lòng thử lại."); }
    finally { setBusy(""); }
  };
  return <aside aria-label="Mã QR truy xuất" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
    <h3 className="flex items-center gap-2 font-semibold text-slate-900"><QrCode size={19} className="text-indigo-600" />Mã QR truy xuất</h3>
    {qr.svg && <>
      <div role="img" aria-label={`Mã QR của lô ${lotCode || lotId}`} className="mx-auto my-4 max-w-[240px] [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qr.svg }} />
      <p className="break-words text-center text-sm font-semibold text-slate-800">{productName}</p>
      <p className="mt-1 break-all text-center text-xs text-slate-500">{lotCode || lotId}</p>
      <a href={qr.url} target="_blank" rel="noopener noreferrer" className="mt-3 block break-all text-center text-xs text-indigo-600 underline">Mở trang khi quét QR</a>
      <div className="mt-5 space-y-2">
        <button type="button" onClick={download} disabled={!!busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Download size={16} />{busy === "download" ? "Đang tải..." : "Tải QR (PNG)"}</button>
        <button type="button" onClick={() => setPrintOpen(true)} disabled={!!busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"><Printer size={16} />In QR</button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">In 2 tem mỗi hàng · Khổ 70 × 22 mm</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">Quét mã để mở hồ sơ hiện tại của đúng lô hàng này.</p>
      {printOpen && <TraceQrPrintModal lotId={lotId} productName={productName} lotCode={lotCode} serial={serial} onClose={() => setPrintOpen(false)} />}
    </>}
    {(error || qr.error) && <p role="alert" className="mt-3 text-sm text-red-700">{error || qr.error}</p>}
  </aside>;
}
