import { stockNumber } from "./stockNumbers";
import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import { productApi } from "../../api";
import { CalendarDays, Search, Trash2 } from "lucide-react";
import StockProductPicker from "./StockProductPicker";
import { createStockProductCache } from "./stockProductCache";
import { expiryAfter, freshFoodExpiry, currentPurchaseDateTime } from "./stockDates";
import { createStockLotCode } from "./stockLotCode";
import FefoLotPicker from "./FefoLotPicker";
import LotSerialEditor from "./LotSerialEditor";
import { compatibleStockUnits, convertStockLineUnit } from "./stockUnitConversion";

const baseColumns = [
  { label: "Mã hàng hóa", className: "w-[130px] rounded-tl-lg" },
  { label: "Tên hàng hóa", className: "min-w-[360px]" },
  { label: "Số lượng", className: "w-[110px] text-right" },
  { label: "Đơn vị tính", className: "w-[100px]" },
  { label: "Đơn giá", className: "w-[150px] text-right" },
  { label: "Thành tiền", className: "w-[150px] text-right" },
  { label: "Xóa", className: "w-[56px] text-center rounded-tr-lg" },
];

const headerCellClass =
  "border-r border-white/20 px-3 py-3 text-left text-[11px] font-bold uppercase text-white";
const bodyCellClass = "border-r border-slate-200/80 px-3 py-3 text-slate-700";
const numberCellClass = `${bodyCellClass} text-right font-semibold tabular-nums text-slate-800`;
const totalCellClass =
  "border-r border-blue-200 px-3 py-3 text-right font-bold tabular-nums text-blue-800";

