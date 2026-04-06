import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Kitchen() {
      // localStorage.removeItem("orders");
  const [orders, setOrders] = useState([]);

  // load data
  useEffect(() => {
    loadOrders();

    // auto reload mỗi 1s (giả lập realtime)
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  };

  // chia 2 nhóm
  const pendingOrders = orders.filter(o => o.status === "pending");
  const doneOrders = orders.filter(o => o.status === "done");

  // xác nhận lấy món (quẹt thẻ)
  const [pickupModal, setPickupModal] = useState(null);
const [cardInput, setCardInput] = useState("");

useEffect(() => {
  if (!pickupModal) return;

  let buffer = "";
  let timeout;

  const handleKeyDown = (e) => {
    // 👉 nhận số
    if (e.key >= "0" && e.key <= "9") {
      buffer += e.key;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        buffer = "";
      }, 500);
    }

    // 👉 khi Enter
    if (e.key === "Enter") {
      if (buffer.length > 0) {
        handleScan(buffer);
        buffer = "";
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [pickupModal]);

const handleScan = (cardId) => {
  console.log("📌 Quét:", cardId);

  if (cardId === pickupModal.studentId) {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = all.filter(o => o.id !== pickupModal.id);

    localStorage.setItem("orders", JSON.stringify(updated));

    setPickupModal(null);

    alert("✅ Nhận món thành công");
  } else {
    alert("❌ Sai thẻ sinh viên");
  }
};

  return (
    <div className="h-screen flex bg-gray-300">

      {/* LEFT */}
      <div className="w-1/2 p-2 flex flex-col">

  {/* HEADER */}
  <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold">
    Chờ chế biến
  </div>

  {/* CONTENT */}
  <div className="bg-white flex-1 rounded-b-xl p-4">
    
    {pendingOrders.length === 0 ? (
      <p className="text-center text-gray-400 mt-10">
        Chưa có đơn hàng cần chế biến
      </p>
    ) : (
      pendingOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))
    )}

  </div>
</div>

      {/* RIGHT */}
      <div className="w-1/2 p-2 flex flex-col">

  {/* HEADER */}
  <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold">
    Đã xong / Chờ lấy món
  </div>

  {/* CONTENT */}
  <div className="bg-white flex-1 rounded-b-xl p-4">

    {doneOrders.length === 0 ? (
      <p className="text-center text-gray-400 mt-10">
        Chưa có đơn hàng cần cung ứng
      </p>
    ) : (
      doneOrders.map(order => (
  <OrderDoneCard 
    key={order.id} 
    order={order}
    onPickup={(order) => setPickupModal(order)}
  />
))
    )}

  </div>
</div>

      {/* PICKUP MODAL */}
      {pickupModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[350px] text-center relative">

      {/* Nút đóng */}
      <button
        onClick={() => setPickupModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-black"
      >
        <X size={20} />
      </button>

      <h2 className="text-lg font-bold mb-3">
        Quẹt thẻ nhận món
      </h2>

      <p className="text-gray-500 mb-4">
        👉 Vui lòng quẹt thẻ học sinh
      </p>

      <div className="text-sm text-gray-400">
        (Không cần bấm gì)
      </div>

    </div>
  </div>
)}

    </div>
  );

  function OrderCard({ order }) {

  const handleDone = () => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = all.map(o =>
      o.id === order.id ? { ...o, status: "done" } : o
    );

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="border border-gray-300 rounded-xl p-3 mb-3 shadow">

      <p className="font-bold text-blue-600 mb-1">
        #{order.id}
      </p>

      {/* ITEMS */}
      {order.items.map(item => (
  <div key={item.id} className="text-sm mb-1">

    <div className="flex justify-between">
      <span>{item.name} x{item.qty}</span>
      <span>{(item.price * item.qty).toLocaleString()}đ</span>
    </div>

    {/* 👉 HIỂN THỊ NOTE */}
    {item.note && (
      <div className="text-xs text-orange-500 italic">
        📝 {item.note}
      </div>
    )}

  </div>
))}

      <div className="font-bold mt-2 text-right">
        {order.total.toLocaleString()}đ
      </div>

      <button
        onClick={handleDone}
        className="mt-2 w-full bg-green-600 text-white py-2 rounded"
      >
        Hoàn thành
      </button>

    </div>
  );
}

function OrderDoneCard({ order, onPickup }) {

  return (
    <div className="border border-gray-300 rounded-xl p-3 mb-3 shadow">

      <p className="font-bold text-green-600 mb-1">
        #{order.id}
      </p>

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

      <div className="font-bold mt-2 text-right">
        {order.total.toLocaleString()}đ
      </div>

      <button
        onClick={() => onPickup(order)}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
      >
        Nhận món
      </button>

    </div>
  );
}


}