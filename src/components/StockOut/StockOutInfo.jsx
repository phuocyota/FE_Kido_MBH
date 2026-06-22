import React from "react";
import {
  Calendar,
  Plus,
} from "lucide-react";

export default function StockOutInfo() {
  return (
    <div className="bg-cyan-50 p-4 border-b border-gray-300">
      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">
                Mã khách hàng
              </label>

              <div className="flex">
                <input
                  className="w-full h-10 border border-gray-300 px-3"
                />
                <button className="w-10 border border-l-0 border-gray-300 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Tên khách hàng
              </label>

              <input
                className="w-full h-10 border border-gray-300 px-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Người nhận
              </label>

              <input
                className="w-full h-10 border border-gray-300 px-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Địa chỉ
              </label>

              <input
                className="w-full h-10 border border-gray-300 px-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Nhân viên bán hàng
              </label>

              <div className="flex">
                <input
                  className="w-full h-10 border border-gray-300 px-3"
                />
                <button className="w-10 border border-l-0 border-gray-300 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Lý do xuất
              </label>

              <input
                defaultValue="Xuất kho bán hàng"
                className="w-full h-10 border border-gray-300 px-3"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-3">

            <div>
              <label className="text-sm font-medium">
                Ngày hạch toán
              </label>

              <div className="relative">
                <input
                  defaultValue="22/06/2026"
                  className="w-full h-10 border border-gray-300 px-3"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-3"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Ngày chứng từ
              </label>

              <div className="relative">
                <input
                  defaultValue="22/06/2026"
                  className="w-full h-10 border border-gray-300 px-3"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-3"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Số chứng từ
              </label>

              <input
                defaultValue="XK00362"
                className="w-full h-10 border border-gray-300 px-3"
              />
            </div>

            <div className="text-right pt-2">
              <div className="text-gray-600">
                Tổng tiền
              </div>

              <div className="text-5xl font-bold">
                0
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}