export default function StockDocumentTable({
  items = [],
  setItems,
  priceField = "costPrice",
  showWarehouse = false,
  showRowNumbers = false,
  showLotFields = false,
  purchasedAt,
  productTypeFilter = "",
  allowLotSelection = false,
  allowUnitConversion = false,
  requireMaterialLots = false,
}) {
  const rowIdPrefix = useId();
  const nextRowId = useRef(0);
  const columns = [...baseColumns];
  if (showRowNumbers)
    columns.unshift({ label: "#", className: "w-[48px] text-center" });
  if (showWarehouse)
    columns.splice(showRowNumbers ? 3 : 2, 0, {
      label: "Kho",
      className: "w-[120px]",
    });
  if (showLotFields) {
    const quantityIndex = columns.findIndex((column) => column.label === "Số lượng");
    columns.splice(quantityIndex, 0,
      { label: "Số lô", className: "w-[180px]" },
      { label: "Ngày sản xuất", className: "w-[170px]" },
      { label: "Hạn sử dụng", className: "w-[170px]" },
    );
  }
  const totalLabelColumns = 2 + Number(showRowNumbers) + Number(showWarehouse) + (showLotFields ? 3 : 0);
  const lotFieldsForProduct = (product) => ({
    lotTrackingEnabled: product.lotTrackingEnabled === true,
    productType: product.productType,
    baseUnitId: product.baseUnitId,
    unitId: allowUnitConversion ? product.baseUnitId : undefined,
    allocations: undefined,
    inputToBaseFactor: 1,
    ...(showLotFields ? {
    isFreshFood: product.isFreshFood === true,
    expiryManuallyEdited: false,
    serialMode: "NONE",
    serialText: "",
    lotCode: createStockLotCode(),
    manufacturedAt: currentPurchaseDateTime().slice(0, 10),
    expiresAt: product.isFreshFood ? freshFoodExpiry(purchasedAt) : "",
    } : {}),
  });
  const [lotItemId, setLotItemId] = useState(null);
  const [serialItemId, setSerialItemId] = useState(null);
  const serialItem = items.find((item) => item.id === serialItemId);
  const lotItem = items.find((item) => item.id === lotItemId);
  const loadProducts = useMemo(() =>
    createStockProductCache(productApi.getAll, productTypeFilter ? { productType: productTypeFilter } : {}),
    [productTypeFilter],
  );
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitError, setUnitError] = useState("");
  const [unitRevision, setUnitRevision] = useState(0);
  useEffect(() => {
    if (!allowUnitConversion) return;
    const controller = new AbortController();
    productApi.getMeasurementUnits(controller.signal).then((rows) => {
      if (!Array.isArray(rows)) throw new Error('Không đọc được danh mục đơn vị.');
      if (!controller.signal.aborted) { setUnits(rows); setUnitError(''); }
    }).catch((error) => {
      if (!controller.signal.aborted) setUnitError(error.response?.data?.message || error.message);
    });
    return () => controller.abort();
  }, [allowUnitConversion, unitRevision]);
  const changeUnit = (index, nextId) => {
    const item = items[index];
    try {
      const choices = compatibleStockUnits(item.baseUnitId, units);
      const from = choices.find((unit) => unit.id === (item.unitId || item.baseUnitId));
      const to = choices.find((unit) => unit.id === nextId);
      const patch = convertStockLineUnit(item, from, to);
      setItems((previous) => previous.map((row, i) => i === index ? { ...row, ...patch } : row));
      setUnitError('');
    } catch (error) { setUnitError(error.message); }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const data = await loadProducts(search);
        if (!cancelled) setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    // Prefetch immediately on entry; the row pickers reuse this same promise.
    if (!search.trim()) {
      fetchProducts();
      return () => {
        cancelled = true;
      };
    }
    const timer = setTimeout(fetchProducts, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, loadProducts]);

  const filteredProducts = products;

  const handleAddProduct = (product) => {
    const existingIndex = items.findIndex(
      (item) => item.productId === product.id,
    );
    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].allocations = undefined;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          id: `product-${product.id}`,
          ...lotFieldsForProduct(product),
          productId: product.id,
          code: product.code || "",
          name: product.name,
          unit: product.unit || "Cái",
          quantity: 1,
          price: stockNumber(product[priceField] ?? 0),
          ...(showWarehouse ? { warehouse: "Kho mặc định" } : {}),
        },
      ]);
    }
    setSearch("");
    setShowSearch(false);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: ["quantity", "price"].includes(field) ? Number(value) || 0 : value,
      ...(field === "expiresAt" ? { expiryManuallyEdited: true } : {}),
      ...(field === "quantity" ? { allocations: undefined } : {}),
    };
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleAddNewRow = () => {
    nextRowId.current += 1;
    setItems([
      ...items,
      {
        id: `${rowIdPrefix}-${nextRowId.current}`,
        productId: "",
        code: "",
        name: "",
        unit: "",
        quantity: 1,
        price: 0,
        ...(showWarehouse ? { warehouse: "Kho mặc định" } : {}),
      },
    ]);
  };

  const handleSelectProductForRow = (index, product) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      ...lotFieldsForProduct(product),
      productId: product.id,
      code: product.code || "",
      name: product.name,
      unit: product.unit || "Cái",
      quantity: 1,
      price: stockNumber(product[priceField] ?? 0),
      ...(showWarehouse ? { warehouse: "Kho mặc định" } : {}),
    };
    setItems(newItems);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex-1 overflow-auto flex flex-col p-4">
      {allowUnitConversion && <p className="mb-3 text-xs text-slate-500">Chọn đơn vị nhập tương thích theo danh mục và hệ số quy đổi đã cấu hình. Số lượng và đơn giá tự quy đổi để giữ nguyên thành tiền; tồn kho được lưu theo đơn vị chuẩn.</p>}
      {unitError && <p role="alert" className="mb-3 text-sm text-red-600">{String(unitError)} <button type="button" onClick={() => setUnitRevision((value) => value + 1)} className="underline">Tải lại đơn vị</button></p>}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold tracking-wide text-slate-800">
          CHI TIẾT
        </h2>

        <div className="relative w-64">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  Không tìm thấy sản phẩm
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full text-left p-3 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.code}</div>
                    <div className="mt-1 text-xs font-medium text-blue-700">
                      Tồn kho hiện tại: {product.remain == null
                        ? "—"
                        : Number(product.remain).toLocaleString("vi-VN")}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-blue-200 bg-white shadow-sm ring-1 ring-blue-100">
        <div className="min-w-full">
          <table
            style={{
              minWidth:
                1100 + (showLotFields ? 520 : 0) + (showWarehouse ? 120 : 0) + (showRowNumbers ? 48 : 0),
            }}
            className="w-full table-fixed border-separate border-spacing-0 text-sm"
          >
            <thead className="sticky top-0 z-10">
              <tr className="whitespace-nowrap bg-gradient-to-r from-blue-700 via-blue-600 to-blue-600 shadow-sm">
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className={`${headerCellClass} ${column.className}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-gray-500"
                  >
                    Chưa có sản phẩm nào được chọn
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const isNewRow = !item.productId;
                  return (
                    <tr
                      key={item.id}
                      className={`text-sm transition-colors hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      {showRowNumbers && (
                        <td
                          className={`${bodyCellClass} border-b border-slate-200 text-center text-slate-500`}
                        >
                          {index + 1}
                        </td>
                      )}
                      <td
                        className={`${bodyCellClass} border-b border-slate-200 font-medium text-blue-700`}
                      >
                        {item.code}
                      </td>
                      <td
                        className={`${bodyCellClass} border-b border-slate-200 font-semibold text-slate-900 relative`}
                      >
                        {isNewRow ? (
                          <StockProductPicker
                            loadProducts={loadProducts}
                            onSelect={(product) =>
                              handleSelectProductForRow(index, product)
                            }
                          />
                        ) : (
                          item.name
                        )}
                        {allowLotSelection && item.lotTrackingEnabled && <div className="mt-2 text-xs font-normal"><button type="button" disabled={!(item.quantity > 0)} className="font-semibold text-blue-600 underline" onClick={() => setLotItemId(item.id)}>Chọn lô FEFO</button><span className="ml-2 text-slate-500">{item.allocations?.length ? `Đã chọn ${item.allocations.length} lô` : 'Chưa chọn lô'}</span></div>}
                      </td>
                      {showWarehouse && (
                        <td
                          className={`${bodyCellClass} border-b border-slate-200 text-slate-500`}
                        >
                          {item.warehouse}
                        </td>
                      )}

                      {showLotFields && [
                        { field: "lotCode", label: "Số lô", type: "text" },
                        { field: "manufacturedAt", label: "Ngày sản xuất", type: "date" },
                        { field: "expiresAt", label: "Hạn sử dụng", type: "date" },
                      ].map(({ field, label, type }) => (
                        <td key={field} className={`${bodyCellClass} border-b border-slate-200`}>
                          <div className="flex items-center gap-1">
                          <input
                            type={type}
                            aria-label={`${label} dòng ${index + 1}`}
                            data-expiry-row={field === 'expiresAt' ? index : undefined}
                            aria-invalid={!isNewRow && field === 'expiresAt' && (item.lotTrackingEnabled || requireMaterialLots) && item.productType === 'INGREDIENT' && !item.expiresAt || undefined}
                            value={item[field] || ""}
                            disabled={isNewRow}
                            readOnly={field === "lotCode"}
                            title={field === "lotCode" ? item.lotCode : field === "expiresAt" && item.isFreshFood ? "Hàng tươi sống: mặc định 7 ngày sau ngày mua, có thể sửa theo thực tế" : undefined}
                            required={(item.lotTrackingEnabled || requireMaterialLots) && (field === "lotCode" || (field === "expiresAt" && item.productType === "INGREDIENT"))}
                            placeholder={field === "lotCode" ? "Tự sinh khi chọn hàng" : undefined}
                            onChange={(event) => handleUpdateItem(index, field, event.target.value)}
                            className={`min-w-0 w-full rounded border px-2 py-1.5 text-sm outline-none disabled:bg-gray-100 ${type === 'date' && !isNewRow && !item[field] ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500'}`}
                          />
                          {type === 'date' && <button
                            type="button"
                            disabled={isNewRow}
                            aria-label={`Mở lịch ${label.toLowerCase()} dòng ${index + 1}`}
                            title={`Chọn ${label.toLowerCase()}`}
                            className="shrink-0 rounded border border-slate-300 bg-white p-1.5 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-40"
                            onClick={(event) => {
                              const input = event.currentTarget.previousElementSibling;
                              input.focus();
                              if (typeof input.showPicker === 'function') {
                                try { input.showPicker(); } catch { /* Manual entry remains available. */ }
                              }
                            }}
                          ><CalendarDays size={16} /></button>}
                          </div>
                          {field === 'expiresAt' && !isNewRow && <div className="mt-2 flex flex-wrap gap-1">
                            {[
                              { label: '+1 tuần', days: 7 },
                              { label: '+1 tháng', months: 1 },
                              { label: '+3 tháng', months: 3 },
                              { label: '+6 tháng', months: 6 },
                            ].map(({ label: optionLabel, ...offset }) => <button
                              key={optionLabel}
                              type="button"
                              title={`${optionLabel} từ ngày sản xuất; nếu chưa có thì từ ngày nhập kho`}
                              aria-label={`Hạn sử dụng ${optionLabel} cho ${item.name}`}
                              className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                              onClick={() => handleUpdateItem(index, 'expiresAt', expiryAfter(item.manufacturedAt || purchasedAt?.slice(0, 10) || currentPurchaseDateTime().slice(0, 10), offset))}
                            >{optionLabel}</button>)}
                          </div>}
                          {field === "lotCode" && !isNewRow && <div className="mt-2 space-y-1">

                            <button type="button" className="text-xs font-semibold text-blue-600 underline" onClick={() => setSerialItemId(item.id)}>Serial trong lô</button>
                            <p className="text-xs text-slate-500">{item.serialMode === 'MANUAL' ? `${(item.serialText || '').split(/\r?\n/).filter((value) => value.trim()).length} serial đã nhập` : item.serialMode === 'AUTO' ? 'Tự sinh serial khi lưu' : 'Không dùng serial'}</p>
                          </div>}
                        </td>
                      ))}
                      <td
                        className={`${numberCellClass} border-b border-slate-200 p-1`}
                      >
                        <input
                          type="number"
                          min={allowUnitConversion ? "0" : showLotFields || allowLotSelection ? "0.0001" : "1"}
                          step={allowUnitConversion ? "any" : showLotFields || allowLotSelection ? "0.0001" : "1"}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, "quantity", e.target.value)
                          }
                          className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded outline-none bg-transparent"
                        />
                      </td>
                      <td
                        className={`${bodyCellClass} border-b border-slate-200 text-slate-500`}
                      >
                        {allowUnitConversion && compatibleStockUnits(item.baseUnitId, units).length > 0 ? (
                          <select aria-label={`Đơn vị nhập ${item.name}`} className="w-full min-w-[70px] rounded border border-slate-200 bg-white px-2 py-1" value={item.unitId || item.baseUnitId} onChange={(event) => changeUnit(index, event.target.value)}>
                            {compatibleStockUnits(item.baseUnitId, units).map((unit) => <option key={unit.id} value={unit.id}>{unit.code}</option>)}
                          </select>
                        ) : item.unit}
                      </td>
                      <td
                        className={`${numberCellClass} border-b border-slate-200 p-1`}
                      >
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleUpdateItem(index, "price", e.target.value)
                          }
                          className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded outline-none bg-transparent"
                        />
                      </td>
                      <td
                        className={`${numberCellClass} border-b border-slate-200`}
                      >
                        {(item.quantity * item.price).toLocaleString("vi-VN")}
                      </td>
                      <td
                        className={`${bodyCellClass} border-r-0 border-b border-slate-200 text-center`}
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Xóa hàng này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot className="sticky bottom-0 z-10 bg-blue-50 shadow-[0_-4px_12px_rgba(37,99,235,0.08)]">
              <tr>
                <td
                  colSpan={totalLabelColumns}
                  className="border-t border-blue-200 px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-blue-700"
                >
                  Tổng cộng
                </td>
                <td className={`${totalCellClass} border-t`}>
                  {totalQuantity.toLocaleString("vi-VN")}
                </td>
                <td className={`${totalCellClass} border-t`}></td>
                <td className={`${totalCellClass} border-t`}></td>
                <td className={`${totalCellClass} border-t`}>
                  {totalAmount.toLocaleString("vi-VN")}
                </td>
                <td className={`${totalCellClass} border-r-0 border-t`}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-3 flex gap-3 relative z-10">
        <button
          type="button"
          onClick={handleAddNewRow}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-sm transition font-medium text-slate-700 cursor-pointer"
        >
          Thêm dòng
        </button>
        <button
          type="button"
          onClick={() => setItems([])}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 active:bg-red-100 text-sm transition font-medium cursor-pointer"
        >
          Xóa hết dòng
        </button>
      </div>

      {showSearch && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearch(false)}
        ></div>
      )}
      {serialItem && <LotSerialEditor key={serialItem.id} item={serialItem} onClose={() => setSerialItemId(null)} onApply={(patch) => {
        setItems((previous) => previous.map((item) => item.id === serialItemId ? { ...item, ...patch } : item));
        setSerialItemId(null);
      }} />}
      {lotItem && <FefoLotPicker productId={lotItem.productId} quantity={lotItem.quantity} unitId={lotItem.baseUnitId} onClose={() => setLotItemId(null)} onApply={(selection) => {
        setItems((previous) => previous.map((item) => item.id === lotItemId ? { ...item, allocations: selection.allocations, unitId: selection.unitId } : item));
        setLotItemId(null);
      }} />}
    </div>
  );
}
