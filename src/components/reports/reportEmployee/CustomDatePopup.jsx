import React, { useState } from "react";
import { getVietnamDateKey } from "../reportEndDay/reportData";

export default function CustomDatePopup({ initialRange, onApply, onClose }) {
  const [from, setFrom] = useState(initialRange?.from || getVietnamDateKey());
  const [to, setTo] = useState(initialRange?.to || getVietnamDateKey());
  const invalid = !from || !to || from > to;
  return <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
    <h2 className="text-lg font-semibold">Chọn khoảng thời gian</h2>
    <label className="block">Từ ngày<input aria-label="Từ ngày báo cáo nhân viên" type="date" value={from} onChange={event => setFrom(event.target.value)} className="mt-1 block h-10 w-full rounded border border-gray-300 px-3" /></label>
    <label className="block">Đến ngày<input aria-label="Đến ngày báo cáo nhân viên" type="date" value={to} onChange={event => setTo(event.target.value)} className="mt-1 block h-10 w-full rounded border border-gray-300 px-3" /></label>
    {invalid && <p role="alert" className="text-sm text-red-600">Vui lòng chọn khoảng ngày hợp lệ</p>}
    <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded border px-4 py-2">Bỏ qua</button><button type="button" disabled={invalid} onClick={() => onApply({ from, to })} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">Áp dụng</button></div>
  </div>;
}
