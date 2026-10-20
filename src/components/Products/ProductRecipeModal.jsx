import DataRefresh from "../common/DataRefresh";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { kitchenRecipeApi } from "../../api/kitchenRecipeApi";
import { getBranchIdFromToken, getTokenPayload } from "../../api/authSession";
import RecipeCostWarning from "./RecipeCostWarning";
import { ingredientsWithoutCost } from "./recipeCostWarnings";
const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm";
const statusNames = {
  ACTIVE: "Đang áp dụng",
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  REVISION_REQUESTED: "Cần chỉnh sửa",
  INACTIVE: "Ngừng áp dụng",
};
export default function ProductRecipeModal({ product, onClose }) {
  const identity = getTokenPayload();
  const role =
    identity?.userType || identity?.role || localStorage.getItem("role");
  const canReview = ["ADMIN", "MANAGER"].includes(role);
  const branchId = product.branchId || getBranchIdFromToken();
  const [requestNotice, setRequestNotice] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [requestForm, setRequestForm] = useState(false);
  const [recipes, setRecipes] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0),
    [reviewing, setReviewing] = useState(null),
    [reason, setReason] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    if (!branchId) {
      setError("Cần chọn chi nhánh để xem công thức.");
      setLoading(false);
      return;
    }
    kitchenRecipeApi
      .list(product.id, branchId, controller.signal)
      .then((rows) => {
        if (!controller.signal.aborted) {
          setRecipes(Array.isArray(rows) ? rows : rows.data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted)
          setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [product.id, branchId, revision]);
  async function review(recipe, action) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await kitchenRecipeApi.review(
        recipe.id,
        action,
        action === "request-changes" ? reason : undefined,
      );
      setReviewing(null);
      setReason("");
      setRevision((value) => value + 1);
    } catch (err) {
      const value = err.response?.data?.message || err.message;
      setError(Array.isArray(value) ? value.join(", ") : value);
    } finally {
      setBusy(false);
    }
  }
  async function requestRecipe(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await kitchenRecipeApi.requestRecipe(
        product.id,
        branchId,
        requestNote,
      );
      setRequestNotice(
        result.alreadyRequested
          ? "Đã có yêu cầu đang chờ bếp trưởng xử lý; không gửi trùng."
          : "Đã gửi yêu cầu tạo công thức đến bếp trưởng của chi nhánh.",
      );
      setRequestForm(false);
    } catch (err) {
      const value = err.response?.data?.message || err.message;
      setError(Array.isArray(value) ? value.join(", ") : value);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl md:p-7"
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="recipe-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Định lượng nguyên liệu · {product.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Xem thành phần, định lượng nguyên liệu và giá vốn của món. Duyệt
              công thức do bếp trưởng gửi hoặc yêu cầu điều chỉnh trước khi áp dụng.
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            aria-label="Đóng định lượng nguyên liệu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {String(error)}{" "}
            <button
              type="button"
              className="underline"
              disabled={busy}
              onClick={() => setRevision((value) => value + 1)}
            >
              Thử lại
            </button>
          </p>
        )}
        <DataRefresh pending={loading} hasData={recipes.length > 0}>{({ initialLoading }) => (<>{initialLoading ? (
          <p role="status">Đang tải công thức…</p>
        ) : (
          <div className="space-y-4">
            {!recipes.length && !error && (
              <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                Món chưa có công thức và định lượng nguyên liệu. Gửi yêu cầu bên
                dưới để bếp trưởng thiết lập và trình duyệt.
              </p>
            )}
            {!initialLoading && !recipes.length && canReview && (
              <div className="space-y-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                {requestNotice ? (
                  <p
                    role="status"
                    className="text-sm font-medium text-emerald-700"
                  >
                    {requestNotice}
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setRequestForm(true)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Yêu cầu bếp trưởng tạo công thức
                    </button>
                    {requestForm && (
                      <form onSubmit={requestRecipe} className="space-y-3">
                        <label className="block text-sm">
                          Nội dung gửi bếp trưởng
                          <textarea
                            className={input}
                            maxLength={1000}
                            rows={3}
                            value={requestNote}
                            onChange={(event) =>
                              setRequestNote(event.target.value)
                            }
                            placeholder={`Vui lòng tạo công thức và định lượng cho món ${product.name}.`}
                          />
                        </label>
                        <p className="text-xs text-slate-500">
                          Gửi đến bếp trưởng đang hoạt động trong chi nhánh của
                          món. Yêu cầu xuất hiện trên Web Bếp khi mở hoặc làm
                          mới màn hình.
                        </p>
                        <button
                          type="submit"
                          disabled={busy}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                        >
                          {busy ? "Đang gửi…" : "Gửi yêu cầu"}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-semibold">
                  Phiên bản {recipe.version} ·{" "}
                  {statusNames[recipe.status] || recipe.status}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cho {Number(recipe.yieldQuantity)}{" "}
                  {recipe.yieldUnit?.code || product.unit}
                </p>
                {recipe.description && (
                  <p className="mt-2 text-sm">{recipe.description}</p>
                )}
                {recipe.approval?.reason && (
                  <p className="mt-3 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                    Lý do yêu cầu sửa: {recipe.approval.reason}
                  </p>
                )}
                {canReview && <RecipeCostWarning recipe={recipe} canEdit onSaved={() => setRevision((value) => value + 1)} />}
                <CostSummary costing={recipe.costing} missingCosts={ingredientsWithoutCost(recipe).length > 0} />
                <ul className="my-3 space-y-1 text-sm">
                  {recipe.items?.map((item) => (
                    <li key={item.id}>
                      {item.ingredientProduct?.name || item.ingredientProductId}
                      :{" "}
                      <strong>
                        {Number(item.quantity)} {item.unit?.code}
                      </strong>
                    </li>
                  ))}
                </ul>
                {canReview && recipe.status === "PENDING_REVIEW" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => review(recipe, "approve")}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                    >
                      Phê duyệt & áp dụng
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setReviewing(recipe.id);
                        setReason("");
                      }}
                      className="rounded-lg border border-orange-300 px-3 py-2 text-sm text-orange-700"
                    >
                      Yêu cầu chỉnh sửa
                    </button>
                  </div>
                )}
                {reviewing === recipe.id && (
                  <form
                    className="mt-3 space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      review(recipe, "request-changes");
                    }}
                  >
                    <label className="block text-sm">
                      Lý do yêu cầu chỉnh sửa
                      <textarea
                        required
                        maxLength={1000}
                        className={input}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy || !reason.trim()}
                      className="rounded-lg bg-orange-600 px-3 py-2 text-sm text-white"
                    >
                      Gửi yêu cầu sửa
                    </button>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}</>)}</DataRefresh>
      </section>
    </div>
  );
}

