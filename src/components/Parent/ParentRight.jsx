import React from "react";

export default function ParentRight() {
  return (
    <div className="flex-1 p-6 overflow-auto">

      
      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">

        {/* 🍱 ĐƠN HÔM NAY */}
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <p className="font-semibold mb-2">🍱 Order hôm nay của con!</p>
          <p>Cơm gà x2</p>
          <p>Sữa</p>
          <p className="text-blue-600 mt-2">Đang chuẩn bị</p>
        </div>

        {/* 🔔 THÔNG BÁO */}
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold mb-2">🔔 Thông báo</p>
          <p className="text-sm">Con đã nhận món</p>
          <p className="text-sm">Đã trừ 30,000đ</p>
        </div>

        {/* 💰 SỐ DƯ */}
        <div className="bg-green-500 text-white p-4 rounded-xl shadow">
          <p>Số dư</p>
          <p className="text-xl font-bold">45,000đ</p>
        </div>

        {/* 📊 THỐNG KÊ */}
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <p className="font-semibold mb-2">📊 Thống kê</p>
          <p>Tuần này: 150,000đ</p>
          <p>Tháng này: 600,000đ</p>
        </div>

      </div>

    </div>
  );
}