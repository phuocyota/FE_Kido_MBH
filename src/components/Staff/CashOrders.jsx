import React from "react";
import bgCam from "../../assets/bg_cam.webp";

export default function CashOrders({ orders, onSelect, onPaid }) {
  function CashOrderCard({ order }) {
    return (
      <div
        onClick={() => onSelect(order)}
        className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(234,88,12,0.15)] hover:shadow-[0_8px_24px_-6px_rgba(234,88,12,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[260px] flex-shrink-0 relative group"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm text-gray-700 font-medium truncate flex-1 pr-2 flex items-center gap-1.5">
            <span className="text-lg">👤</span>
            {order.studentName || "Không tên"}
          </p>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
            #{order.id}
          </span>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-2 max-h-[120px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          {order.items.map(item => (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between items-start">
                <span className="truncate text-gray-700 font-medium flex-1">
                  {item.name} <span className="text-orange-500 font-bold ml-1">x{item.qty}</span>
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
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                {order.pickupType || "Tại quầy"}
              </span>
            </div>
            <span className="font-bold text-orange-600 text-base">
              {order.total.toLocaleString()}đ
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPaid?.(order);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:from-orange-600 hover:to-yellow-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Xác nhận thanh toán</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3.5 font-bold sticky top-0 z-20 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <span>💵</span>
            <span>Thanh toán tiền mặt</span>
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
              backgroundImage: `url(${bgCam})`,
              backgroundRepeat: "repeat",
              backgroundSize: "180px"
            }}
          />

          {/* CONTENT */}
          <div className="relative z-10 grid grid-cols-1 gap-3 p-3.5 overflow-y-auto h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {orders.map(order => (
              <CashOrderCard key={order.orderKey} order={order} />
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
                <span className="text-4xl mb-2">🍃</span>
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
