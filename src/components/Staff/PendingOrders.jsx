import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import bgXanhDuong from "../../assets/bg_XanhDuong.png";

export default function PendingOrders({ orders, onSelect }) {

  function OrderCard({ order }) {

    const [timeLeft, setTimeLeft] = useState(0);
 
   useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const createdTime = order.createdAt || Date.now();

    const diff = 15 * 60 * 1000 - (now - createdTime);

    setTimeLeft(diff > 0 ? diff : 0);
  }, 1000);

  return () => clearInterval(interval);
}, [order.createdAt]); // ✅ BẮT BUỘC phải có order.createdAt trong dependency array để cập nhật đúng khi order thay đổi

    const formatTime = (ms) => {
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    };
    const handleDone = () => {
  const all = JSON.parse(localStorage.getItem("orders")) || [];

  const updated = all.map(o =>
    o.orderKey === order.orderKey
      ? { ...o, status: "done" }
      : o
  );

  localStorage.setItem("orders", JSON.stringify(updated));
};



    return (
      <div
        onClick={() => onSelect(order)}
        className="bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow cursor-pointer flex flex-col h-[230px] flex-shrink-0"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">

          {/* LEFT */}
          <p className="text-sm text-gray-500 truncate max-w-[120px]">
            👤 {order.studentName || "Không tên"}
          </p>

          {/* RIGHT */}
          <p className="text-xs text-red-500 font-semibold">
            ⏳ {formatTime(timeLeft)}
          </p>
           
        </div>

        {/* ID */}
        <p className="font-bold text-blue-600 mb-2 border-b border-gray-300 pb-1">
          #{order.id}
        </p>



        {/* 🔥 LIST MÓN (SCROLL) */}
        <div className="flex-1 overflow-y-auto pr-1">

          {order.items.map(item => (
            <div key={item.id} className="text-sm mb-1">

              <div className="flex justify-between">
                <span>{item.name} x{item.qty}</span>
                <span>{(item.price * item.qty).toLocaleString()}đ</span>
              </div>

              {item.note && (
                <div className="text-xs text-orange-500 italic">
                  📝 {item.note}
                </div>
              )}

            </div>
          ))}

        </div>

        {/* 📦 HÌNH THỨC NHẬN (ĐẶT NGOÀI MAP) */}
        <div className="mt-2 text-xs">
          <span className="font-semibold">Nhận: </span>

          {order.pickupType === "Lấy liền" && (
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded ml-1">
              Lấy liền
            </span>
          )}

          {order.pickupType === "Ra chơi lấy" && (
            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded ml-1">
              Ra chơi lấy
            </span>
          )}

          {order.pickupType === "Ra về lấy" && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded ml-1">
              Ra về lấy
            </span>
          )}
        </div>

        {/* TOTAL */}
        <div className="font-bold mt-2 flex justify-between border-t border-gray-300 pt-2">
          <span>Tổng:</span>
          <span>{order.total.toLocaleString()}đ</span>
        </div>

        {/* BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 tránh click mở popup
            handleDone();
          }}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
        >
          Hoàn thành
        </button>

      </div>
    );
  }

  return (
    <div className="w-1/3 p-2 flex flex-col">
      <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold">
        Chờ chế biến
      </div>

      <div className="relative flex-1 rounded-b-xl overflow-hidden">
        <div className="absolute inset-0 bg-white" />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgXanhDuong})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px"
          }}
        />

        <div className="relative z-20 grid grid-cols-3 gap-3 p-4 overflow-y-auto">
          {orders.map(order => (
            <OrderCard key={order.orderKey} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}