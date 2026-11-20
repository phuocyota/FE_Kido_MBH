import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import FormPageHeader from "../../components/Management/FormPageHeader";
import { branchApi, inventoryItemApi, stockTransferApi } from "../../api";

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const emptyLine = () => ({
  productId: "",
  quantity: 1,
});

const uniqueBranchesByName = (branchList) => {
  const seen = new Set();
  return branchList.filter((branch) => {
    const key = String(branch.name || branch.id || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function StockTransfer() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState([emptyLine()]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [branchData, productData] = await Promise.all([
          branchApi.getAll(),
          inventoryItemApi.getAll(),
        ]);
        const loadedBranches = uniqueBranchesByName(
          Array.isArray(branchData) ? branchData : []
        );
        setBranches(loadedBranches);
        setProducts(Array.isArray(productData) ? productData : []);
        setFromBranchId(loadedBranches[0]?.id || "");
        setToBranchId(loadedBranches[1]?.id || loadedBranches[0]?.id || "");
      } catch (err) {
        setError(
          err?.response?.data?.message || "Không thể tải dữ liệu chuyển kho"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
  }, [products]);

  const totalAmount = items.reduce((sum, item) => {
    const product = productMap[item.productId];
    return (
      sum + Number(item.quantity || 0) * Number(product?.costPerUnit || product?.price || 0)
    );
  }, 0);

  const updateItem = (index, patch) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  };

  const removeItem = (index) => {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const buildPayload = () => ({
    type: "TRANSFER",
    fromBranchId,
    toBranchId,
    transferredAt: new Date().toISOString(),
    note,
    items: items
      .filter((item) => item.productId && Number(item.quantity) > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      })),
  });

  const save = async (complete = false) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = buildPayload();
      if (!payload.fromBranchId || !payload.toBranchId) {
        throw new Error("Vui lòng chọn chi nhánh xuất và nhập");
      }
      if (payload.fromBranchId === payload.toBranchId) {
        throw new Error("Chi nhánh xuất và nhập phải khác nhau");
      }
      if (payload.items.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một mặt hàng");
      }

      const transfer = await stockTransferApi.create(payload);
      if (complete) {
        await stockTransferApi.complete(transfer.id);
      }
      setMessage(
        complete
          ? "Đã hoàn thành phiếu chuyển kho"
          : "Đã lưu phiếu chuyển kho"
      );
      setItems([emptyLine()]);
      setNote("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Không thể lưu phiếu chuyển kho"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="erp-page">
      <FormPageHeader
        eyebrow="Kho / Chuyển kho"
        title="Thêm mới phiếu chuyển kho"
        onBack={() => navigate("/stock-transfer")}
      />

      <div className="space-y-4">
        <section className="erp-panel p-4 md:p-5">
          <div role={loading ? "status" : undefined} className="mb-3 min-h-5 text-sm text-slate-500">{loading && "Đang tải dữ liệu..."}</div>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
          {message && (
            <div className="text-sm text-green-600 mb-3">{message}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Chi nhánh xuất</label>
              <select
                value={fromBranchId}
                onChange={(event) => setFromBranchId(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/15"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:col-span-4">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Chi nhánh nhập</label>
              <select
                value={toBranchId}
                onChange={(event) => setToBranchId(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/15"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:col-span-4">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Thời gian</label>
              <input
                readOnly
                value={new Date().toLocaleString("vi-VN")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/15 !bg-slate-50 text-slate-500"
              />
            </div>

            <div className="xl:col-span-12">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Diễn giải</label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/15"
              />
            </div>
          </div>
        </section>

        <section className="erp-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-5">
            <h2 className="text-[15px] font-bold text-slate-900">Chi tiết hàng hóa</h2>
            <button
              onClick={() => setItems((prev) => [...prev, emptyLine()])}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={16} />
              Thêm dòng
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="erp-data-table min-w-[900px]">
              <thead>
                <tr>
                  <th className="border-b p-3 text-left">Mã hàng hóa</th>
                  <th className="border-b p-3 text-left">Tên hàng hóa</th>
                  <th className="border-b p-3 text-left">Đơn vị tính</th>
                  <th className="border-b p-3 text-right">Số lượng</th>
                  <th className="border-b p-3 text-right">Đơn giá vốn</th>
                  <th className="border-b p-3 text-right">Thành tiền</th>
                  <th className="border-b p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const product = productMap[item.productId];
                  const unitCost = Number(product?.costPerUnit || product?.price || 0);
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <select
                          value={item.productId}
                          onChange={(event) =>
                            updateItem(index, { productId: event.target.value })
                          }
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm focus:border-blue-400 focus:outline-none"
                        >
                          <option value="">Chọn hàng hóa</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-slate-700">{product?.name || ""}</td>
                      <td className="p-3 text-slate-700">{product?.unit || ""}</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(index, { quantity: event.target.value })
                          }
                          className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-right text-sm tabular-nums focus:border-blue-400 focus:outline-none"
                        />
                      </td>
                      <td className="p-3 text-right tabular-nums">{formatMoney(unitCost)}</td>
                      <td className="p-3 text-right font-semibold tabular-nums text-slate-900">
                        {formatMoney(unitCost * Number(item.quantity || 0))}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          aria-label="Xóa dòng"
                          title="Xóa dòng"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="erp-panel">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-slate-500">
              Chứng từ sẽ được backend tự sinh mã phiếu.
            </div>
            <div className="flex items-baseline gap-3 self-end">
              <span className="text-[13px] font-medium uppercase tracking-wide text-slate-500">Tổng tiền</span>
              <span className="text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">{formatMoney(totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 p-4 sm:flex-row md:px-5">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Đang lưu..." : "Lưu tạm"}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="h-10 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
            >
              Hoàn thành
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
