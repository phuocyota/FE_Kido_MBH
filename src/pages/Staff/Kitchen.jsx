import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { Trash2 } from "lucide-react";
import bgCam from "../../assets/bg_cam.png";
import bgXanhDuong from "../../assets/bg_XanhDuong.png";
import bgXanhLa from "../../assets/bg_xanhla.png";
import bgCantin from "../../assets/anh-can-tin-so-2.png";


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
  const [confirmModal, setConfirmModal] = useState(null);
  const bufferRef = useRef("");
  useEffect(() => {
    let timeout;

    const handleKeyDown = (e) => {

      // 👉 nhập số
      if (e.key >= "0" && e.key <= "9") {
        bufferRef.current += e.key;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          bufferRef.current = "";
        }, 500);
      }

      // 👉 enter = scan xong
      if (e.key === "Enter") {
        if (bufferRef.current.length > 0) {
          handleScan(bufferRef.current);
          bufferRef.current = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleScan = (cardId) => {
    // console.log("📌 Quét:", cardId);

    const all = JSON.parse(localStorage.getItem("orders")) || [];

    // console.log("📦 Orders:", all);

    // 👉 tìm đơn theo studentId
    const foundOrder = all.find(
      o => String(o.studentId) === String(cardId)
    );

    if (foundOrder) {
      // 👉 hiện popup
      setConfirmModal(foundOrder);
    } else {
      alert("❌ Sai thẻ hoặc không có đơn");
    }
  };

  const handleAction = (order) => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    let updated = [];

    if (order.status === "cash") {
      updated = all.map(o =>
        o.id === order.id ? { ...o, status: "pending" } : o
      );
    }

    else if (order.status === "pending") {
      updated = all.map(o =>
        o.id === order.id ? { ...o, status: "done" } : o
      );
    }

    else if (order.status === "done") {
      updated = all.filter(o => o.id !== order.id);
    }

    localStorage.setItem("orders", JSON.stringify(updated));

    setConfirmModal(null);
  };

  const updateOrder = (order, action) => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    let updated = [];

    if (action === "pending") {
      updated = all.map(o =>
        o.id === order.id ? { ...o, status: "pending" } : o
      );
    }

    else if (action === "done") {
      updated = all.map(o =>
        o.id === order.id ? { ...o, status: "done" } : o
      );
    }

    else if (action === "remove") {
      updated = all.filter(o => o.id !== order.id);
    }

    localStorage.setItem("orders", JSON.stringify(updated));

    setConfirmModal(null);
  };
  return (
    <div
      className="h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${bgCantin})` }}
    >
      {/* CỘT 1: TIỀN MẶT */}
      <div className="w-1/3 p-2 flex flex-col">
        <div className="bg-yellow-600 text-white px-4 py-2 rounded-t-xl font-semibold">
          Thanh toán tiền mặt
        </div>

      
        <div className="relative flex-1 rounded-b-xl overflow-hidden">

          {/* NỀN TRẮNG */}
          <div className="absolute inset-0 bg-white" />

          {/* BG CAM */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `url(${bgCam})`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px",
              opacity: 1
            }}
          />

          {/* CONTENT */}
          <div className="relative z-20 items-start auto-rows-min grid grid-cols-3 gap-3 p-4 overflow-y-auto">
            {cashOrders.map(order => (
              <CashOrderCard key={order.id} order={order} />
            ))}
          </div>

        </div>
      </div>


      {/* CỘT 2: CHẾ BIẾN */}
      <div className="w-1/3 p-2 flex flex-col">
  <div className="bg-blue-800 text-white px-4 py-2 rounded-t-xl font-semibold">
    Chờ chế biến
  </div>

  <div className="relative flex-1 rounded-b-xl overflow-hidden">

    {/* NỀN TRẮNG */}
    <div className="absolute inset-0 bg-white" />

    {/* BG XANH DƯƠNG */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        backgroundImage: `url(${bgXanhDuong})`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px"
      }}
    />

    {/* CONTENT */}
    <div className="relative z-20 grid grid-cols-3 gap-3 p-4 overflow-y-auto">
      {pendingOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>

  </div>
</div>

      {/* CỘT 3: HOÀN THÀNH */}
      <div className="w-1/3 p-2 flex flex-col">
  <div className="bg-green-700 text-white px-4 py-2 rounded-t-xl font-semibold">
    Đã xong / Chờ lấy món
  </div>

  <div className="relative flex-1 rounded-b-xl overflow-hidden">

    {/* NỀN TRẮNG */}
    <div className="absolute inset-0 bg-white" />

    {/* BG XANH LÁ */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        backgroundImage: `url(${bgXanhLa})`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px"
      }}
    />

    {/* CONTENT */}
    <div className="relative z-20 grid grid-cols-3 gap-3 p-4 overflow-y-auto">
      {doneOrders.map(order => (
        <OrderDoneCard
          key={order.id}
          order={order}
          onPickup={setPickupModal}
        />
      ))}
    </div>

  </div>
