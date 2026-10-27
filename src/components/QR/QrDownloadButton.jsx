import React, { useState } from "react";
import { Download } from "lucide-react";

export default function QrDownloadButton({ getUrl, filename, title, disabled = false, label = "Tải QR xuống" }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const download = async () => {
    if (disabled || downloading) return;
    setDownloading(true);
    setError("");
    try {
      const url = getUrl();
      const { default: QRCode } = await import("qrcode");
      const image = await QRCode.toDataURL(url, { width: 1024, margin: 4, errorCorrectionLevel: "M" });
      const link = document.createElement("a");
      link.href = image;
      link.download = `${filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Không thể tải ảnh QR. Vui lòng kiểm tra mã và thử lại.");
    } finally {
      setDownloading(false);
    }
  };
  return <div className="inline-flex flex-col items-start gap-2">
    <button type="button" onClick={download} disabled={disabled || downloading} title={title} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50">
      <Download size={16} />{downloading ? "Đang tải QR..." : label}
    </button>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>;
}
