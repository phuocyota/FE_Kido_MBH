import React, { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";

export default function OrdersSidebar({
  selectedTime,
  setSelectedTime,
  statusFilter,
  setStatusFilter,
  deliveryPartner,
  setDeliveryPartner,
  deliveryTime,
  setDeliveryTime,
  area,
  setArea,
  paymentMethod,
  setPaymentMethod,
  creator,
  setCreator,
  recipient,
  setRecipient,
}) {
  return (
    <div className="relative overflow-visible w-full lg:w-[280px] bg-white rounded-[20px] border border-gray-200 shadow-sm p-4 h-fit flex-shrink-0">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-5 px-1">
        Đặt hàng
      </h1>

      {/* Thời gian */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2.5">
          Thời gian
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="orderTimeFilter"
              checked={selectedTime === "Tháng này"}
              onChange={() => setSelectedTime("Tháng này")}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
              selectedTime === "Tháng này" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
            }`}>
              <span className="font-medium">Tháng này</span>
              <ChevronRight size={16} />
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="orderTimeFilter"
              checked={selectedTime === "Tùy chỉnh"}
              onChange={() => setSelectedTime("Tùy chỉnh")}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
              selectedTime === "Tùy chỉnh" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
            }`}>
              <span className="font-medium">Tùy chỉnh</span>
              <Calendar size={16} className="text-gray-500" />
            </div>
          </label>
        </div>
      </div>

      {/* Trạng thái */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Trạng thái
        </h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn trạng thái</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Phiếu tạm">Phiếu tạm</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {/* Đối tác giao hàng */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Đối tác giao hàng
        </h3>
        <select
          value={deliveryPartner}
          onChange={(e) => setDeliveryPartner(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn đối tác giao hàng</option>
          <option value="Giao hàng nhanh">Giao hàng nhanh</option>
          <option value="Viettel Post">Viettel Post</option>
          <option value="GrabExpress">GrabExpress</option>
          <option value="Tự giao">Tự giao</option>
        </select>
      </div>

      {/* Thời gian giao hàng */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2.5">
          Thời gian giao hàng
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryTimeFilter"
              checked={deliveryTime === "Toàn thời gian"}
              onChange={() => setDeliveryTime("Toàn thời gian")}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
              deliveryTime === "Toàn thời gian" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
            }`}>
              <span className="font-medium">Toàn thời gian</span>
              <ChevronRight size={16} />
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryTimeFilter"
              checked={deliveryTime === "Tùy chỉnh"}
              onChange={() => setDeliveryTime("Tùy chỉnh")}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <div className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
              deliveryTime === "Tùy chỉnh" ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
            }`}>
              <span className="font-medium">Tùy chỉnh</span>
              <Calendar size={16} className="text-gray-500" />
            </div>
          </label>
        </div>
      </div>

      {/* Khu vực giao hàng */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Khu vực giao hàng
        </h3>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn Tỉnh/TP - Quận/Huyện</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Phương thức thanh toán
        </h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn phương thức thanh toán...</option>
          <option value="Tiền mặt">Tiền mặt</option>
          <option value="Thẻ ngân hàng">Thẻ ngân hàng</option>
          <option value="Chuyển khoản">Chuyển khoản</option>
          <option value="Ví điện tử">Ví điện tử</option>
        </select>
      </div>

      {/* Người tạo */}
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Người tạo
        </h3>
        <select
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn người tạo</option>
          <option value="Admin">Admin</option>
          <option value="Nguyễn Văn A">Nguyễn Văn A</option>
        </select>
      </div>

      {/* Người nhận đặt */}
      <div>
        <h3 className="text-[14px] font-semibold text-gray-700 mb-2">
          Người nhận đặt
        </h3>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          <option value="">Chọn người nhận đặt</option>
          <option value="Admin">Admin</option>
          <option value="Nguyễn Văn A">Nguyễn Văn A</option>
        </select>
      </div>
    </div>
  );
}
