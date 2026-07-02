import React, { useEffect, useState } from "react";
import bgXanhDuong from "../../assets/bg_XanhDuong.webp";

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

    const isUrgent = timeLeft < 5 * 60 * 1000;

    return (
      <div
        onClick={() => onSelect(order)}
        className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(37,99,235,0.15)] hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[260px] flex-shrink-0 relative group"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col flex-1 pr-2">
            <p className="text-sm text-gray-700 font-medium truncate flex items-center gap-1.5">
              <span className="text-lg">👤</span>
              {order.studentName || "Không tên"}
            </p>
            <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 w-fit px-1.5 py-0.5 rounded ${isUrgent ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
              <span>⏱</span> {formatTime(timeLeft)}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
            #{order.id}
          </span>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-2 max-h-[120px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          {order.items.map(item => (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between items-start">
                <span className="truncate text-gray-700 font-medium flex-1">
                  {item.name} <span className="text-blue-500 font-bold ml-1">x{item.qty}</span>
                </span>
                <span className="whitespace-nowrap font-semibold text-gray-900 ml-2">
                  {(item.price * item.qty).toLocaleString()}đ
                </span>
              </div>

              {item.note && (
                <div className="text-[11px] text-gray-500 mt-1 truncate bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                  <span>📝</span> {item.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER AREA */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Nhận:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                {order.pickupType || "Tại quầy"}
              </span>
            </div>
            <span className="font-bold text-blue-600 text-base">
              {order.total.toLocaleString()}đ
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDone?.(order);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Hoàn thành món</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-2 flex flex-col min-h-0">
      <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3.5 font-bold sticky top-0 z-20 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <span>⏳</span>
            <span>Chờ chế biến</span>
          </div>
          <span className="bg-white/25 px-3 py-0.5 rounded-full text-sm backdrop-blur-sm shadow-inner">
            {orders.length}
          </span>
        </div>

        {/* BODY */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-gray-50/50">
          
          {/* BACKGROUND PATTERN */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: `url(${bgXanhDuong})`,
              backgroundRepeat: "repeat",
              backgroundSize: "180px"
            }}
          />

          {/* CONTENT */}
          <div className="relative z-10 grid grid-cols-1 gap-3 p-3.5 overflow-y-auto h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {orders.map(order => (
              <OrderCard key={order.orderKey} order={order} />
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
                <span className="text-4xl mb-2">🍳</span>
                <p>Không có món cần chế biến</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
