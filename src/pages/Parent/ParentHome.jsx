import React  from "react";

export default function ParentHome() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* TITLE */}
      <h1 className="text-xl font-bold mb-4">
        👨‍👩‍👧 Quản lý con
      </h1>

      {/* 👤 THÔNG TIN HỌC SINH */}
      <div className="bg-white rounded-xl p-4 shadow mb-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          className="w-14 h-14 rounded-full"
        />

        <div>
          <p className="font-semibold text-lg">Nguyễn Văn A</p>
          <p className="text-gray-500 text-sm">Lớp 5A</p>
        </div>
      </div>

      {/* 💰 SỐ DƯ */}
      <div className="bg-green-500 text-white rounded-xl p-4 mb-4">
        <p className="text-sm">Số dư</p>

        <p className="text-2xl font-bold">
          45,000đ
        </p>

        <button className="mt-3 bg-white text-green-600 px-3 py-1 rounded">
          ➕ Nạp tiền
        </button>
      </div>

      {/* 🍱 ĐƠN HÔM NAY */}
      <div className="bg-white rounded-xl p-4 shadow mb-4">
        <p className="font-semibold mb-2">🍱 Hôm nay</p>

        <div className="text-sm">
          <p>• Cơm gà x2</p>
          <p>• Sữa</p>
        </div>

        <p className="text-blue-600 font-semibold mt-2">
          Đang chuẩn bị
        </p>
      </div>

      {/* ⚡ CHỨC NĂNG */}
      <div className="grid grid-cols-3 gap-3">
        <button className="bg-white p-3 rounded-xl shadow text-sm">
          📜 Lịch sử
        </button>

        <button className="bg-white p-3 rounded-xl shadow text-sm">
          🚫 Chặn món
        </button>

        <button className="bg-white p-3 rounded-xl shadow text-sm">
          📊 Thống kê
        </button>
      </div>

    </div>
  );
}