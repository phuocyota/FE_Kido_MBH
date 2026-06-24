import React, { useEffect } from "react";
import { ChevronDown, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { productApi } from "../../api";

export default function SidebarFilter() {

      const [openLoaiThucDon, setOpenLoaiThucDon] = useState(true);
      const [openLoaiHang, setOpenLoaiHang] = useState(true);
      const [openNhomHang, setOpenNhomHang] = useState(true);
      const [openTonKho, setOpenTonKho] = useState(true);
      const [openHienThi, setOpenHienThi] = useState(true);
      const [openModal, setOpenModal] = useState(false);
      const [isEdit, setIsEdit] = useState(false);
      const [selectedItem, setSelectedItem] = useState(null);
      const [groupData, setGroupData] = useState([]);
      const [loadingGroups, setLoadingGroups] = useState(false);

      useEffect(() => {
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

            loadCategories();
      }, []);

      return (
            <div className="w-full space-y-4">

                  {/* SEARCH */}
                  <div className="bg-white p-4 rounded-xl shadow">
                        <p className="font-medium mb-2">Tìm kiếm</p>
                        <input
                              type="text"
                              placeholder="Theo mã, tên hàng"
                              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                  </div>

                  {/* LOẠI THỰC ĐƠN */}
                  <div className="bg-white p-4 rounded-xl shadow">
                        <div
                              className="flex justify-between items-center mb-3 cursor-pointer"
                              onClick={() => setOpenLoaiThucDon(!openLoaiThucDon)}
                        >
                              <p className="font-medium">Loại thực đơn</p>

                              <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openLoaiThucDon ? "rotate-180" : ""
                                          }`}
                              />
                        </div>

                        <div
                              className={`overflow-hidden transition-all duration-300 ${openLoaiThucDon ? "max-h-40 mt-3" : "max-h-0"
                                    }`}
                        >
                              <div className="space-y-3 text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4" />
                                          <span>Đồ ăn</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4" />
                                          <span>Đồ uống</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4" />
                                          <span>Khác</span>
                                    </label>
                              </div>
                        </div>
                  </div>

                  {/* LOẠI HÀNG */}
                  <div className="bg-white p-4 rounded-xl shadow">
                        <div
                              className="flex justify-between items-center mb-3 cursor-pointer"
                              onClick={() => setOpenLoaiHang(!openLoaiHang)}
                        >
                              <p className="font-medium">Loại hàng</p>

                              <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openLoaiHang ? "rotate-180" : ""
                                          }`}
                              />
                        </div>

                        <div
                              className={`overflow-hidden transition-all duration-300 ${openLoaiHang ? "max-h-96 mt-3" : "max-h-0"
                                    }`}
                        >
                              <div className="space-y-3 text-sm">

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Hàng hóa thường</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Chế biến</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Dịch vụ</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Combo - Đóng gói</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Combo tùy chọn</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                          <span>Buffet gọi món</span>
                                    </label>
                              </div>
                        </div>
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
                                                setSelectedItem("");
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
                                          placeholder="Tìm kiếm nhóm hàng"
                                          className="w-full border border-gray-300 rounded-lg p-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {/* LIST */}
                                    <div className="text-sm space-y-1">

                                          <p className="font-semibold px-2 py-1">Tất cả</p>

                                          {loadingGroups && (
                                                <div className="px-2 py-1 text-gray-400">
                                                      Đang tải nhóm hàng...
                                                </div>
                                          )}

                                          {!loadingGroups && groupData.length === 0 && (
                                                <div className="px-2 py-1 text-gray-400">
                                                      Chưa có nhóm hàng
                                                </div>
                                          )}

                                          {!loadingGroups && groupData.map((item) => (
                                                <div
                                                      key={item.id}
                                                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded group"
                                                >
                                                      <span>{item.name}</span>

                                                      {/* ICON EDIT */}
                                                      <Pencil
                                                            size={16}
                                                            onClick={() => {
                                                                  setIsEdit(true);
                                                                  setSelectedItem(item); // truyền object luôn
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

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="stock" defaultChecked />
                                          <span>Tất cả</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="stock" />
                                          <span>Dưới định mức tồn</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="stock" />
                                          <span>Vượt định mức tồn</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="stock" />
                                          <span>Còn hàng trong kho</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="stock" />
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

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="display" defaultChecked />
                                          <span>Hàng đang kinh doanh</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="display" />
                                          <span>Hàng ngừng kinh doanh</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                          <input type="radio" name="display" />
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
                                                      value={selectedItem || ""}
                                                      onChange={(e) => setSelectedItem(e.target.value)}
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

                                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
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
                                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer">
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
