import React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockInHeader({ paymentStatus, onChangePaymentStatus }) {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-3 md:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">

        {/* Nút quay lại danh sách phiếu nhập kho */}
        <div className="flex w-full shrink-0 flex-col items-start gap-2 sm:flex-row sm:items-center lg:w-auto">
          <button
            type="button"
            onClick={() => navigate("/stock-in")}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Quay lại
          </button>

          {/* Tiêu đề trang thêm mới */}
          <h1 className="text-lg font-semibold leading-tight text-slate-900 md:text-xl">
            Thêm mới phiếu nhập kho
          </h1>
        </div>

        {/* Khu vực thao tác */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

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
              <input 
                type="radio" 
                name="payment" 
                checked={paymentStatus === "DEBT"}
                onChange={() => onChangePaymentStatus("DEBT")}
              />
              Chưa thanh toán
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentStatus === "PAID"}
                onChange={() => onChangePaymentStatus("PAID")}
              />
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
