import React, { useEffect, useMemo, useState } from "react";
import { branchApi, inventoryItemApi, stockTransferApi } from "../api";

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN");
};

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
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState([emptyLine()]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTransfers = async () => {
    const transferData = await stockTransferApi.getAll();
    setTransfers(Array.isArray(transferData) ? transferData : []);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [branchData, productData] = await Promise.all([
          branchApi.getAll(),
          inventoryItemApi.getAll(),
          loadTransfers(),
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
      await loadTransfers();
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-300 px-4 sm:px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Thêm mới phiếu chuyển kho
        </h1>
      </div>

      <div className="p-2 sm:p-4 space-y-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          {loading && (
            <div className="text-sm text-gray-500 mb-3">Đang tải dữ liệu...</div>
          )}
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
          {message && (
            <div className="text-sm text-green-600 mb-3">{message}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4">
              <label className="block mb-1 text-sm font-medium">Chi nhánh xuất</label>
              <select
                value={fromBranchId}
                onChange={(event) => setFromBranchId(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:col-span-4">
              <label className="block mb-1 text-sm font-medium">Chi nhánh nhập</label>
              <select
                value={toBranchId}
                onChange={(event) => setToBranchId(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:col-span-4">
              <label className="block mb-1 text-sm font-medium">Thời gian</label>
              <input
                readOnly
                value={new Date().toLocaleString("vi-VN")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="xl:col-span-12">
              <label className="block mb-1 text-sm font-medium">Diễn giải</label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 flex items-center justify-between">
            <h2 className="font-semibold text-base sm:text-lg">CHI TIẾT</h2>
            <button
              onClick={() => setItems((prev) => [...prev, emptyLine()])}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              + Thêm dòng
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
                  <th className="border-b border-indigo-200 p-3 text-left">Mã hàng hóa</th>
                  <th className="border-b border-indigo-200 p-3 text-left">Tên hàng hóa</th>
                  <th className="border-b border-indigo-200 p-3 text-left">Đơn vị tính</th>
                  <th className="border-b border-indigo-200 p-3 text-right">Số lượng</th>
                  <th className="border-b border-indigo-200 p-3 text-right">Đơn giá vốn</th>
                  <th className="border-b border-indigo-200 p-3 text-right">Thành tiền</th>
                  <th className="border-b border-indigo-200 p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const product = productMap[item.productId];
                  const unitCost = Number(product?.costPerUnit || product?.price || 0);
                  return (
                    <tr key={index} className="border-b border-gray-300 hover:bg-indigo-50/60">
                      <td className="p-3">
                        <select
                          value={item.productId}
                          onChange={(event) =>
                            updateItem(index, { productId: event.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 bg-white"
                        >
                          <option value="">Chọn hàng hóa</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.sku}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-gray-700">{product?.name || ""}</td>
                      <td className="p-3 text-gray-700">{product?.unit || ""}</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(index, { quantity: event.target.value })
                          }
                          className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        />
                      </td>
                      <td className="p-3 text-right">{formatMoney(unitCost)}</td>
                      <td className="p-3 text-right font-semibold">
                        {formatMoney(unitCost * Number(item.quantity || 0))}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-4 border-b border-gray-300">
            <div className="text-sm text-gray-500">
              Chứng từ sẽ được backend tự sinh mã phiếu.
            </div>
            <div className="text-lg sm:text-xl font-bold self-end">
              TỔNG TIỀN: {formatMoney(totalAmount)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end p-4">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu tạm"}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Hoàn thành
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 flex items-center justify-between">
            <h2 className="font-semibold text-base sm:text-lg">PHIẾU CHUYỂN KHO</h2>
            <button
              onClick={loadTransfers}
              disabled={loading || saving}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Tải lại
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-300 p-3 text-left">Mã phiếu</th>
                  <th className="border-b border-gray-300 p-3 text-left">Chi nhánh xuất</th>
                  <th className="border-b border-gray-300 p-3 text-left">Chi nhánh nhập</th>
                  <th className="border-b border-gray-300 p-3 text-left">Trạng thái</th>
                  <th className="border-b border-gray-300 p-3 text-right">Số dòng</th>
                  <th className="border-b border-gray-300 p-3 text-right">Tổng tiền</th>
                  <th className="border-b border-gray-300 p-3 text-left">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {transfers.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={7}>
                      Chưa có phiếu chuyển kho
                    </td>
                  </tr>
                ) : (
                  transfers.map((transfer) => (
                    <tr
                      key={transfer.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">{transfer.code}</td>
                      <td className="p-3">{transfer.fromBranch?.name || transfer.fromBranchId}</td>
                      <td className="p-3">{transfer.toBranch?.name || transfer.toBranchId}</td>
                      <td className="p-3">{transfer.status}</td>
                      <td className="p-3 text-right">{transfer.items?.length || 0}</td>
                      <td className="p-3 text-right font-semibold">
                        {formatMoney(transfer.totalAmount)}
                      </td>
                      <td className="p-3">{formatDateTime(transfer.transferredAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
