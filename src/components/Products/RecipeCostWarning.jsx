import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ingredientProductsWithoutCost } from './recipeCostWarnings';
import QuickIngredientCosts from './QuickIngredientCosts';

export default function RecipeCostWarning({ recipe, canEdit = false, onSaved }) {
  const [editing, setEditing] = useState(false);
  const products = ingredientProductsWithoutCost(recipe);
  const missing = products.map((product) => product.name);
  if (!missing.length) return null;
  return (
    <aside role="status" className="my-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle size={18} aria-hidden="true" />
        Cảnh báo: {missing.length} thành phần chưa có giá vốn
      </p>
      <p className="mt-1">Nguyên liệu: {missing.join(', ')}.</p>
      {canEdit && !editing && <button type="button" className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => setEditing(true)}>Nhập giá vốn nhanh</button>}
      {canEdit && editing && <QuickIngredientCosts products={products} onSaved={onSaved} onClose={() => setEditing(false)} />}
      <p className="mt-2 text-sm">
        Vui lòng bổ sung giá vốn cho từng thành phần để phần mềm tính đúng chi phí nguyên liệu, giá vốn món ăn và hỗ trợ duyệt công thức đầy đủ.
      </p>
      <p className="mt-2 text-xs leading-relaxed">
        Vào Hàng hóa → Danh mục, tìm từng nguyên liệu được liệt kê ở trên và cập nhật ô Giá vốn theo đơn vị tồn chuẩn của nguyên liệu.
        Ví dụ: nguyên liệu quản lý bằng g thì nhập giá cho 1 g (giá 1 kg chia 1.000); bánh mì không quản lý bằng cái thì nhập giá cho 1 cái.
        Sau khi lưu, làm mới công thức để kiểm tra lại cảnh báo. Giá vốn do Admin/Quản lý bổ sung, bếp trưởng vẫn có thể gửi duyệt công thức khi chưa có giá vốn.
      </p>
    </aside>
  );
}
