import React, { useEffect } from "react";
import { ChevronDown, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { productApi } from "../../api";

export default function SidebarFilter({
      filters = { search: "", categoryId: null, stockStatus: "all", displayStatus: "active" },
      setFilters = () => { }
}) {

      const [openNhomHang, setOpenNhomHang] = useState(true);
      const [openTonKho, setOpenTonKho] = useState(true);
      const [openHienThi, setOpenHienThi] = useState(true);
      const [openModal, setOpenModal] = useState(false);
      const [isEdit, setIsEdit] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [categoryName, setCategoryName] = useState("");
      const [groupData, setGroupData] = useState([]);
      const [loadingGroups, setLoadingGroups] = useState(false);
      const [categorySearch, setCategorySearch] = useState("");

      const loadCategories = async () => {
            try {
                  setLoadingGroups(true);
                  const data = await productApi.getCategories();
                  setGroupData(Array.isArray(data) ? data : []);
            } catch {
                  setGroupData([]);
            } finally {
                  setLoadingGroups(false);
            }
      };

      useEffect(() => {
            loadCategories();
      }, []);

      const handleSaveCategory = async () => {
            if (!categoryName.trim()) return toast.error("Vui lòng nhập tên nhóm");
            try {
                  if (isEdit) {
                        await productApi.updateCategory(selectedCategory.id, { name: categoryName.trim() });
                        toast.success("Cập nhật nhóm hàng thành công");
                  } else {
                        await productApi.createCategory({ name: categoryName.trim() });
                        toast.success("Thêm nhóm hàng thành công");
                  }
                  setOpenModal(false);
                  loadCategories();
            } catch (err) {
                  toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
            }
      };

      const handleDeleteCategory = async () => {
            if (!selectedCategory) return;
            try {
                  await productApi.deleteCategory(selectedCategory.id);
                  toast.success("Xóa nhóm hàng thành công");
                  setOpenModal(false);
                  loadCategories();
            } catch (err) {
                  toast.error(err?.response?.data?.message || "Không thể xóa nhóm hàng");
            }
      };

      const filteredGroups = groupData.filter(item =>
            item.name?.toLowerCase().includes(categorySearch.toLowerCase())
      );

      return (
            <div className="w-full space-y-4">

                  {/* SEARCH */}
                  <div className="bg-white p-4 rounded-xl shadow">
                        <p className="font-medium mb-2">Tìm kiếm</p>
                        <input
                              type="text"
                              value={filters.search}
                              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                              placeholder="Theo mã, tên hàng"
                              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                  </div>

                  {/* NHÓM HÀNG */}
                  <div className="bg-white p-4 rounded-xl shadow">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">

                              {/* LEFT */}
                              <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => setOpenNhomHang(!openNhomHang)}
                              >
                                    <p className="font-medium">Nhóm hàng</p>


                              </div>

                              {/* RIGHT (ICON +) */}
                              {/* RIGHT ICONS */}
                              <div className="flex items-center gap-1 cursor-pointer">

                                    <button
                                          onClick={() => {
                                                setIsEdit(false);
                                                setSelectedCategory(null);
                                                setCategoryName("");
                                                setOpenModal(true);
                                          }}
                                    >
                                          <Plus size={16} />
                                    </button>

                                    <button
                                          onClick={() => setOpenNhomHang(!openNhomHang)}
                                          className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                          <ChevronDown
                                                size={18}
                                                className={`transition-transform duration-300 ${openNhomHang ? "rotate-180" : ""
                                                      }`}
                                          />
                                    </button>

                              </div>
                        </div>

                        {/* CONTENT */}
                        <div
                              className={`overflow-hidden transition-all duration-300 ${openNhomHang ? "max-h-96" : "max-h-0"
                                    }`}
                        >
                              <div className="mt-3">

                                    {/* SEARCH */}
                                    <input
                                          value={categorySearch}
                                          onChange={(e) => setCategorySearch(e.target.value)}
                                          placeholder="Tìm kiếm nhóm hàng"
                                          className="w-full border border-gray-300 rounded-lg p-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {/* LIST */}
                                    <div className="text-sm space-y-1 max-h-60 overflow-y-auto">

                                          <p
                                                className={`font-semibold px-2 py-1 cursor-pointer rounded ${!filters.categoryId ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                                                onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}
                                          >
                                                Tất cả
                                          </p>

                                          {loadingGroups && (
                                                <div className="px-2 py-1 text-gray-400">
                                                      Đang tải nhóm hàng...
                                                </div>
                                          )}

                                          {!loadingGroups && filteredGroups.length === 0 && (
                                                <div className="px-2 py-1 text-gray-400">
                                                      Chưa có nhóm hàng
                                                </div>
                                          )}

                                          {!loadingGroups && filteredGroups.map((item) => (
                                                <div
                                                      key={item.id}
                                                      className={`flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded group cursor-pointer ${filters.categoryId === item.id ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
                                                      onClick={() => setFilters(prev => ({ ...prev, categoryId: item.id }))}
                                                >
                                                      <span>{item.name}</span>

                                                      {/* ICON EDIT */}
                                                      <Pencil
                                                            size={16}
                                                            onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setIsEdit(true);
                                                                  setSelectedCategory(item);
                                                                  setCategoryName(item.name);
                                                                  setOpenModal(true);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-blue-600"
                                                      />
                                                </div>
                                          ))}

                                    </div>

                              </div>
                        </div>

                  </div>

                  {/* TỒN KHO */}
                  <div className="bg-white p-4 rounded-xl shadow">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                              <p className="font-medium">Tồn kho</p>

                              <button
                                    onClick={() => setOpenTonKho(!openTonKho)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                              >
                                    <ChevronDown
                                          size={18}
                                          className={`transition-transform duration-300 ${openTonKho ? "rotate-180" : ""
                                                }`}
                                    />
                              </button>
                        </div>

                        {/* CONTENT */}
                        <div
                              className={`overflow-hidden transition-all duration-300 ${openTonKho ? "max-h-96 mt-3" : "max-h-0"
                                    }`}
                        >
                              <div className="space-y-3 text-sm">

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="stock"
                                                checked={filters.stockStatus === "all"}
                                                onChange={() => setFilters(prev => ({ ...prev, stockStatus: "all" }))}
                                          />
                                          <span>Tất cả</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="stock"
                                                checked={filters.stockStatus === "under"}
                                                onChange={() => setFilters(prev => ({ ...prev, stockStatus: "under" }))}
                                          />
                                          <span>Dưới định mức tồn</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="stock"
                                                checked={filters.stockStatus === "over"}
                                                onChange={() => setFilters(prev => ({ ...prev, stockStatus: "over" }))}
                                          />
                                          <span>Vượt định mức tồn</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="stock"
                                                checked={filters.stockStatus === "inStock"}
                                                onChange={() => setFilters(prev => ({ ...prev, stockStatus: "inStock" }))}
                                          />
                                          <span>Còn hàng trong kho</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="stock"
                                                checked={filters.stockStatus === "outOfStock"}
                                                onChange={() => setFilters(prev => ({ ...prev, stockStatus: "outOfStock" }))}
                                          />
                                          <span>Hết hàng trong kho</span>
                                    </label>

                              </div>
                        </div>

                  </div>

                  {/* HIỂN THỊ */}
                  <div className="bg-white p-4 rounded-xl shadow">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                              <p className="font-medium">Lựa chọn hiển thị</p>

                              <button
                                    onClick={() => setOpenHienThi(!openHienThi)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                              >
                                    <ChevronDown
                                          size={18}
                                          className={`transition-transform duration-300 ${openHienThi ? "rotate-180" : ""
                                                }`}
                                    />
                              </button>
                        </div>

                        {/* CONTENT */}
                        <div
                              className={`overflow-hidden transition-all duration-300 ${openHienThi ? "max-h-40 mt-3" : "max-h-0"
                                    }`}
                        >
                              <div className="space-y-3 text-sm">

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="display"
                                                checked={filters.displayStatus === "active"}
                                                onChange={() => setFilters(prev => ({ ...prev, displayStatus: "active" }))}
                                          />
                                          <span>Hàng đang kinh doanh</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="display"
                                                checked={filters.displayStatus === "inactive"}
                                                onChange={() => setFilters(prev => ({ ...prev, displayStatus: "inactive" }))}
                                          />
                                          <span>Hàng ngừng kinh doanh</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                                type="radio"
                                                name="display"
                                                checked={filters.displayStatus === "all"}
                                                onChange={() => setFilters(prev => ({ ...prev, displayStatus: "all" }))}
                                          />
                                          <span>Tất cả</span>
                                    </label>

                              </div>
                        </div>

                  </div>

                  {/* MODAL */}

                  {openModal && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                              <div className="bg-white w-[500px] rounded-xl shadow-lg p-6">

                                    {/* HEADER */}
                                    <div className="flex justify-between items-center mb-4">
                                          <h2 className="font-semibold text-lg">
                                                {isEdit ? "Sửa nhóm hàng" : "Thêm nhóm hàng"}
                                          </h2>

                                          <button className="cursor-pointer" onClick={() => setOpenModal(false)}>✕</button>
                                    </div>

                                    {/* FORM */}
                                    <div className="space-y-4">

                                          {/* TÊN NHÓM */}
                                          <div>
                                                <label className="block text-sm mb-1">Tên nhóm</label>
                                                <input
                                                      value={categoryName}
                                                      onChange={(e) => setCategoryName(e.target.value)}
                                                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                          </div>

                                          {/* NHÓM CHA */}
                                          <div>
                                                <label className="block text-sm mb-1">Nhóm cha</label>
                                                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                                      <option>--Lựa chọn--</option>
                                                </select>
                                          </div>

                                    </div>

                                    {/* FOOTER */}
                                    <div className="flex justify-end gap-2 mt-6">

                                          <button 
                                                onClick={handleSaveCategory}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                                          >
                                                Lưu
                                          </button>

                                          <button
                                                onClick={() => setOpenModal(false)}
                                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 cursor-pointer"
                                          >
                                                Bỏ qua
                                          </button>

                                          {/* CHỈ HIỆN KHI EDIT */}
                                          {isEdit && (
                                                <button 
                                                      onClick={handleDeleteCategory}
                                                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                                                >
                                                      Xóa
                                                </button>
                                          )}

                                    </div>

                              </div>
                        </div>
                  )}

            </div>
      );
}
