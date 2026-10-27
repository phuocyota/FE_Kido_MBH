import React, { useEffect, useRef, useState } from "react";
import { Camera, ImageUp, X } from "lucide-react";
import { decodeQr, decodeQrFile } from "./qrDecode";

export default function QrScanner({ onScan }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const video = useRef(null);
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false, stream, timer, lastValue = "";
    const scan = async () => {
      if (cancelled) return;
      try {
        const element = video.current;
        if (element?.readyState >= 2 && element.videoWidth) {
          const value = await decodeQr(element, element.videoWidth, element.videoHeight);
          if (cancelled) return;
          if (value && value !== lastValue) {
            lastValue = value;
            if (onScanRef.current(value)) { setOpen(false); return; }
          }
        }
        if (!cancelled) timer = setTimeout(scan, 250);
      } catch {
        if (!cancelled) { setError("Không thể đọc camera. Bạn có thể tải ảnh mã QR hoặc nhập ID lô."); setOpen(false); }
      }
    };
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera cần HTTPS hoặc localhost. Khi dùng IP mạng nội bộ, hãy tải ảnh QR hoặc nhập ID lô.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
        if (!cancelled) scan();
      } catch (failure) {
        if (!cancelled) {
          setError(failure.name === "NotAllowedError" ? "Bạn chưa cho phép truy cập camera. Hãy cấp quyền hoặc tải ảnh QR." : failure.name === "NotFoundError" ? "Không tìm thấy camera. Hãy tải ảnh QR hoặc nhập ID lô." : failure.message || "Không thể mở camera.");
          setOpen(false);
        }
      }
    };
    start();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [open]);

  const readFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setOpen(false); setError(""); setReading(true);
    try {
      const value = await decodeQrFile(file);
      if (!value) throw new Error("Không tìm thấy mã QR trong ảnh. Hãy chọn ảnh rõ hơn, có đầy đủ mã QR.");
      onScanRef.current(value);
    } catch (failure) {
      setError(failure.message || "Không thể đọc ảnh QR.");
    } finally { setReading(false); }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setError(""); setOpen((value) => !value); }} aria-expanded={open} className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700">
          <Camera size={17} />{open ? "Đóng camera" : "Quét mã QR"}
        </button>
        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 ${reading ? "pointer-events-none opacity-50" : "hover:bg-slate-50"}`}>
          <ImageUp size={17} />{reading ? "Đang đọc ảnh..." : "Tải ảnh QR"}
          <input type="file" accept="image/*" aria-label="Tải ảnh mã QR" onChange={readFile} disabled={reading} className="sr-only" />
        </label>
      </div>
      {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
      {open && <div className="relative mx-auto max-w-md overflow-hidden rounded-xl bg-slate-900">
        <video ref={video} autoPlay muted playsInline aria-label="Camera quét QR" className="aspect-square w-full object-cover" />
        <div className="pointer-events-none absolute inset-[20%] rounded-xl border-2 border-white/80" />
        <button type="button" aria-label="Đóng camera" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"><X size={18} /></button>
        <p className="absolute bottom-3 inset-x-3 rounded bg-black/60 p-2 text-center text-xs text-white">Đặt mã QR vào giữa khung hình</p>
      </div>}
    </div>
  );
}
