import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { useReadQuery } from '../../hooks/useReadQuery';
import StockInCreate from '../../pages/Stock/StockInCreate';
import { createStockLotCode } from '../Stock/stockLotCode';
import { currentPurchaseDateTime, freshFoodExpiry } from '../Stock/stockDates';

export default function QuickMaterialImportModal({ shortages, onClose, onImported }) {
  const [busy, setBusy] = useState(false);
  const seed = JSON.stringify(shortages.map((line) => ({ productId: line.productId, quantity: Number(line.shortageQuantity), unitId: line.unitId, unit: line.unit })));
  const load = useCallback(async (signal) => {
    const rows = JSON.parse(seed);
    const products = await Promise.all(rows.map((line) => productApi.getById(line.productId, signal)));
    const purchasedAt = currentPurchaseDateTime().slice(0, 10);
    return rows.map((line, index) => {
      const product = products[index];
      if (product.id !== line.productId || !['INGREDIENT', 'FUEL'].includes(product.productType))
        throw new Error('Danh mục nguyên liệu đã thay đổi. Vui lòng làm mới tổng quan kho.');
      if (product.baseUnitId !== line.unitId)
        throw new Error(`Đơn vị tồn chuẩn của ${product.name} đã thay đổi. Vui lòng làm mới tổng quan kho.`);
      return {
        id: `replenish-${product.id}`,
        productId: product.id,
        code: product.code || '',
        name: product.name,
        unit: line.unit,
        quantity: line.quantity,
        price: Number(product.costPrice || 0),
        productType: product.productType,
        baseUnitId: product.baseUnitId,
        lotTrackingEnabled: product.lotTrackingEnabled === true,
        isFreshFood: product.isFreshFood === true,
        expiryManuallyEdited: false,
        serialMode: 'NONE',
        serialText: '',
        lotCode: createStockLotCode(),
        manufacturedAt: purchasedAt,
        expiresAt: product.isFreshFood ? freshFoodExpiry(purchasedAt) : '',
      };
    });
  }, [seed]);
  const query = useReadQuery({ queryKey: [seed], scopeKey: ['quick-material-import', seed], load, getErrorMessage: (error) => error.response?.data?.message || error.message });
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-3 sm:p-5">
      <section role="dialog" aria-modal="true" aria-labelledby="quick-import-title" className="max-h-[94vh] w-full max-w-[1800px] overflow-auto rounded-2xl bg-white text-gray-900 shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 p-4">
          <div><h2 id="quick-import-title" className="text-xl font-bold">Nhập nhanh nguyên liệu còn thiếu</h2><p className="mt-1 text-sm text-gray-500">Đã chọn sẵn nguyên liệu và lượng thiếu. Kiểm tra số lượng, đơn giá; chọn nhà cung cấp và bổ sung thông tin lô, hạn sử dụng trước khi lưu.</p></div>
          <button type="button" disabled={busy} aria-label="Đóng nhập nguyên liệu" onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-40"><X size={20} /></button>
        </header>
        {query.loading ? <p role="status" className="p-8 text-center text-sm text-gray-500">Đang chuẩn bị phiếu nhập nguyên liệu…</p> : query.error ? <p role="alert" className="p-6 text-sm text-red-700">{String(query.error)} <button type="button" className="font-semibold underline" onClick={query.refetch}>Thử lại</button></p> : (
          <StockInCreate embedded initialItems={query.data || []} onCancel={onClose} onBusyChange={setBusy} onSaved={async () => { await onImported?.(); onClose(); }} />
        )}
      </section>
    </div>, document.body,
  );
}
