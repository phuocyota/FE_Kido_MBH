import React, { useEffect, useState, useRef } from "react";
import CashOrders from "../../components/Staff/CashOrders";
import PendingOrders from "../../components/Staff/PendingOrders";
import DoneOrders from "../../components/Staff/DoneOrders";
import bgCantin from "../../assets/anh-can-tin-so-2.png";
import { getActiveKitchenOrders, getReadyToPickupOrders, updateOrderToReadyToPickup, updateOrderToDone, receiveCashPayment } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Order/Header";
 


export default function Kitchen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [cashInput, setCashInput] = React.useState("");
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [loadError, setLoadError] = useState("");

  const bufferRef = useRef("");
  const ordersRef = useRef([]);


const fullName =
  localStorage.getItem("fullName") || "Nhân viên";

const avatar =
  localStorage.getItem("avatar") ||
  "https://i.pravatar.cc/150";
  // đăng xuất 
  const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};

 


useEffect(() => {

  const token =
    localStorage.getItem("accessToken");

  if (!token) {
    navigate("/login");
    return;
  }

}, [navigate]);

 

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // ================= LOAD DATA =================
  useEffect(() => {
    let isMounted = true;

    const loadInitialOrders = async () => {
      try {
        const [activeData, readyPickupData] = await Promise.all([
          getActiveKitchenOrders(),
          getReadyToPickupOrders(),
        ]);

        if (isMounted) {
          setOrders([...activeData, ...readyPickupData]);
          setLoadError("");
        }
      } catch (error) {
        console.error("Khong tai duoc danh sach order kitchen", error);

        if (isMounted) {
          setLoadError(error?.message || "Khong tai duoc danh sach don hang");
        }
      }
    };

    const refreshActiveOrders = async () => {
      try {
        const [activeData, readyPickupData] = await Promise.all([
          getActiveKitchenOrders(),
          getReadyToPickupOrders(),
        ]);

        if (isMounted) {
          setOrders([...activeData, ...readyPickupData]);
          setLoadError("");
        }
      } catch (error) {
        console.error("Khong tai duoc danh sach order kitchen", error);

        if (isMounted) {
          setLoadError(error?.message || "Khong tai duoc danh sach don hang");
        }
      }
    };

    loadInitialOrders();

    const interval = setInterval(refreshActiveOrders, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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


    // tìm đơn theo studentId
    const foundOrder = ordersRef.current.find(
      o =>
        String(o.studentId) === String(cardId) &&
        o.status !== "cancelled"
    );

    if (foundOrder) {
      setConfirmModal(foundOrder);
    } else {
      alert("❌ Sai thẻ học sinh hoặc không có đơn");
    }
  };

  // ================= UPDATE ORDER =================
  const updateOrder = async (order, action, extra = {}) => {
    let updated = [];

    try {
      if (action === "pending") {
        // Thanh toán tiền mặt - gọi API receive-cash
        if (order.status === "cash") {
          await receiveCashPayment(order.orderKey);
        }
        updated = orders.map(o =>
          o.orderKey === order.orderKey
            ? { ...o, status: "pending" }
            : o
        );
      }

      else if (action === "done") {
        // Gọi API để chuyển sang READY_TO_PICKUP
        await updateOrderToReadyToPickup(order.orderKey);
        updated = orders.map(o =>
          o.orderKey === order.orderKey
            ? { ...o, status: "done" }
            : o
        );
      }

      else if (action === "remove") {
        // Gọi API để chuyển sang DONE
        await updateOrderToDone(order.orderKey);
        updated = orders.filter(o => o.orderKey !== order.orderKey);
      }

      else if (action === "cancel") {
        updated = orders.map(o =>
          o.orderKey === order.orderKey
            ? {
              ...o,
              status: "cancelled",
              isRefunded: true,
              cancelReason: extra.reason || "Không có lý do"
            }
            : o
        );
      }

      setOrders(updated);
      setConfirmModal(null);
    } catch (error) {
      console.error(`Lỗi cập nhật đơn hàng (${action}):`, error);
      alert(`❌ Lỗi cập nhật trạng thái: ${error?.message || "Thử lại"}`);
    }
  };

  return (
    <div
  className="h-screen flex flex-col bg-cover bg-center"
  style={{ backgroundImage: `url(${bgCantin})` }}
>
<Header
  student={{
    fullName,
    avatar,
  }}
  onLogout={handleLogout}
/>

      {/* 3 CỘT */}
      {loadError && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow">
          {loadError}
        </div>
      )}

      <div className="flex flex-1"> 

      <CashOrders
        orders={orders.filter(o => o.status === "cash")}
        onSelect={setConfirmModal}
        onPaid={(order) => updateOrder(order, "pending")}
      />
      <PendingOrders
        orders={orders.filter(o => o.status === "pending")}
        onSelect={setConfirmModal}
        onDone={(order) => updateOrder(order, "done")}
      />

      {/* <DoneOrders
        orders={orders.filter(o => o.status === "done")}
        onSelect={setConfirmModal}
      /> */}
      <DoneOrders
        orders={orders.filter(o => o.status === "done")}
        onPickup={(order) => updateOrder(order, "remove")}
        onSelect={setConfirmModal}
      />
      </div>

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

              {(confirmModal.status === "cash" || confirmModal.status === "pending") &&
                Date.now() - confirmModal.createdAt <= 15 * 60 * 1000 && (
                  <button
                    onClick={() => {
                      if (confirmModal.status === "pending") {
                        setCancelModal(confirmModal);
                      }
                      else if (confirmModal.status === "cash") {
                        setCancelModal(confirmModal);
                      }
                      else {
                        handleCancel(confirmModal);
                      }
                    }}
                    className="bg-red-300 text-white py-2 rounded font-semibold"
                  >
                    ❌ Hủy đơn
                  </button>
                )}

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
                    {[10000, 20000, 30000, 40000, 50000, "full"].map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          if (v === "full") {
                            setCashInput(confirmModal.total); // 💥 nhận đủ
                          } else {
                            setCashInput(v);
                          }
                        }}
                        className="bg-gray-100 py-2 rounded text-sm hover:bg-gray-200"
                      >
                        {v === "full" ? "Nhận đủ" : `${v.toLocaleString()}đ`}
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

      {/* ================= HỦY ĐƠN MODAL ================= */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-5 w-[380px] relative">

            {/* ❌ NÚT X */}
            <button
              onClick={() => {
                setCancelModal(null);
                setCancelReason("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg"
            >
              ✖
            </button>

            <h2 className="text-lg font-bold mb-3">
              Lý do hủy đơn
            </h2>

            {/* INPUT */}
            <textarea
              placeholder="Nhập lý do..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            {/* GỢI Ý */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                "Hết món",
                "Nhập sai đơn",
                "Khách không lấy",
                "Lỗi hệ thống"
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className="bg-gray-100 py-2 rounded text-sm hover:bg-gray-200"
                >
                  {reason}
                </button>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCancelModal(null);
                  setCancelReason("");
                }}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Đóng
              </button>

              <button
                onClick={() => {
                  updateOrder(cancelModal, "cancel", {
                    reason: cancelReason

                  });

                  setCancelModal(null);
                  setCancelReason("");
                }}

                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Xác nhận hủy
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
} 
