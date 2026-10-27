import { buildLotLabelDocument, labelQr } from "../Stock/lotLabelPrint.js";
import { buildLotTraceUrl } from "./lotTraceUrl.js";

export function buildTraceQrExport({ lotId, serial, productName, lotCode, origin, quantity = 1 }) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
    throw new Error("Số lượng tem phải là số nguyên từ 1 đến 1.000.");
  }
  const url = buildLotTraceUrl({ lotId, serial, origin });
  const svg = labelQr(url);
  const html = buildLotLabelDocument({ productName, lotCode, quantity, labelPayload: url });
  return { url, svg, html };
}
