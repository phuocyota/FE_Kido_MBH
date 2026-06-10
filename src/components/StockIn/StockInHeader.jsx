import React from "react";
import { ChevronDown } from "lucide-react";

export default function StockInHeader() {
  return (
    <div className="border-b border-gray-300 bg-gray-50 p-3 md:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">

        {/* Tiêu đề */}
        <h1 className="text-lg md:text-xl font-semibold shrink-0">
          Thêm mới phiếu nhập kho
        </h1>

        {/* Khu vực thao tác */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 flex-1">

          {/* Loại nhập */}
          <div className="relative w-full sm:w-[180px]">
            <select className="appearance-none h-10 w-full px-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-500 transition">
              <option>Mua hàng</option>
              <option>Khác</option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Radio */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <input type="radio" name="payment" />
              Chưa thanh toán
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <input type="radio" name="payment" />
              Đã thanh toán
            </label>
          </div>

          {/* Hóa đơn */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <label className="text-sm font-medium whitespace-nowrap">
              Chọn HĐ mua hàng
            </label>

            <input
              type="text"
              placeholder="Nhập hóa đơn"
              className="h-10 w-full sm:max-w-[260px] px-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>
      </div>
    </div>
  );
}