import React, { useState, useEffect } from "react";
import { productApi } from "../../api";
import { Search, Trash2 } from "lucide-react";

const columns = [
  { label: "#", className: "w-10 min-w-10 text-center rounded-tl-lg" },
  { label: "Mã hàng", className: "w-44 min-w-[120px]" },
  { label: "Tên hàng", className: "min-w-[200px]" },
  { label: "Kho", className: "w-32 min-w-[100px]" },
  { label: "TK Nợ", className: "w-28 min-w-[80px]" },
  { label: "TK Có", className: "w-28 min-w-[80px]" },
  { label: "ĐVT", className: "w-28 min-w-[80px]" },
  { label: "Số lượng", className: "w-40 min-w-[100px] text-right" },
  { label: "Đơn giá", className: "w-40 min-w-[120px] text-right" },
  { label: "Thành tiền", className: "w-40 min-w-[130px] text-right rounded-tr-lg" },
  { label: "Chức năng", className: "w-12 text-center" }
];

export default function StockOutTable({ items = [], setItems }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.code || "").toLowerCase().includes(search.toLowerCase())
  );

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
          name: product.name || "",
          unit: product.unit || "Cái",
          quantity: 1,
          price: product.price || 0,
          warehouse: "Kho mặc định",
          debit: "632",
          credit: "1561",
        },
      ]);
    }
    setSearch("");
    setShowSearch(false);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity" || field === "price") {
      newItems[index][field] = Number(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4 flex flex-col">
      {/* Click outside to close search */}
      {showSearch && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)}></div>
      )}

      <div className="flex justify-between items-center mb-3 relative z-50">
        <h3 className="font-semibold text-slate-800 text-base tracking-wide">HÀNG TIỀN</h3>

        <div className="relative w-72">
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
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:border-cyan-500 focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {showSearch && search && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">Không tìm thấy sản phẩm</div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full text-left p-3 hover:bg-cyan-50 border-b border-gray-100 last:border-0"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="font-semibold text-sm text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.code}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-cyan-200 shadow-sm ring-1 ring-cyan-100 bg-white">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-b from-cyan-200 to-cyan-100 text-slate-800 font-semibold sticky top-0 z-10 whitespace-nowrap">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`border-r border-cyan-300 px-3 py-2 text-left ${column.className}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  Chưa có hàng hóa nào được thêm
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-cyan-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-cyan-50/10"
                  }`}
                >
                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-center text-slate-500">
                    {index + 1}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 font-medium text-sky-700">
                    {item.code}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 font-semibold text-slate-900">
                    {item.name}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-slate-600">
                    {item.warehouse}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-center text-slate-600">
                    {item.debit}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-center text-slate-600">
                    {item.credit}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-slate-500">
                    {item.unit}
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1 text-right">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, "quantity", e.target.value)}
                      className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-cyan-500 focus:bg-white rounded outline-none bg-transparent font-semibold tabular-nums text-slate-800"
                    />
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(index, "price", e.target.value)}
                      className="w-full text-right px-2 py-1 border border-transparent hover:border-gray-300 focus:border-cyan-500 focus:bg-white rounded outline-none bg-transparent font-semibold tabular-nums text-slate-800"
                    />
                  </td>

                  <td className="border-r border-dashed border-cyan-200 px-3 py-1.5 text-right font-bold text-slate-850 tabular-nums">
                    {(item.quantity * item.price).toLocaleString("vi-VN")}
                  </td>

                  <td className="text-center px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa hàng này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-bold border-t border-cyan-200">
              <td colSpan={7} className="border-r border-cyan-300 px-3 py-2 text-right text-emerald-800">
                Tổng cộng
              </td>

              <td className="border-r border-cyan-300 px-3 py-2 text-right text-emerald-800 tabular-nums">
                {totalQuantity.toLocaleString("vi-VN")}
              </td>

              <td className="border-r border-cyan-300"></td>

              <td className="border-r border-cyan-300 px-3 py-2 text-right text-emerald-800 tabular-nums">
                {totalAmount.toLocaleString("vi-VN")}
              </td>

              <td className="px-3 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-3 flex gap-3 relative z-10">
        <button
          type="button"
          onClick={() => {
            if (products.length > 0) handleAddProduct(products[0]);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-sm transition font-medium"
        >
          Thêm dòng nhanh
        </button>

        <button
          type="button"
          onClick={handleClearAll}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 active:bg-red-100 text-sm transition font-medium"
        >
          Xóa hết dòng
        </button>
      </div>
    </div>
  );
}