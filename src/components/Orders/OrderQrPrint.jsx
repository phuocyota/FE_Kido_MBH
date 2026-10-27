import React, { useMemo, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { buildLotLabelDocument } from "../Stock/lotLabelPrint";
import { buildOrderTraceUrl } from "./orderTraceUrl";

export default function OrderQrPrint({ productName, productImage, batch, unit }) {
  const [open, setOpen] = useState(false);
  const [copies, setCopies] = useState(1);
  const [loadedPreview, setLoadedPreview] = useState("");
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const frame = useRef(null);
  const quantity = Number(copies);
  const valid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 1000;
  const preview = useMemo(() => {
    if (!open || !valid) return {};
    try {
      const labelPayload = buildOrderTraceUrl({ productName, productImage, batch, unit });
      return { html: buildLotLabelDocument({ productName, quantity, labelPayload }), url: labelPayload };
    } catch {
      return { error: "Không thể tạo QR. Thông tin truy xuất quá dài hoặc không hợp lệ." };
    }
  }, [open, valid, productName, productImage, batch, unit, quantity]);

  const print = async () => {
    if (!preview.html || loadedPreview !== preview.html || printing) return;
    setPrinting(true);
    setError("");
    try {
      await frame.current.contentDocument.fonts.ready;
      frame.current.contentWindow.focus();
      frame.current.contentWindow.print();
    } catch {
      setError("Không thể mở hộp thoại in. Vui lòng thử lại.");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="space-y-3">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        <Printer size={16} />{open ? "Ẩn xem trước tem QR" : "In QR"}
      </button>
      {open && (
        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold">{productName} · Serial {unit.serial} · Hai tem mỗi hàng</p>
          {preview.url && <a href={preview.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-blue-700 underline">Xem trang sau khi quét QR</a>}
          <p className="text-xs text-slate-500">Quét QR để xem ảnh và đầy đủ mốc thời gian đã lưu trên tem. Không cần đăng nhập, chạy máy local hoặc kết nối backend. Trang xem được phục vụ trên website công khai.</p>
          <label className="block text-sm">Số lượng tem
            <input type="number" min="1" max="1000" step="1" value={copies} onChange={(event) => setCopies(event.target.value)} className="ml-3 w-24 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          {!valid && <p role="alert" className="text-sm text-red-700">Số lượng tem phải là số nguyên từ 1 đến 1.000.</p>}
          {preview.error && <p role="alert" className="text-sm text-red-700">{preview.error}</p>}
          {preview.html && <iframe ref={frame} title="Xem trước tem QR thành phẩm" srcDoc={preview.html} sandbox="allow-same-origin allow-modals" tabIndex={-1} onLoad={(event) => setLoadedPreview(event.currentTarget.srcdoc)} className="h-[300px] w-full rounded-lg border border-slate-300" />}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="button" onClick={print} disabled={!preview.html || loadedPreview !== preview.html || printing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            <Printer size={16} />{printing ? "Đang mở in..." : "In QR"}
          </button>
        </div>
      )}
    </div>
  );
}
