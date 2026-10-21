import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { stockLotApi } from "../../api/stockLotApi";

const fieldClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";
const errorText = (error) => error.response?.data?.message || error.message || "Không thể lưu serial. Vui lòng thử lại.";

export default function LotSerialRegistrationModal({ lotId, onClose, onSaved }) {
  const [data, setData] = useState(null);
  const [detailId, setDetailId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const dialog = useRef(null);
  const busy = useRef(false);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const focus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const keydown = (event) => {
      if (event.key === "Escape" && !busy.current) close.current();
      if (event.key !== "Tab") return;
      const nodes = [...dialog.current.querySelectorAll('button:not(:disabled),textarea:not(:disabled),select:not(:disabled)')];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!nodes.length) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown); focus?.focus(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    stockLotApi.getSerialRegistration(lotId, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setData(result);
      setDetailId(result.receipts.find((r) => r.canRegister)?.detailId || result.receipts[0]?.detailId || "");
    }).catch((err) => { if (!controller.signal.aborted) setError(errorText(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [lotId, retry]);

  const receipt = data?.receipts.find((r) => r.detailId === detailId);
  const added = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const serials = [...(receipt?.serials || []), ...added];
  const validation = added.some((s) => s.length > 128) ? "Serial tối đa 128 ký tự."
    : new Set(serials).size !== serials.length ? "Serial không được trùng nhau."
      : receipt && added.length > receipt.remaining ? `Chỉ có thể bổ sung tối đa ${receipt.remaining} serial.` : "";

  const save = async () => {
    if (busy.current || !receipt?.canRegister || !added.length || validation) return;
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const result = await stockLotApi.registerLotSerials(lotId, { detailId, serials });
      setData(result);
      setText("");
      onSaved?.();
    } catch (err) { setError(errorText(err)); }
    finally { busy.current = false; setSaving(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/50 p-4">
      <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="lot-serial-registration-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="lot-serial-registration-title" className="text-xl font-bold text-slate-900">Quản lý serial trong lô</h2>
          <button type="button" aria-label="Đóng" disabled={saving} onClick={onClose} className="rounded p-2 hover:bg-slate-100"><X size={20} /></button>
        </div>
        {loading ? <p role="status">Đang tải thông tin lô...</p> : data && <>
          <p className="font-semibold">{data.lot.productName}</p>
          <p className="mb-4 break-all text-sm text-slate-500">Lô: {data.lot.lotCode}</p>
          <p className="mb-4 text-sm text-slate-600">Bổ sung serial cho từng đơn vị đã nhập. Mỗi dòng một serial; có thể nhập hoặc dán danh sách. Việc lưu serial không thay đổi số lượng tồn kho.</p>
          {!data.receipts.length ? <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Chưa xác định được dòng phiếu nhập gốc của lô này để bổ sung serial.</p> : <>
            <label className="mb-4 block text-sm font-semibold">Phiếu nhập
              <select className={`${fieldClass} mt-1`} value={detailId} disabled={saving} onChange={(e) => { setDetailId(e.target.value); setText(""); setError(""); }}>
                {data.receipts.map((r) => <option key={r.detailId} value={r.detailId}>{r.receiptCode} · {r.quantity} {data.lot.unit || "đơn vị"} · đã có {r.serials.length} serial</option>)}
              </select>
            </label>
            {!!receipt?.serials.length && <div className="mb-4"><p className="mb-1 text-sm font-semibold">Serial đã lưu ({receipt.serials.length})</p><pre className="max-h-36 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">{receipt.serials.join("\n")}</pre></div>}
            {receipt?.canRegister ? <label className="block text-sm font-semibold">Bổ sung serial ({added.length}/{receipt.remaining})
              <textarea autoComplete="off" spellCheck={false} rows={8} className={`${fieldClass} mt-1 font-mono`} value={text} disabled={saving} placeholder={"TAP-001\nTAP-002\nTAP-003"} onChange={(e) => setText(e.target.value)} aria-invalid={!!validation} />
            </label> : <p className="text-sm text-slate-600">{receipt?.remaining === 0 ? "Đã khai báo đủ serial cho phiếu nhập này." : "Chỉ hỗ trợ serial cho số lượng nhập nguyên đơn vị, tối đa 10.000 đơn vị mỗi dòng."}</p>}
            <p className="mt-2 text-xs text-slate-500">Serial đã lưu được giữ nguyên để phục vụ truy xuất. Lịch sử xuất/chuyển hiện được ghi nhận theo lô.</p>
          </>}
        </>}
        {(error || validation) && <p role="alert" className="mt-3 text-sm text-red-600">{String(error || validation)}</p>}
        {!loading && !data && <button type="button" onClick={() => setRetry((v) => v + 1)} className="mt-3 text-blue-600 underline">Thử lại</button>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border px-4 py-2">Đóng</button>
          <button type="button" disabled={loading || saving || !receipt?.canRegister || !added.length || !!validation} onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu serial"}</button>
        </div>
      </section>
    </div>, document.body,
  );
}