</div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[420px] relative shadow-lg">

            {/* ❌ CLOSE */}
            <button
              onClick={() => setConfirmModal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg cursor-pointer"
            >
              ✖
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-3">
              🧾 Thông tin đơn hàng
            </h2>

            {/* 👤 */}
            <p className="text-gray-600 mb-2">
              👤 Học sinh: <b>{confirmModal.studentName}</b>
            </p>

            {/* ID */}
            <p className="font-bold text-gray-700 mb-3 border-b border-gray-300 pb-2">
              #{confirmModal.id}
            </p>

            {/* PAYMENT */}
            <div className="mb-3">
              <span className="font-semibold">Thanh toán: </span>

              {confirmModal.paymentMethod === "card" ? (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm ml-2">
                  💳 Quẹt thẻ
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm ml-2">
                  💵 Tiền mặt
                </span>
              )}
            </div>
            {/* 📦 HÌNH THỨC NHẬN */}
            <div className="mb-3">
              <span className="font-semibold">Hình thức nhận: </span>

              {confirmModal.pickupType === "Lấy liền" && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm ml-2">
                  Lấy liền
                </span>
              )}

              {confirmModal.pickupType === "Ra chơi lấy" && (
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm ml-2">
                  Ra chơi lấy
                </span>
              )}

              {confirmModal.pickupType === "Ra về lấy" && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm ml-2">
                  Ra về lấy
                </span>
              )}
            </div>

            {/* ITEMS */}
            {confirmModal.items.map(item => (
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

            {/* TOTAL */}
            <div className="font-bold mt-3 flex justify-between border-t border-gray-300 pt-2">
              <span>Tổng:</span>
              <span className="text-blue-600">
                {confirmModal.total.toLocaleString()}đ
              </span>
            </div>

            {/* 🔥 3 BUTTON */}
            <div className="mt-4 grid gap-2">

              {/* 💵 CHỜ THANH TOÁN */}
              {confirmModal.status === "cash" && (
                <button
                  onClick={() => updateOrder(confirmModal, "pending")}
                  className="w-full bg-yellow-500 text-white py-2 rounded font-semibold cursor-pointer"
                >
                  Xác nhận đã thanh toán
                </button>
              )}

              {/* 🍳 + 🎉 */}
              {confirmModal.status !== "cash" && (
                <div className="grid grid-cols-2 gap-2">

                  <button
                    onClick={() => updateOrder(confirmModal, "done")}
                    className="bg-blue-600 text-white py-2 rounded font-semibold cursor-pointer"
                  >
                    Hoàn thành
                  </button>

                  <button
                    onClick={() => updateOrder(confirmModal, "remove")}
                    className="bg-green-600 text-white py-2 rounded font-semibold cursor-pointer"
                  >
                    Đã nhận món
                  </button>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

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
      <div className="bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow">

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
      <div className=" bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow">

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
      <div className=" bg-white border border-gray-300 rounded-xl p-3 mb-3 shadow">

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