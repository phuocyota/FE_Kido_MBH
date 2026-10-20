import React, { useEffect, useState } from 'react';
import { stockLotApi } from '../../api/stockLotApi';
import { lotDate, lotNumber } from './stockLotDisplay';

export default function FefoLotPicker({ productId, quantity, unitId, stockId, onApply, onClose }) {
  const [amount, setAmount] = useState(quantity || 1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ loading: true });
  const [chosen, setChosen] = useState({});
  const requested = quantity ?? amount;
  useEffect(() => {
    const controller = new AbortController();
    if (!(Number(requested) > 0)) return;
    stockLotApi.suggestFefo({ productId, quantity: requested, unitId, stockId }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ data });
          setChosen(Object.fromEntries(data.allocations.map((item) => [item.lotId, item.quantity])));
        }
      }).catch((error) => {
        if (!controller.signal.aborted) setResult({ error: error.response?.data?.message || error.message });
      });
    return () => controller.abort();
  }, [productId, requested, unitId, stockId, revision]);
  const data = result.data;
  const allocations = (data?.candidates || []).filter((lot) => Number(chosen[lot.id] || 0) > 0)
    .map((lot) => ({ lotId: lot.id, quantity: Number(chosen[lot.id]) }));
  const total = allocations.reduce((sum, item) => sum + item.quantity, 0);
  const invalid = (data?.candidates || []).some((lot) => {
    const value = Number(chosen[lot.id] || 0);
    return !Number.isFinite(value) || value < 0 || value > Number(lot.quantity) || Math.abs(value * 10000 - Math.round(value * 10000)) > 0.00001;
  });
  const valid = data && !invalid && total <= data.availableQuantity + 0.00005 && Math.abs(total - data.requestedQuantity) < 0.00005;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="fefo-title" className="max-h-[90vh] w-full max-w-4xl space-y-4 overflow-auto rounded-2xl bg-white p-6 text-gray-900 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="fefo-title" className="text-xl font-bold">Chọn lô theo FEFO</h2><p className="mt-1 text-sm text-gray-600">Ưu tiên hạn dùng sớm, cùng hạn ưu tiên ngày tạo lô trước; lô không có hạn dùng xếp cuối. Chỉ dùng lô còn hạn và còn tồn.</p></div>
          <button type="button" aria-label="Đóng chọn lô" onClick={onClose}>✕</button>
        </div>
        {quantity == null && <label className="grid max-w-xs gap-1 text-sm">Số lượng cần xuất (đơn vị tồn chuẩn)<input type="number" min="0.0001" step="0.0001" value={amount} onChange={(e) => { setAmount(e.target.value); setResult({ loading: true }); }} className="rounded-lg border px-3 py-2" /></label>}
        {!(Number(requested) > 0) ? <p role="alert" className="text-red-600">Nhập số lượng cần xuất lớn hơn 0.</p> : result.loading && <p role="status">Đang tính đề xuất…</p>}
        {result.error && <p role="alert" className="text-red-600">{String(result.error)}</p>}
        {data && <>
          <p className="font-semibold">{data.productName} · {data.stockName} · Cần {lotNumber(data.requestedQuantity)} {data.unit}</p>
          {!data.complete && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-amber-900">Thiếu {lotNumber(data.shortageQuantity)} {data.unit}. Tồn đủ điều kiện xuất: {lotNumber(data.availableQuantity)} {data.unit}.</p>}
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Lô</th><th className="p-2">Hạn sử dụng</th><th className="p-2">Ngày tạo lô</th><th className="p-2">Còn lại ({data.unit})</th><th className="p-2">Lượng xuất ({data.unit})</th></tr></thead>
            <tbody>{data.candidates.map((lot) => <tr key={lot.id} className="border-b"><td className="p-2 font-semibold">{lot.lotCode}</td><td className="p-2">{lot.expiresAt ? lotDate(lot.expiresAt) : 'Không có hạn dùng'}</td><td className="p-2">{lotDate(lot.createdAt)}</td><td className="p-2">{lotNumber(lot.quantity)}</td><td className="p-2"><input aria-label={`Lượng xuất lô ${lot.lotCode}`} type="number" min="0" max={lot.quantity} step="0.0001" value={chosen[lot.id] ?? ''} onChange={(e) => setChosen((old) => ({ ...old, [lot.id]: e.target.value }))} className="w-32 rounded-lg border px-2 py-1" /></td></tr>)}</tbody>
          </table>{!data.candidates.length && <p className="p-4 text-gray-500">Chưa có lô đủ điều kiện xuất trong kho này.</p>}</div>
          <p className={valid ? 'text-sm text-green-700' : 'text-sm text-amber-800'}>Đã chọn {lotNumber(total)}/{lotNumber(data.requestedQuantity)} {data.unit}{invalid ? ' · Có lượng xuất không hợp lệ.' : ''}</p>
          <p className="text-xs text-gray-500">Đề xuất chưa giữ chỗ hoặc trừ tồn. Hệ thống kiểm tra lại tồn và hạn dùng khi xác nhận phiếu xuất.</p>
        </>}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Đóng</button>
          <button type="button" disabled={!(Number(requested) > 0)} className="rounded-lg border px-4 py-2 text-sm" onClick={() => { setResult({ loading: true }); setRevision((value) => value + 1); }}>Tính lại FEFO</button>
          {onApply && <button type="button" disabled={!valid} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" onClick={() => onApply({ allocations, stockId: data.stockId, unitId: data.unitId })}>Áp dụng lựa chọn</button>}
        </div>
      </section>
    </div>
  );
}
