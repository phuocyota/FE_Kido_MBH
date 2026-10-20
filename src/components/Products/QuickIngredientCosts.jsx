import React, { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import { kitchenRecipeApi } from '../../api/kitchenRecipeApi';
import { costPerBaseUnit } from './recipeCostWarnings';

const inputClass = 'w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:opacity-50';
const money = (value) => Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 2 });

export default function QuickIngredientCosts({ products, onSaved, onClose }) {
  const [catalog, setCatalog] = useState({ loading: true });
  const [revision, setRevision] = useState(0);
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    kitchenRecipeApi.units(controller.signal).then((units) => {
      if (!Array.isArray(units)) throw new Error('Không đọc được danh mục đơn vị.');
      if (!controller.signal.aborted) setCatalog({ units: units.filter((unit) => unit.isActive !== false) });
    }).catch((err) => {
      if (!controller.signal.aborted) setCatalog({ error: err.response?.data?.message || err.message });
    });
    return () => controller.abort();
  }, [revision]);
  const rows = products.map((product) => {
    const base = catalog.units?.find((unit) => unit.id === product.baseUnitId);
    const choices = base ? catalog.units.filter((unit) => unit.dimension === base.dimension) : [];
    const preferred = choices.find((unit) => base.code === 'g' && unit.code === 'kg') || base;
    const value = values[product.id] || { price: '', unitId: preferred?.id || '' };
    const unit = choices.find((choice) => choice.id === value.unitId);
    let converted, problem;
    try { converted = costPerBaseUnit(value.price, unit, base); } catch (err) { problem = err.message; }
    return { product, base, choices, value, converted, problem };
  });
  async function save() {
    if (busy) return;
    const pending = rows.filter((row) => !saved[row.product.id]);
    const invalid = pending.find((row) => row.problem);
    if (invalid) { setError(`${invalid.product.name}: ${invalid.problem}`); return; }
    setBusy(true);
    setError('');
    const results = await Promise.allSettled(pending.map((row) => productApi.update(row.product.id, { costPrice: row.converted })));
    const completed = { ...saved };
    const failures = [];
    results.forEach((result, index) => {
      const row = pending[index];
      if (result.status === 'fulfilled') completed[row.product.id] = true;
      else failures.push(`${row.product.name}: ${result.reason.response?.data?.message || result.reason.message}`);
    });
    setSaved(completed);
    if (failures.length) {
      setError(`Các dòng thành công đã được lưu. Chưa lưu được: ${failures.join('; ')}`);
    } else {
      try { await onSaved?.(); onClose(); }
      catch { setError('Đã lưu giá vốn nhưng chưa tải lại được công thức. Vui lòng làm mới.'); }
    }
    setBusy(false);
  }
  return (
    <section aria-label="Nhập giá vốn nhanh" className="mt-3 space-y-3 rounded-lg border border-amber-200 bg-white p-3">
      <h4 className="font-semibold">Nhập giá vốn cho nguyên liệu còn thiếu</h4>
      <p className="text-xs">Chọn đơn vị mua và nhập giá. Hệ thống tự quy đổi về đơn vị tồn chuẩn, làm tròn 2 chữ số thập phân.</p>
      {catalog.loading && <p role="status">Đang tải đơn vị…</p>}
      {catalog.error && <p role="alert">{String(catalog.error)} <button type="button" className="underline" onClick={() => { setCatalog({ loading: true }); setRevision((n) => n + 1); }}>Thử lại</button></p>}
      {catalog.units && rows.map(({ product, base, choices, value, converted }) => (
        <fieldset key={product.id} disabled={busy || saved[product.id]} className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
          <legend className="px-1 font-semibold">{product.name}{saved[product.id] ? ' · Đã lưu' : ''}</legend>
          <label className="grid gap-1 text-xs">Giá vốn (đ)
            <input type="number" min="0" step="0.01" className={inputClass} value={value.price} onChange={(e) => setValues((old) => ({ ...old, [product.id]: { ...value, price: e.target.value } }))} />
          </label>
          <label className="grid gap-1 text-xs">Giá cho 1 đơn vị
            <select className={inputClass} value={value.unitId} onChange={(e) => setValues((old) => ({ ...old, [product.id]: { ...value, unitId: e.target.value } }))}>
              {!choices.length && <option value="">Chưa có đơn vị tồn chuẩn</option>}
              {choices.map((unit) => <option key={unit.id} value={unit.id}>{unit.code} · {unit.name}</option>)}
            </select>
          </label>
          <p className="text-xs sm:col-span-2">{converted !== undefined ? `Sẽ lưu: ${money(converted)} đ/${base.code}` : base ? `Đơn vị tồn chuẩn: ${base.code}` : 'Cần thiết lập đơn vị tồn chuẩn cho nguyên liệu trong Danh mục hàng hóa.'}</p>
        </fieldset>
      ))}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" disabled={busy} className="rounded-lg border px-3 py-2 text-sm" onClick={onClose}>Đóng</button>
        <button type="button" disabled={busy || !catalog.units} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={save}>{busy ? 'Đang lưu…' : 'Lưu giá vốn'}</button>
      </div>
    </section>
  );
}
