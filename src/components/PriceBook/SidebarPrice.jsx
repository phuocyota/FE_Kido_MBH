import React, { useEffect } from "react";
import { ChevronDown, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { productApi } from "../../api";

export default function SidebarFilter() {

      const [openNhomHang, setOpenNhomHang] = useState(true);
      const [openModal, setOpenModal] = useState(false);
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

                  {/* ===== BẢNG GIÁ ===== */}
                  <div className="bg-white p-4 rounded-xl shadow">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                              <p className="font-medium">Bảng giá</p>

                              <button className="p-1 rounded-full hover:bg-gray-100"
                                    onClick={() => {
                                          setOpenModal(true);
                                    }}>
                                    <Plus size={18} />
                              </button>
                        </div>

                        {/* SELECT */}
                        <div className="flex items-center gap-2">
                              <div className="relative w-full">
                                    <select className="w-full border border-gray-300 rounded-lg p-2 text-sm appearance-none pr-8">
                                          <option>Bảng giá chung</option>
                                    </select>

                                    {/* ICON DOWN */}
                                    <ChevronDown
                                          size={16}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                              </div>

                              {/* EDIT */}
                              <button className="p-1 rounded-full hover:bg-gray-100">
                                    <Pencil size={16} />
                              </button>
                        </div>

                  </div>


                  {/* SEARCH */}
                  <div className="bg-white p-4 rounded-xl shadow">
                        <p className="font-medium mb-2">Tìm kiếm</p>
                        <input
                              type="text"
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

                                    {/* <button
                                          onClick={() => {
                                                setIsEdit(false);
                                                setSelectedItem("");
                                                setOpenModal(true);
                                          }}
                                    >
                                          <Plus size={16} />
                                    </button> */}

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
                                                      {/* <Pencil
                                                            size={16}
                                                            onClick={() => {
                                                                  setIsEdit(true);
                                                                  setSelectedItem(item); // truyền object luôn
                                                                  setOpenModal(true);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-blue-600"
                                                      /> */}
                                                </div>
                                          ))}

                                    </div>

                              </div>
                        </div>

                  </div>



                  {/* MODAL */}

                  {openModal && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                              <div className="bg-white w-[800px] rounded-xl shadow-lg">

                                    {/* HEADER */}
                                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
                                          <h2 className="font-semibold text-lg">Thêm bảng giá</h2>
                                          <button className="cursor-pointer" onClick={() => setOpenModal(false)}>✕</button>
                                    </div>

                                    {/* TAB */}
                                    <div className="flex border-b border-gray-300 px-6">
                                          <button className="py-3 px-4 border-b-2 border-green-500 text-green-600 font-medium">
                                                Thông tin
                                          </button>
                                          {/* <button className="py-3 px-4 text-gray-500">
          Phạm vi áp dụng
        </button> */}
                                    </div>

                                    {/* BODY */}
                                    <div className="p-6 space-y-4">

                                          {/* TÊN BẢNG GIÁ */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Tên bảng giá</label>
                                                <input
                                                      className="col-span-2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                          </div>

                                          {/* HIỆU LỰC */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Hiệu lực từ ngày</label>

                                                <div className="col-span-2 flex gap-2">
                                                      <input type="datetime-local" className="border border-gray-300 rounded-lg p-2 w-full" />
                                                      <span className="self-center">Đến</span>
                                                      <input type="datetime-local" className="border border-gray-300 rounded-lg p-2 w-full" />
                                                </div>
                                          </div>

                                          {/* THEO THÁNG */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Theo tháng</label>
                                                <input className="col-span-2 border border-gray-300 rounded-lg p-2" />
                                          </div>

                                          {/* THEO NGÀY */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Theo ngày</label>
                                                <input className="col-span-2 border border-gray-300 rounded-lg p-2" />
                                          </div>

                                          {/* THEO THỨ */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Theo thứ</label>

                                                <div className="col-span-2 flex gap-2 items-center">

                                                      {/* SELECT THỨ */}
                                                      <select className="border rounded-lg p-2">
                                                            <option>Thứ 2</option>
                                                            <option>Thứ 3</option>
                                                            <option>Thứ 4</option>
                                                            <option>Thứ 5</option>
                                                            <option>Thứ 6</option>
                                                      </select>

                                                      <span>của</span>

                                                      <select className="border rounded-lg p-2">
                                                            <option>Tất cả các tuần</option>
                                                            <option>Tuần 1</option>
                                                            <option>Tuần 2</option>
                                                            <option>Tuần 3</option>
                                                            <option>Tuần 4</option>
                                                            <option>Tuần 5</option>
                                                            <option>Tuần cuối cùng</option>
                                                      </select>

                                                      <span>trong tháng</span>
                                                </div>
                                          </div>

                                          {/* THEO GIỜ */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Theo giờ</label>

                                                <div className="col-span-2">
                                                      <div className="flex gap-2 items-center mb-2">
                                                            <input type="time" className="border border-gray-300 rounded-lg p-2" />
                                                            <span>Đến</span>
                                                            <input type="time" className="border border-gray-300 rounded-lg p-2" />
                                                      </div>

                                                      <button className="text-blue-600 text-sm flex items-center gap-1">
                                                            + Thêm khung giờ
                                                      </button>
                                                </div>
                                          </div>

                                          {/* TRẠNG THÁI */}
                                          <div className="grid grid-cols-3 items-center gap-4">
                                                <label className="text-sm">Trạng thái</label>

                                                <div className="col-span-2 flex gap-6">
                                                      <label className="flex items-center gap-2">
                                                            <input type="radio" name="status" defaultChecked />
                                                            Kích hoạt
                                                      </label>

                                                      <label className="flex items-center gap-2">
                                                            <input type="radio" name="status" />
                                                            Chưa áp dụng
                                                      </label>
                                                </div>
                                          </div>

                                    </div>

                                    {/* FOOTER */}
                                    <div className="flex justify-end gap-2 px-6 py-4 border-t">

                                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
                                                Lưu
                                          </button>

                                          <button
                                                onClick={() => setOpenModal(false)}
                                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 cursor-pointer"
                                          >
                                                Bỏ qua
                                          </button>

                                    </div>

                              </div>
                        </div>
                  )}

            </div>
      );
}
