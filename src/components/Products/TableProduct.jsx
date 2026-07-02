import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Edit2, Save, Trash2, X } from "lucide-react";
import AddProductModal from "./AddProductModal";
import toast from "react-hot-toast";
import { productApi } from "../../api";

// Inline editable cell component
function EditableCell({ value, onSave, type = "text", align = "left" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1 bg-white shadow-md border border-blue-500 rounded px-2 py-1 min-w-[120px]">
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-0 px-0 py-0 text-sm border-0 outline-none text-${align}`}
          />
          <button
            onClick={handleSave}
            className="p-0.5 text-green-600 hover:bg-green-50 rounded shrink-0"
          >
            <Save size={12} />
          </button>
          <button
            onClick={handleCancel}
            className="p-0.5 text-red-600 hover:bg-red-50 rounded shrink-0"
          >
            <X size={12} />
          </button>
        </div>
        <span className="invisible">{value}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-${align} group flex items-center justify-between overflow-hidden`}
    >
      <span className="truncate">{value}</span>
      <Edit2 size={14} className="opacity-0 group-hover:opacity-50 text-gray-400 shrink-0 ml-1" />
    </div>
  );
}

export default function TableProduct({ filters = { search: "", categoryId: null, stockStatus: "all", displayStatus: "active" } }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 22;

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const payload = {
        ...filters,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };
      const responseData = await productApi.getAll(payload);
      const items = responseData.items || [];
      const totalPagesServer = responseData.totalPages || 1;

      // Map BE fields to FE format
      const mappedData = items.map(p => {
        let imageUrl = p.imageUrl || "";
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
          const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
          if (!imageUrl.startsWith("/")) {
            imageUrl = `/${imageUrl}`;
          }
          imageUrl = `${baseUrl}${imageUrl}`;
        }
        return {
          id: p.id,
          categoryId: p.categoryId,
          code: p.sku,
          name: p.name,
          category: p.category?.name || "",
          price: parseFloat(p.price),
          cost: parseFloat(p.costPrice),
          unit: p.unit || "",
          isActive: p.isActive,
          isCanteenItem: p.isCanteenItem,
          isBoarding: p.isCanteenItem === false,
          imageUrl,
          stock: p.remain || 0,
        };
      });
      setProducts(mappedData);
      setTotalPages(totalPagesServer);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const currentData = products;

  const handleUpdateProduct = async (productId, field, value) => {
    try {
      const updateData = { [field]: value };
      await productApi.update(productId, updateData);
      toast.success("Cập nhật thành công");
      fetchProducts();
    } catch (error) {
      toast.error("Không thể cập nhật");
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Xoa san pham "${product.name}"?`)) return;

    try {
      await productApi.delete(product.id);
      toast.success("Xoa san pham thanh cong");
      fetchProducts();
    } catch (error) {
      toast.error("Khong the xoa san pham");
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Hàng hóa</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedProduct(null);
              setOpenAddModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer  "
          >
            + Thêm mới
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            Import
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            Xuất file
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="max-h-[900px] overflow-y-auto">
          <table className="w-full text-sm">
            
            {/* HEADER */}
            <thead className="bg-blue-50 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-2"><input type="checkbox" /></th>
                <th className="p-2 text-left">Mã hàng</th>
                <th className="p-2 text-left">Tên hàng</th>
                <th className="p-2 text-center">Loại</th>
                <th className="p-2 text-center">Giá bán</th>
                <th className="p-2 text-center">Giá vốn</th>
                <th className="p-2 text-center">Tồn kho</th>
                <th className="p-2 text-center">Đặt hàng</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-gray-400">
                    Không có dữ liệu sản phẩm
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="p-4 text-center"><input type="checkbox" /></td>
                    <td className="p-2">
                      <EditableCell
                        value={item.code}
                        onSave={(val) => handleUpdateProduct(item.id, "sku", val)}
                      />
                    </td>
                    <td className="p-2">
                      <EditableCell
                        value={item.name}
                        onSave={(val) => handleUpdateProduct(item.id, "name", val)}
                      />
                    </td>
                    <td className="p-2 text-center">{item.category}</td>
                    <td className="p-2">
                      <EditableCell
                        value={item.price}
                        onSave={(val) => handleUpdateProduct(item.id, "price", parseFloat(val))}
                        type="number"
                        align="center"
                      />
                    </td>
                    <td className="p-2">
                      <EditableCell
                        value={item.cost}
                        onSave={(val) => handleUpdateProduct(item.id, "costPrice", parseFloat(val))}
                        type="number"
                        align="center"
                      />
                    </td>
                    <td className="p-4 text-center">{item.stock}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setOpenAddModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Sửa chi tiết"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xoa san pham"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AddProductModal
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setSelectedProduct(null);
        }}
        initialData={selectedProduct}
        onSave={async (data, isEdit, productId, keepOpen = false) => {
          try {
            const payload = {
              name: data.name.trim(),
              price: Number(data.price || 0),
              costPrice: Number(data.cost || 0),
              sku: data.code || undefined,
              categoryId: data.categoryId || undefined,
              unit: data.unit || undefined,
              isActive: data.active,
              isCanteenItem: !data.isBoarding,
              imageUrl: data.imageUrl || undefined,
              ingredients: data.ingredients || undefined,
              description: data.description || undefined,
            };

            if (isEdit && productId) {
              await productApi.update(productId, payload);
              toast.success("Cập nhật sản phẩm thành công");
            } else {
              await productApi.create(payload);
              toast.success("Thêm sản phẩm thành công");
            }
            fetchProducts();
            if (!keepOpen) {
              setOpenAddModal(false);
              setSelectedProduct(null);
            }
            return true;
          } catch (error) {
            toast.error(isEdit ? "Không thể cập nhật sản phẩm" : "Không thể tạo sản phẩm");
          }
        }}
      />
    </div>
  );
}
