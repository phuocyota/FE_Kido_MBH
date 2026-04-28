import React from "react";
import { Bell, Wallet, Utensils, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Good Morning 👋
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* 💰 SỐ DƯ */}
        <div className="md:col-span-1 bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80 mb-1">Số dư</p>
            <p className="text-3xl font-bold">45,000đ</p>
          </div>
          <Wallet size={40} className="opacity-80" />
        </div>

        {/* 🔔 THÔNG BÁO */}
        <div className="md:col-span-2 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-yellow-500" />
            <p className="font-semibold text-gray-800">Thông báo</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Con đã nhận món</span>
              <span className="text-gray-400">10:30</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Đã trừ 30,000đ</span>
              <span className="text-gray-400">10:31</span>
            </div>
          </div>
        </div>

        {/* 🍱 ORDER */}
        <div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Utensils size={18} className="text-green-600" />
            <p className="font-semibold text-gray-800">Order hôm nay của con!</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Cơm gà x2</p>
              <p className="text-sm text-gray-500">+ Sữa</p>
            </div>

            <span className="text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full">
              Đang chuẩn bị
            </span>
          </div>
        </div>

        {/* 🧾 LỊCH SỬ GẦN ĐÂY */}
<div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
  
  <div className="flex items-center justify-between mb-4">
    <p className="font-semibold text-gray-800">🧾 Lịch sử gần đây</p>
    <span
  onClick={() => navigate("/history")} // 👈 đường dẫn route
  className="text-xs text-blue-600 cursor-pointer hover:underline"
>
  Xem tất cả
</span>
  </div>

  <div className="space-y-3 text-sm">

    {/* ITEM */}
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-800">Cơm gà</p>
        <p className="text-gray-400 text-xs">Hôm nay • 10:30</p>
      </div>
      <div className="text-right">
        <p className="text-red-500 font-medium">-30,000đ</p>
        <p className="text-green-600 text-xs">Hoàn thành</p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-800">Bún bò</p>
        <p className="text-gray-400 text-xs">Hôm qua • 11:15</p>
      </div>
      <div className="text-right">
        <p className="text-red-500 font-medium">-25,000đ</p>
        <p className="text-green-600 text-xs">Hoàn thành</p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-800">Mì xào</p>
        <p className="text-gray-400 text-xs">Hôm qua • 09:45</p>
      </div>
      <div className="text-right">
        <p className="text-red-500 font-medium">-20,000đ</p>
        <p className="text-green-600 text-xs">Hoàn thành</p>
      </div>
    </div>

  </div>
</div>

        {/* 📊 THỐNG KÊ */}
        <div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-blue-600" />
            <p className="font-semibold text-gray-800">Thống kê</p>
          </div>

          {/* WEEK */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Tuần này</span>
              <span className="font-medium">150,000đ</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full w-[50%]"></div>
            </div>
          </div>

          {/* MONTH */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tháng này</span>
              <span className="font-medium">600,000đ</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-500 h-2 rounded-full w-[75%]"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}