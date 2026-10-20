import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { parseSerials, validateSerialDraft } from '../StockIn/stockInItems';

export default function LotSerialEditor({ item, onApply, onClose }) {
  const [mode, setMode] = useState(item.serialMode || 'NONE');
  const [text, setText] = useState(item.serialText || '');
  const [error, setError] = useState('');
  const count = Number((Number(item.quantity) * Number(item.inputToBaseFactor || 1)).toFixed(4));
  const serials = parseSerials(text);
  function apply() {
    const next = { serialMode: mode, serialText: mode === 'MANUAL' ? text : '' };
    const problem = validateSerialDraft({ ...item, ...next });
    if (problem) { setError(problem); return; }
    onApply(next);
  }
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="lot-serial-editor-title" className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-auto rounded-2xl bg-white p-5 text-gray-900 shadow-xl">
        <header className="flex items-start justify-between gap-4">
          <div><h2 id="lot-serial-editor-title" className="text-lg font-bold">Serial trong lô</h2><p className="mt-1 text-sm text-gray-600">{item.name} · <span className="break-all font-mono">{item.lotCode || 'Chưa có mã lô'}</span></p></div>
          <button type="button" aria-label="Đóng quản lý serial" onClick={onClose}><X size={20} /></button>
        </header>
        <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">Số lượng nhập: {item.quantity} {item.unit}. Số đơn vị tồn chuẩn: {count.toLocaleString('vi-VN')}. Nếu dùng serial, mỗi đơn vị tồn chuẩn tương ứng một serial.</p>
        <label className="grid gap-1 text-sm font-semibold">Quản lý serial
          <select className="rounded-lg border border-gray-300 px-3 py-2 font-normal" value={mode} onChange={(e) => { setMode(e.target.value); setError(''); }}>
            <option value="NONE">Không dùng serial</option>
            <option value="MANUAL">Nhập serial thủ công</option>
            <option value="AUTO">Tự sinh serial cho từng đơn vị</option>
          </select>
        </label>
        {mode === 'MANUAL' && <label className="grid gap-2 text-sm">Danh sách serial
          <textarea className="min-h-[220px] rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" placeholder="Nhập, dán hoặc quét serial; mỗi dòng một serial" value={text} onChange={(e) => { setText(e.target.value); setError(''); }} />
          <span className="text-xs text-gray-500">Đã nhập {serials.length}/{count} serial · Không trùng nhau · Tối đa 128 ký tự/serial.</span>
        </label>}
        {mode === 'AUTO' && <p className="text-sm text-gray-600">Hệ thống tự tạo {count} serial khi lưu thành công phiếu nhập kho.</p>}
        {mode === 'NONE' && <p className="text-sm text-gray-600">Chỉ theo dõi số lượng và hạn sử dụng theo lô.</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <p className="text-xs text-gray-500">Áp dụng chỉ cập nhật dòng hàng đang nhập. Serial được lưu cùng phiếu nhập; sau đó xem tại Lô hàng → Chi tiết → Serial trong lô.</p>
        <footer className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">Hủy</button><button type="button" onClick={apply} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Áp dụng</button></footer>
      </section>
    </div>, document.body,
  );
}
