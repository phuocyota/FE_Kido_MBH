import React from "react";
import bgCam from "../../assets/bg_cam.png";

export default function CashOrders({ orders, onSelect }) {

  // ================= CARD =================
  function CashOrderCard({ order }) {

    const handlePaid = () => {
      const all = JSON.parse(localStorage.getItem("orders")) || [];

      const updated = all.map(o =>
        o.id === order.id ? { ...o, status: "pending" } : o
      );

      localStorage.setItem("orders", JSON.stringify(updated));
    };

    return (
  <div
    onClick={() => onSelect(order)}
    className="bg-white border border-gray-300 rounded-xl p-3 shadow cursor-pointer flex flex-col h-[230px] w-[190px] flex-shrink-0  "
  >

    {/* HEADER */}
    <p className="text-sm text-gray-500 mb-2">
      👤 {order.studentName || "Không tên"}
    </p>

    <p className="font-bold text-yellow-600 mb-2 border-b border-gray-300 pb-1">
      #{order.id}
    </p>

    {/* 🔥 LIST MÓN (SCROLL) */}
    <div className="flex-1 overflow-y-auto pr-1">

      {order.items.map(item => (
        <div key={item.id} className="text-sm mb-1">
          <div className="flex justify-between">
            <span>{item.name} x{item.qty}</span>
            <span>{(item.price * item.qty).toLocaleString()} đ</span>
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

    {/* TỔNG */}
    <div className="font-bold mt-2 flex justify-between border-t border-gray-300 pt-2">
      <span>Tổng:</span>
      <span>{order.total.toLocaleString()}đ</span>
    </div>

    {/* BUTTON */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // 🔥 tránh click lan lên card
        handlePaid();
      }}
      className="mt-2 w-full bg-yellow-600 text-white py-2 rounded"
    >
      Chờ thanh toán
    </button>

  </div>
);
  }

  // ================= MAIN =================
  return (
    <div className="w-1/2 lg:w-1/3 p-2 flex flex-col">

      {/* HEADER */}
      <div className="bg-yellow-600 text-white px-4 py-2 rounded-t-xl font-semibold">
        Thanh toán tiền mặt
      </div>

      {/* BODY */}
      <div className="relative flex-1 h-full min-h-0 rounded-b-xl overflow-hidden">

        {/* NỀN TRẮNG */}
        <div className="absolute inset-0 bg-white" />

        {/* BG CAM */} 
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgCam})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px"
          }}
        />

        {/* CONTENT */}
        <div className="relative z-20 grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 overflow-y-auto">
          {orders.map(order => (
            <CashOrderCard key={order.id} order={order} />
          ))}
        </div>

      </div>
    </div>
  );
}