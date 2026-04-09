import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Trash2 } from "lucide-react";

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
  const cashOrders = orders.filter(o => o.status === "cash");
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

      {/* CỘT 1: TIỀN MẶT */}
      <div className="w-1/3 p-2 flex flex-col">
        <div className="bg-yellow-600 text-white px-4 py-2 rounded-t-xl font-semibold">
          Thanh toán tiền mặt
        </div>

        <div className=" items-start auto-rows-min grid grid-cols-3 gap-3 bg-white flex-1 rounded-b-xl p-4 overflow-y-auto  ">
          {cashOrders.map(order => (
            <CashOrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* CỘT 2: CHẾ BIẾN */}
      <div className="w-1/3 p-2 flex flex-col">
        <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold">
          Chờ chế biến
        </div>

        {/* <div className="bg-white flex-1 rounded-b-xl p-4">
      {pendingOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div> */}
        <div className=" items-start auto-rows-min grid grid-cols-3 gap-3 bg-white flex-1 rounded-b-xl p-4 overflow-y-auto  ">
          {pendingOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* CỘT 3: HOÀN THÀNH */}
      <div className="w-1/3 p-2 flex flex-col">
        <div className="bg-green-700 text-white px-4 py-2 rounded-t-xl font-semibold">
          Đã xong / Chờ lấy món
        </div>

        <div className=" items-start auto-rows-min grid grid-cols-3 gap-3 bg-white flex-1 rounded-b-xl p-4 overflow-y-auto  ">
          {doneOrders.map(order => (
            <OrderDoneCard key={order.id} order={order} onPickup={setPickupModal} />
          ))}
        </div>
      </div>

    </div>
  );

  function OrderCard({ order }) {

  const [timeLeft, setTimeLeft] = useState(0);

  // ⏱ countdown 30 phút
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = 30 * 60 * 1000 - (now - order.createdAt);

      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  // format mm:ss
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ hoàn thành
  const handleDone = () => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = all.map(o =>
      o.id === order.id ? { ...o, status: "done" } : o
    );

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // ❌ xoá đơn
  const handleDelete = () => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = all.filter(o => o.id !== order.id);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="border border-gray-300 rounded-xl p-3 mb-3 shadow">

      {/* 👤 TÊN + ⏱ + ❌ */}
      <div className="flex justify-between items-center mb-2">

        <p className="text-sm text-gray-500">
          👤 {order.studentName || "Không tên"}
        </p>

        <div className="flex items-center gap-2">

          {/* ⏱ TIMER */}
          <span className="text-xs text-red-500 font-semibold">
            {formatTime(timeLeft)}
          </span>

          {/* ❌ CHỈ HIỆN KHI CÒN THỜI GIAN */}
          {timeLeft > 0 && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          )}

        </div>
      </div>

      {/* ID */}
      <p className="font-bold text-blue-600 mb-1 border-b border-gray-300">
        #{order.id}
      </p>

      {/* ITEMS */}
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

      {/* TỔNG */}
      <div className="font-bold mt-2 flex justify-between border-t border-gray-300 pt-2">
        <span>Tổng:</span>
        <span>{order.total.toLocaleString()}đ</span>
      </div>

      {/* BUTTON */}
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

        <p className="text-sm text-gray-500 mb-2">
          👤 {order.studentName || "Không tên"}
        </p>

        <p className="font-bold text-green-600 mb-1 border-b border-gray-300">
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

        {/* 👉 TỔNG TIỀN */}
        <div className="font-bold mt-2 flex justify-between border-t border-gray-300 pt-2">
  <span>Tổng:</span>
  <span>{order.total.toLocaleString()}đ</span>
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

  function CashOrderCard({ order }) {

    const handlePaid = () => {
      const all = JSON.parse(localStorage.getItem("orders")) || [];

      const updated = all.map(o =>
        o.id === order.id ? { ...o, status: "pending" } : o
      );

      localStorage.setItem("orders", JSON.stringify(updated));
    };

    return (
      <div className="border border-gray-300 rounded-xl p-3 mb-3 shadow">

        <p className="text-sm text-gray-500 mb-2">
          👤 {order.studentName || "Không tên"}
        </p>

        {/* ID + TÊN */}
        <p className="font-bold text-yellow-600 mb-1 border-b border-gray-300">
          #{order.id}
        </p>



        {/* DANH SÁCH MÓN */}
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

        {/* 👉 TỔNG TIỀN */}
        <div className="font-bold mt-2 flex justify-between border-t border-gray-300 pt-2">
  <span>Tổng:</span>
  <span>{order.total.toLocaleString()}đ</span>
</div>

        {/* BUTTON */}
        <button
          onClick={handlePaid}
          className="mt-2 w-full bg-yellow-600 text-white py-2 rounded"
        >
          Chờ thanh toán
        </button>

      </div>
    );
  }


}