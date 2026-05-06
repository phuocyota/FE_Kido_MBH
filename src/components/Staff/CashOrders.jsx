import React from "react";
import bgCam from "../../assets/bg_cam.png";

export default function CashOrders({ orders, onSelect }) {

  function CashOrderCard({ order }) {

    const handlePaid = () => {
      const all = JSON.parse(localStorage.getItem("orders")) || [];

      const updated = all.map(o =>
        o.orderKey === order.orderKey
          ? { ...o, status: "pending" }
          : o
      );

      localStorage.setItem("orders", JSON.stringify(updated));
    };

    return (
      <div
        onClick={() => onSelect(order)}
            className="bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow cursor-pointer flex flex-col h-[230px]   flex-shrink-0"

      >

        {/* HEADER */}
        <p className="text-sm text-gray-500 mb-1 truncate">
          👤 {order.studentName || "Không tên"}
        </p>

        <p className="font-bold text-yellow-600 mb-2 border-b pb-1">
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
                  {(item.price * item.qty).toLocaleString()} đ
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

          <span className="ml-1 px-2 py-1 rounded text-xs
            bg-blue-100 text-blue-600">
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
            handlePaid();
          }}
          className="
            mt-2 w-full bg-yellow-600 text-white py-2 rounded-lg
            hover:bg-yellow-700 transition
          "
        >
          Chờ thanh toán
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
      <div className="bg-yellow-600 text-white px-4 py-2 rounded-t-xl font-semibold sticky top-0 z-20">
        Thanh toán tiền mặt ({orders.length})
      </div>

      {/* BODY */}
      <div className="relative flex-1 min-h-0 rounded-b-xl overflow-hidden h-0">
 

        <div className="absolute inset-0 bg-white" />
        
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    backgroundImage: `url(${bgCam})`,
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
          h-full
    max-h-full
        ">
          {orders.map(order => (
            <CashOrderCard key={order.orderKey} order={order} />
          ))}
        </div>

      </div>
    </div>
  );
}