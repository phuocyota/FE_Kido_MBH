import React, { useEffect, useState } from "react";
import { kitchenRecipeApi } from "../../api/kitchenRecipeApi";
import RecipeCostWarning from "./RecipeCostWarning";
import { getTokenPayload } from "../../api/authSession";
const statuses = {
  ACTIVE: "Đang áp dụng",
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  REVISION_REQUESTED: "Cần chỉnh sửa",
  INACTIVE: "Ngừng áp dụng",
};
export default function ProductRecipeSection({ productId, branchId }) {
  const identity = getTokenPayload();
  const canEditCost = ['ADMIN', 'MANAGER'].includes(identity?.userType || identity?.role || localStorage.getItem('role'));
  const [result, setResult] = useState(null),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!productId || !branchId) return;
    const controller = new AbortController();
    kitchenRecipeApi
      .list(productId, branchId, controller.signal)
      .then((rows) => {
        if (!controller.signal.aborted)
          setResult({ rows: Array.isArray(rows) ? rows : rows.data || [] });
      })
      .catch((err) => {
        if (!controller.signal.aborted)
          setResult({ error: err.response?.data?.message || err.message });
      });
    return () => controller.abort();
  }, [productId, branchId, revision]);
  const current = result?.rows?.find((row) => row.status === "ACTIVE");
  return (
    <section
      aria-label="Công thức món cần chế biến"
      className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5"
    >
      <h3 className="font-semibold text-indigo-900">Món phải qua chế biến</h3>
      <p className="text-sm text-slate-600">
        Món này cần công thức và định lượng nguyên liệu trước khi chế biến. Bếp
        trưởng thiết lập trên Web Bếp → Thực đơn & Công thức → Công thức & Định
        lượng. Admin hoặc quản lý chi nhánh xem và duyệt công thức do bếp trưởng
        gửi.
      </p>
      {!productId ? (
        <p className="text-sm text-indigo-700">
          Lưu sản phẩm trước để bếp trưởng chọn món và tạo công thức.
        </p>
      ) : !result ? (
        <p role="status">Đang tải trạng thái công thức…</p>
      ) : result.error ? (
        <p role="alert" className="text-sm text-red-600">
          {String(result.error)}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setResult(null);
              setRevision((value) => value + 1);
            }}
          >
            Thử lại
          </button>
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-indigo-800">
            {current
              ? `Đang áp dụng công thức phiên bản ${current.version}.`
              : "Chưa có công thức đang áp dụng. Bếp trưởng cần tạo và gửi duyệt trước khi chế biến."}
          </p>
          {result.rows.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-600">
              {result.rows.map((row) => (
                <li key={row.id}>
                  Phiên bản {row.version} · {statuses[row.status] || row.status}
                  <RecipeCostWarning recipe={row} canEdit={canEditCost} onSaved={() => setRevision((value) => value + 1)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