function CostSummary({ costing, missingCosts }) {
  if (!costing) return null;
  if (!costing.complete && missingCosts) return null;
  if (!costing.complete)
    return (
      <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        Chưa tính được giá vốn công thức. Kiểm tra định lượng và đơn vị tồn chuẩn: {costing.missing?.join(", ")}
      </p>
    );
  const money = (n) => `${Number(n).toLocaleString("vi-VN")}đ`;
  return (
    <section className="my-3 rounded-xl bg-indigo-50 p-3 text-sm">
      <p>
        Giá vốn nguyên liệu: <strong>{money(costing.totalCost)}</strong> · Chi
        phí/đơn vị đầu ra: <strong>{money(costing.costPerServing)}</strong>
      </p>
      <p>
        Hao hụt dự kiến: {costing.expectedWastePercent}% · Giá trị hao hụt đã
        gồm trong vốn: {money(costing.estimatedWasteCost)}
      </p>
      <ul className="my-2">
        {costing.items.map((item) => (
          <li key={item.productId}>
            {item.name}: {item.baseQuantity} {item.baseUnit} ×{" "}
            {money(item.unitCost)} = {money(item.amount)}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">
        Tính từ giá vốn khai báo theo đơn vị tồn chuẩn, chưa gồm nhân công/năng
        lượng. Chốt khi gửi duyệt:{" "}
        {new Date(costing.calculatedAt).toLocaleString("vi-VN")}
      </p>
    </section>
  );
}
