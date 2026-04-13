import React, { useEffect, useState, useRef } from "react";
import CashOrders from "../../components/Staff/CashOrders";
import PendingOrders from "../../components/Staff/PendingOrders";
import DoneOrders from "../../components/Staff/DoneOrders";
import bgCantin from "../../assets/anh-can-tin-so-2.png";

export default function Kitchen() {
  // localStorage.removeItem("orders"); 


  const [orders, setOrders] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [cashInput, setCashInput] = React.useState("");

  const bufferRef = useRef("");

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadOrders = () => {
      const data = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(data);
    };

    loadOrders();

    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  // ================= SCAN THẺ =================
  useEffect(() => {
    let timeout;

    const handleKeyDown = (e) => {

      // nhập số
      if (e.key >= "0" && e.key <= "9") {
        bufferRef.current += e.key;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          bufferRef.current = "";
        }, 500);
      }

      // enter = quét xong
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

  // ================= HANDLE SCAN =================
  const handleScan = (cardId) => {

    const all = JSON.parse(localStorage.getItem("orders")) || [];

    // tìm đơn theo studentId
    const foundOrder = all.find(
      o => String(o.studentId) === String(cardId)
    );

    if (foundOrder) {
      setConfirmModal(foundOrder);
    } else {
      alert("❌ Sai thẻ học sinh hoặc không có đơn");
    }
  };

  // ================= UPDATE ORDER =================
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

      {/* 3 CỘT */}
      <CashOrders
        orders={orders.filter(o => o.status === "cash")}
        onSelect={setConfirmModal}
      />
      <PendingOrders
        orders={orders.filter(o => o.status === "pending")}
        onSelect={setConfirmModal}
      />

      <DoneOrders
        orders={orders.filter(o => o.status === "done")}
        onSelect={setConfirmModal}
      />


      {/* ================= MODAL ================= */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[420px] relative shadow-lg">

            {/* CLOSE */}
            <button
              onClick={() => setConfirmModal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-3">
              🧾 Thông tin đơn hàng
            </h2>

            {/* 👤 */}
            <p className="text-gray-600 mb-2">
              👤 {confirmModal.studentName}
            </p>

            {/* ID */}
            <p className="font-bold text-gray-700 mb-3 border-b border-gray-300 pb-2">
              #{confirmModal.id}
            </p>


            {/* DANH SÁCH MÓN */}
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

            {/* 💳 THANH TOÁN */}
            <div className="mb-2 text-sm">
              <span className="font-semibold">Thanh toán: </span>

              {confirmModal.paymentMethod === "card" ? (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2 text-xs">
                  💳 Quẹt thẻ
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded ml-2 text-xs">
                  💵 Tiền mặt
                </span>
              )}
            </div>

            {/* 📦 HÌNH THỨC NHẬN */}
            <div className="mb-3 text-sm">
              <span className="font-semibold">Nhận món: </span>

              {confirmModal.pickupType === "Lấy liền" && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2 text-xs">
                  Lấy liền
                </span>
              )}

              {confirmModal.pickupType === "Ra chơi lấy" && (
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded ml-2 text-xs">
                  Ra chơi lấy
                </span>
              )}

              {confirmModal.pickupType === "Ra về lấy" && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded ml-2 text-xs">
                  Ra về lấy
                </span>
              )}
            </div>



            {/* TOTAL */}
            <div className="font-bold mt-3 flex justify-between border-t border-gray-300 pt-2">
              <span>Tổng:</span>
              <span className="text-blue-600">
                {confirmModal.total.toLocaleString()}đ
              </span>
            </div>

            {/* BUTTON */}
            <div className="mt-4 grid gap-2">

              {/* 💵 CHỜ THANH TOÁN */}
              {confirmModal.status === "cash" && (
                <div className="space-y-2">

                  {/* 💵 INPUT */}
                  <input
                    type="number"
                    placeholder="Nhập tiền khách đưa..."
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />

                  {/* ⚡ MỆNH GIÁ NHANH */}
                  <div className="grid grid-cols-3 gap-2">
                    {[10000, 20000, 30000, 40000, 50000].map(v => (
                      <button
                        key={v}
                        onClick={() => setCashInput(v)}
                        className="bg-gray-100 py-2 rounded text-sm hover:bg-gray-200"
                      >
                        {v.toLocaleString()}đ
                      </button>
                    ))}
                  </div>

                  {/* 💰 TIỀN THỐI */}
                  <div className="text-sm">
                    <span className="text-gray-600">Tiền thối lại: </span>
                    <span className="font-bold text-green-600 ml-2">
                      {cashInput
                        ? Math.max(0, Number(cashInput) - confirmModal.total).toLocaleString()
                        : 0}đ
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      updateOrder(confirmModal, "pending");
                      setCashInput("");
                    }}
                    disabled={Number(cashInput) < confirmModal.total}
                    className={`w-full py-2 rounded font-semibold text-white ${Number(cashInput) < confirmModal.total
                        ? "bg-gray-400"
                        : "bg-yellow-500"
                      }`}
                  >
                    Xác nhận đã thanh toán
                  </button>

                </div>
              )}
              {/* 🍳 CHỜ CHẾ BIẾN */}
              {confirmModal.status === "pending" && (
                <div className="grid grid-cols-2 gap-2">

                  <button
                    onClick={() => updateOrder(confirmModal, "done")}
                    className="bg-blue-600 text-white py-2 rounded font-semibold"
                  >
                    Hoàn thành
                  </button>

                  <button
                    onClick={() => updateOrder(confirmModal, "remove")}
                    className="bg-green-600 text-white py-2 rounded font-semibold"
                  >
                    Đã nhận món
                  </button>

                </div>
              )}

              {/* 🎉 CHỜ LẤY MÓN */}
              {confirmModal.status === "done" && (
                <button
                  onClick={() => updateOrder(confirmModal, "remove")}
                  className="w-full bg-green-600 text-white py-2 rounded font-semibold"
                >
                  Đã nhận món
                </button>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
} 
