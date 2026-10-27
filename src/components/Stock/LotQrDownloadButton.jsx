import React from "react";
import { buildLotTraceUrl } from "../QR/lotTraceUrl";
import QrDownloadButton from "../QR/QrDownloadButton";

export default function LotQrDownloadButton({ lotId, lotCode, serial, disabled = false, label = "Tải QR xuống" }) {
  return <QrDownloadButton getUrl={() => buildLotTraceUrl({ lotId, serial })}
    filename={`QR-${[lotCode || lotId, serial].filter(Boolean).join("-")}`}
    title={serial ? `Tải QR của serial ${serial}` : "Tải QR chung của lô hàng"}
    disabled={disabled} label={label} />;
}
