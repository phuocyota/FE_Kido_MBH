import React from "react";
import bgXanhLa from "../../assets/bg_xanhla.png";

export default function DoneOrders({ orders, onPickup, onSelect }) {

  function OrderDoneCard({ order }) {

    return (
  <div 
    onClick={() => onSelect(order)}
    className="bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow cursor-pointer flex flex-col h-[230px]   flex-shrink-0"
  >

    {/* HEADER */}
    <p className="text-sm text-gray-500 mb-2">
      👤 {order.studentName || "Không tên"}
    </p>

    {/* ID */}
    <p className="font-bold text-green-600 mb-2 border-b border-green-600 pb-1">
      #{order.id}
    </p>

    {/* 🔥 LIST MÓN (SCROLL) */}
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
      {/* <span>Tổng:</span> */}
      <span>{order.total.toLocaleString()}đ</span>
    </div>

    {/* BUTTON */}
    <button
  onClick={(e) => {
    e.stopPropagation();

    // 🔥 gọi đúng logic quẹt thẻ
    if (onPickup) {
      onPickup(order);
    }
  }}
  className="mt-2 w-full bg-green-600 text-white py-2 rounded"
>
  Nhận món
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
    <div className="bg-green-700 text-white px-4 py-2 rounded-t-xl font-semibold sticky top-0 z-20">
      Đã xong / Chờ lấy món ({orders.length})
    </div>

    {/* BODY */}
    <div className="relative flex-1 min-h-0 rounded-b-xl overflow-hidden">

      {/* BG pattern */}
      <div className="absolute inset-0 bg-white" />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgXanhLa})`,
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
          <OrderDoneCard
            key={order.orderKey}
            order={order}
          />
        ))}
      </div>

    </div>
  </div>
);
}