import React, { useEffect, useRef, useState } from "react";
import { Camera, ImageUp, X } from "lucide-react";

async function decode(source, width, height) {
  const { default: jsQR } = await import("jsqr");
  const scale = Math.min(1, 1600 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: "attemptBoth" })?.data || "";
}

export default function LookupScanner({ onResult, autoOpen = false }) {
  const [open, setOpen] = useState(autoOpen);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const video = useRef(null);
  const callback = useRef(onResult);
  useEffect(() => { callback.current = onResult; }, [onResult]);
  useEffect(() => {
    if (!open) return;
    let cancelled = false, stream, timer, previous = "";
    const scan = async () => {
      if (cancelled) return;
      try {
        const frame = video.current;
        if (frame?.readyState >= 2 && frame.videoWidth) {
          const value = await decode(frame, frame.videoWidth, frame.videoHeight);
          if (cancelled) return;
          if (value && value !== previous) {
            previous = value;
            if (callback.current(value)) { setOpen(false); return; }
          }
        }
        if (!cancelled) timer = setTimeout(scan, 250);
      } catch {
        if (!cancelled) { setError("Không đọc được camera. Bạn có thể tải ảnh QR hoặc nhập ID."); setOpen(false); }
      }
    };
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera cần HTTPS hoặc localhost. Khi dùng IP mạng nội bộ, hãy tải ảnh QR.");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
        if (!cancelled) scan();
      } catch (failure) {
        if (!cancelled) { setError(failure.name === "NotAllowedError" ? "Bạn chưa cấp quyền camera. Hãy cho phép camera hoặc tải ảnh QR." : failure.name === "NotFoundError" ? "Không tìm thấy camera. Hãy tải ảnh QR hoặc nhập ID." : failure.message); setOpen(false); }
      }
    };
    start();
    return () => { cancelled = true; clearTimeout(timer); stream?.getTracks().forEach((track) => track.stop()); };
  }, [open]);

  const readFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setOpen(false); setError(""); setReading(true);
    const url = URL.createObjectURL(file);
    try {
      if (!file.type.startsWith("image/")) throw new Error("Vui lòng chọn tệp hình ảnh.");
      const image = new Image(); image.src = url; await image.decode();
      const value = await decode(image, image.naturalWidth, image.naturalHeight);
      if (!value) throw new Error("Không tìm thấy QR trong ảnh. Hãy chọn ảnh rõ hơn.");
      callback.current(value);
    } catch (failure) { setError(failure.message || "Không thể đọc ảnh QR."); }
    finally { URL.revokeObjectURL(url); setReading(false); }
  };
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => { setError(""); setOpen((value) => !value); }} aria-expanded={open} className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700"><Camera size={17} />{open ? "Đóng camera" : "Quét mã QR"}</button>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"><ImageUp size={17} />{reading ? "Đang đọc ảnh..." : "Tải ảnh QR"}<input type="file" accept="image/*" aria-label="Tải ảnh QR" onChange={readFile} disabled={reading} className="sr-only" /></label>
    </div>
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
    {open && <div className="relative mx-auto max-w-md overflow-hidden rounded-xl bg-slate-900">
      <video ref={video} autoPlay muted playsInline aria-label="Camera tra cứu sản phẩm" className="aspect-square w-full object-cover" />
      <div className="pointer-events-none absolute inset-[20%] rounded-xl border-2 border-white/80" />
      <button type="button" aria-label="Tắt camera" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"><X size={18} /></button>
      <p className="absolute inset-x-3 bottom-3 rounded bg-black/60 p-2 text-center text-xs text-white">Đưa mã QR vào giữa khung hình</p>
    </div>}
  </div>;
}
