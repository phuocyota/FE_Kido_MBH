import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const unavailable = element => !element || element.matches('[aria-busy="true"], [data-report-error]') || element.querySelector('[role="alert"], [aria-busy="true"], [data-report-error]') || /Đang tải/.test(element.textContent);

export function exportReportExcel(element, filename) {
  const table = element?.querySelector("table");
  if (!table) {
    toast.error("Vui lòng chọn dạng báo cáo bảng để xuất Excel.");
    return;
  }
  if (unavailable(element)) {
    toast.error("Vui lòng chờ báo cáo tải thành công trước khi xuất.");
    return;
  }
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Báo cáo", raw: true });
  XLSX.writeFile(workbook, filename);
}

export async function printReport(element, landscape = false) {
  if (unavailable(element)) {
    toast.error("Vui lòng chờ báo cáo tải thành công trước khi in.");
    return;
  }
  const frame = document.createElement("iframe");
  frame.title = "In báo cáo";
  frame.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0";
  document.body.appendChild(frame);
  const target = frame.contentDocument;
  target.open();
  target.write('<!doctype html><html><head><meta charset="utf-8"><title>Báo cáo</title></head><body></body></html>');
  target.close();
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(style => target.head.appendChild(style.cloneNode(true)));
  const style = target.createElement("style");
  style.textContent = `@page { size: A4 ${landscape ? "landscape" : "portrait"}; margin: 10mm; } body { margin:0; font-family:Arial,sans-serif; } body > div { min-width:0!important; width:100%!important; transform:none!important; padding:0!important; } table { width:100%!important; border-collapse:collapse; } th,td { border:1px solid #94a3b8; padding:6px; } tr { break-inside:avoid; } thead { display:table-header-group; } * { print-color-adjust:exact; -webkit-print-color-adjust:exact; }`;
  target.head.appendChild(style);
  const report = element.cloneNode(true);
  report.removeAttribute("style");
  target.body.appendChild(report);
  await Promise.all([...target.querySelectorAll('link[rel="stylesheet"]')].map(link => link.sheet ? Promise.resolve() : new Promise(resolve => { link.onload = resolve; link.onerror = resolve; })));
  await target.fonts.ready;
  frame.contentWindow.addEventListener("afterprint", () => frame.remove(), { once: true });
  frame.contentWindow.focus();
  frame.contentWindow.print();
}
