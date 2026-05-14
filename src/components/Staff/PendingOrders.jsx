import React, { useEffect, useState } from "react";
import bgXanhDuong from "../../assets/bg_XanhDuong.png";

export default function PendingOrders({ orders, onSelect, onDone }) {

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
    }, [order.createdAt]);

    const formatTime = (ms) => {
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
      <div
        onClick={() => onSelect(order)}
            className="bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow cursor-pointer flex flex-col h-[230px]   flex-shrink-0"

      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-500 truncate">
            👤 {order.studentName || "Không tên"}
          </p>

          <p className="text-xs text-red-500 font-semibold">
            {formatTime(timeLeft)}
          </p>
        </div>

        {/* ID */}
        <p className="font-bold text-blue-600 mb-2 border-b pb-1">
          #{order.id}
        </p>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 max-h-[120px]">
          {order.items.map(item => (
            <div key={item.id} className="text-sm">

              <div className="flex justify-between">
                <span className="truncate">
                  {item.name} x{item.qty}
                </span>
                <span className="whitespace-nowrap">
                  {(item.price * item.qty).toLocaleString()}đ
                </span>
              </div>

              {item.note && (
                <div className="text-xs text-orange-500 italic truncate">
                  📝 {item.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PICKUP */}
        <div className="mt-2 text-xs">
          <span className="font-semibold">Nhận: </span>

          <span className="ml-1 px-2 py-1 rounded bg-blue-100 text-blue-600">
            {order.pickupType}
          </span>
        </div>

        {/* TOTAL */}
        <div className="font-bold mt-2 flex justify-between border-t pt-2">
          {/* <span>Tổng:</span> */}
          <span>{order.total.toLocaleString()}đ</span>
        </div>

        {/* BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDone?.(order);
          }}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Hoàn thành
        </button>

      </div>
    );
  }

  return (
    <div className="
      w-full 
      sm:w-1/2 
      lg:w-1/3 
      p-2 flex flex-col
      min-h-0
    ">

      {/* HEADER */}
      <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold sticky top-0 z-20">
        Chờ chế biến ({orders.length})
      </div>

      {/* BODY */}
      <div className="relative flex-1 min-h-0 rounded-b-xl overflow-hidden">

  
<div className="absolute inset-0 bg-white" />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgXanhDuong})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px"
          }}
        />

  {/* CONTENT */}
  <div className="
    relative z-10
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    gap-3 
    p-3 
    overflow-y-auto
  ">
          {orders.map(order => (
            <OrderCard key={order.orderKey} order={order} />
          ))}
        </div>

      </div>
    </div>
  );
}
