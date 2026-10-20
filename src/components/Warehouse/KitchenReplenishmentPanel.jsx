import React, { useCallback, useState } from 'react';
import { AlertTriangle, ArrowDownToLine } from 'lucide-react';
import { warehouseApi } from '../../api/warehouseApi';
import { useReadQuery } from '../../hooks/useReadQuery';
import { todayInVietnam } from '../Stock/stockLotDisplay';
import { Panel } from './WarehouseUI';
import { number } from './warehouseFormat';
import QuickMaterialImportModal from './QuickMaterialImportModal';

export default function KitchenReplenishmentPanel({ refresh = 0, onImported }) {
  const [importLines, setImportLines] = useState(null);
  const date = todayInVietnam();
  const load = useCallback((signal) => warehouseApi.getKitchenShortages(date, signal), [date]);
  const query = useReadQuery({
    queryKey: ['kitchen-replenishment', date, refresh],
    scopeKey: ['kitchen-replenishment', date],
    load,
    getErrorMessage: (error) => error.response?.data?.message || error.message || 'Không tải được nguyên liệu thiếu.',
  });
  const shortages = query.data?.shortages || [];
  return (
    <><Panel
      className="mb-5"
      title={<span className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-600" />Nguyên liệu thiếu cần nhập{query.hasData && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{shortages.length}</span>}</span>}
      description={`Nhu cầu chế biến hôm nay (${date.split('-').reverse().join('/')}) so với tồn còn hạn của chi nhánh. Mỗi lượng thiếu được tính theo đơn vị tồn chuẩn; số liệu cập nhật khi mở màn hình hoặc nhấn Làm mới.`}
      action={shortages.length > 0 && !query.loading && !query.error && <button type="button" onClick={() => setImportLines(shortages)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"><ArrowDownToLine size={15} />Nhập nguyên liệu</button>}
    >
      {query.loading ? <p role="status" className="p-4 text-sm text-slate-500">Đang kiểm tra nguyên liệu thiếu…</p> : query.error ? (
        <p role="alert" className="p-4 text-sm text-red-700">{String(query.error)} <button type="button" onClick={query.refetch} className="font-semibold underline">Thử lại</button></p>
      ) : !shortages.length ? <p className="p-4 text-sm text-slate-500">Không có nguyên liệu thiếu theo nhu cầu chế biến hôm nay. Chỉ tính các món đã có công thức được duyệt.</p> : (
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="bg-amber-50 text-xs text-amber-900"><tr><th className="px-4 py-3">Nguyên liệu</th><th className="px-4 py-3 text-right">Nhu cầu</th><th className="px-4 py-3 text-right">Tồn còn hạn</th><th className="px-4 py-3 text-right">Cần nhập bổ sung</th><th className="px-4 py-3">Đơn vị</th></tr></thead>
          <tbody>{shortages.map((line) => <tr key={line.productId} className="border-t border-slate-100"><td className="px-4 py-3 font-semibold text-slate-800">{line.name}</td><td className="px-4 py-3 text-right tabular-nums">{number(line.quantity)}</td><td className="px-4 py-3 text-right tabular-nums">{number(line.availableQuantity)}</td><td className="px-4 py-3 text-right font-bold tabular-nums text-red-600">{number(line.shortageQuantity)}</td><td className="px-4 py-3 text-slate-500">{line.unit}</td></tr>)}</tbody>
        </table></div>
      )}
    </Panel>
    {importLines && <QuickMaterialImportModal shortages={importLines} onClose={() => setImportLines(null)} onImported={() => { query.refetch(); onImported?.(); }} />}
    </>
  );
}
