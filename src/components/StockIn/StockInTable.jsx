import React, { useState, useEffect } from "react";
import { productApi } from "../../api";
import { Search, Trash2 } from "lucide-react";

const columns = [
  { label: "Mã hàng hóa", className: "min-w-[120px] rounded-tl-lg" },
  { label: "Tên hàng hóa", className: "min-w-[200px]" },
  { label: "Đơn vị tính", className: "min-w-[110px]" },
  { label: "Số lượng", className: "min-w-[100px] text-right" },
  { label: "Đơn giá", className: "min-w-[120px] text-right" },
  { label: "Thành tiền", className: "min-w-[130px] text-right" },
  { label: "Xóa", className: "w-12 text-center rounded-tr-lg" },
];

const headerCellClass =
  "border-r border-white/20 px-3 py-3 text-left text-[11px] font-bold uppercase text-white";
const bodyCellClass = "border-r border-slate-200/80 px-3 py-3 text-slate-700";
const numberCellClass = `${bodyCellClass} text-right font-semibold tabular-nums text-slate-800`;
const totalCellClass =
  "border-r border-emerald-200 px-3 py-3 text-right font-bold tabular-nums text-emerald-800";

export default function StockInTable({ items, setItems }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll({ search });
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const filteredProducts = products;

  const handleAddProduct = (product) => {
    const existingIndex = items.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          id: Date.now(),
          productId: product.id,
          code: product.code || "",
          name: product.name,
          unit: product.unit || "Cái",
          quantity: 1,
          price: product.costPrice || 0,
        },
      ]);
    }
    setSearch("");
    setShowSearch(false);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = Number(value) || 0;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleAddNewRow = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}`,
        productId: "",
        code: "",
        name: "",
        unit: "",
        quantity: 1,
        price: 0,
        searchText: "",
        isSearchOpen: true,
        filteredList: products,
      },
    ]);
  };

  const handleRowSearchChange = (index, value) => {
    const newItems = [...items];
    newItems[index].searchText = value;
    newItems[index].filteredList = products.filter((p) =>
      (p.name || "").toLowerCase().includes(value.toLowerCase()) ||
      (p.code || "").toLowerCase().includes(value.toLowerCase())
    );
    setItems(newItems);
  };

  const handleRowSearchFocus = (index, isOpen) => {
    const newItems = [...items];
    newItems[index].isSearchOpen = isOpen;
    if (isOpen && (!newItems[index].filteredList || newItems[index].filteredList.length === 0)) {
      newItems[index].filteredList = products;
    }
    setItems(newItems);
  };

  const handleSelectProductForRow = (index, product) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: product.id,
      code: product.code || "",
      name: product.name,
      unit: product.unit || "Cái",
      quantity: 1,
      price: product.costPrice || 0,
      isSearchOpen: false,
    };
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex-1 overflow-auto flex flex-col p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold tracking-wide text-slate-800">CHI TIẾT</h2>
        
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
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:border-emerald-500 focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">Không tìm thấy sản phẩm</div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full text-left p-3 hover:bg-emerald-50 border-b border-gray-100 last:border-0"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="font-medium text-sm text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.code}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-100">
        <div className="min-w-full">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 shadow-sm">
                {columns.map((column) => (
                  <th key={column.label} className={`${headerCellClass} ${column.className}`}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                    Chưa có sản phẩm nào được chọn
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const isNewRow = !item.productId;
                  return (
                    <tr
                      key={item.id}
                      className={`text-sm transition-colors hover:bg-emerald-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-sky-50/40"
                      }`}
                    >
                      <td className={`${bodyCellClass} border-b border-slate-200 font-medium text-sky-700`}>
                        {item.code}
                      </td>
                      <td className={`${bodyCellClass} border-b border-slate-200 font-semibold text-slate-900 relative`}>
                        {isNewRow ? (
                          <div className="relative w-full">
                            <input
                              type="text"
                              placeholder="Nhập để tìm sản phẩm..."
                              value={item.searchText || ""}
                              onChange={(e) => handleRowSearchChange(index, e.target.value)}
                              onFocus={() => handleRowSearchFocus(index, true)}
                              className="w-full px-2 py-1 text-sm border border-emerald-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                              autoFocus
                            />
                            {item.isSearchOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => handleRowSearchFocus(index, false)}></div>
                                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                  {item.filteredList && item.filteredList.length === 0 ? (
                                    <div className="p-3 text-xs text-gray-500">Không tìm thấy sản phẩm</div>
                                  ) : (
                                    (item.filteredList || products).slice(0, 50).map((product) => (
                                      <button
                                        key={product.id}
                                        type="button"
                                        className="w-full text-left p-2 hover:bg-emerald-50 border-b border-gray-100 last:border-0 text-xs"
                                        onClick={() => handleSelectProductForRow(index, product)}
                                      >
                                        <div className="font-semibold text-gray-900">{product.name}</div>
                                        <div className="text-[10px] text-gray-500">{product.code}</div>
                                      </button>
                                    ))
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          item.name
                        )}
                      </td>
                    <td className={`${bodyCellClass} border-b border-slate-200 text-slate-500`}>
                      {item.unit}
                    </td>
                    <td className={`${numberCellClass} border-b border-slate-200 p-1`}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, "quantity", e.target.value)}
                        className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-emerald-500 rounded outline-none bg-transparent"
                      />
                    </td>
                    <td className={`${numberCellClass} border-b border-slate-200 p-1`}>
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(index, "price", e.target.value)}
                        className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-emerald-500 rounded outline-none bg-transparent"
                      />
                    </td>
                    <td className={`${numberCellClass} border-b border-slate-200`}>
                      {(item.quantity * item.price).toLocaleString("vi-VN")}
                    </td>
                    <td className={`${bodyCellClass} border-r-0 border-b border-slate-200 text-center`}>
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

            <tfoot className="sticky bottom-0 z-10 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 shadow-[0_-4px_12px_rgba(15,118,110,0.08)]">
              <tr>
                <td colSpan={3} className="border-t border-emerald-200 px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Tổng cộng
                </td>
                <td className={`${totalCellClass} border-t`}>{totalQuantity.toLocaleString("vi-VN")}</td>
                <td className={`${totalCellClass} border-t`}></td>
                <td className={`${totalCellClass} border-t`}>{totalAmount.toLocaleString("vi-VN")}</td>
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
        <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)}></div>
      )}
    </div>
  );
}
