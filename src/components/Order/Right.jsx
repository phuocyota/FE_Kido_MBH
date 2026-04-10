import React from "react";
import { useNavigate } from "react-router-dom";
import bgConfirm from "../../assets/bgr_formXacNhanThanhToan.jpg";

export default function Right({
  cart,
  setCart,
  total,

  student,

  noteModal,
  setNoteModal,
  noteValue,
  setNoteValue,

  handlePayment,
  confirmModal,
  setConfirmModal,
  handleConfirmPayment,
  successModal,
  setSuccessModal,
  pickupType,
  setPickupType,
  paymentMethod,
  setPaymentMethod,
}) {

  const navigate = useNavigate();  

  return (
    <div className="w-[40%] bg-white rounded-xl m-3 shadow flex flex-col p-4">

      <h2 className="font-semibold mb-3">🛒 Giỏ hàng</h2>

      {/* LIST */}
      <div className="flex-1 overflow-auto space-y-3">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Chưa có món
          </p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="border border-gray-300 p-3 rounded-xl">

              {/* HEADER */}
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-blue-600 text-sm font-semibold">
                    {item.price.toLocaleString()}đ
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCart(cart.filter((p) => p.id !== item.id))
                  }
                  className="text-red-500 cursor-pointer"
                >
                  ✖
                </button>
              </div>

              {/* NOTE + QTY */}
              <div className="flex justify-between mt-2">

                {/* NOTE */}
                <div className="flex items-center gap-2">
                  <p className="text-xs italic">
                    {item.note || "Chưa có ghi chú"}
                  </p>

                  <button
                    onClick={() => {
                      setNoteModal(item);
                      setNoteValue(item.note || "");
                    }}
                    className="cursor-pointer"
                  >
                    📝
                  </button>
                </div>

                {/* QTY */}
                <div className="flex gap-2 ">
                  <button
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((p) =>
                          p.id === item.id
                            ? { ...p, qty: Math.max(1, p.qty - 1) }
                            : p
                        )
                      )
                    }
                        className="cursor-pointer"
                  >
                    -
                  </button>

                  {item.qty}

                  <button
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((p) =>
                          p.id === item.id
                            ? { ...p, qty: p.qty + 1 }
                            : p
                        )
                      )
                    }
                        className="cursor-pointer"
                  >
                    +
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}
      <div className="border-t border-gray-400 pt-3">
        <div className="flex justify-between font-bold">
          <span>Tổng:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-3 bg-blue-600 text-white py-3 rounded-xl cursor-pointer"
        >
          Thanh toán
        </button>
      </div>

      {noteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[350px]">
            <h2 className="font-semibold mb-3">Nhập ghi chú</h2>

            <textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 h-24 outline-none"
              placeholder="Ví dụ: ít đá, không đường..."
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setNoteModal(null)}
                className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
              >
                Hủy
              </button>

              <button
                onClick={() => {
                  setCart((prev) =>
                    prev.map((p) =>
                      p.id === noteModal.id
                        ? { ...p, note: noteValue }
                        : p
                    )
                  );

                  setNoteModal(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[350px] text-center">

            <h2 className="text-xl font-bold text-green-600 mb-2">
              🎉 Thanh toán thành công
            </h2>
            {/* 👉 THÊM TÊN HỌC SINH */}
      <p className="text-gray-700 font-medium mb-2">
        Học sinh: {student?.name || "Không xác định"}
      </p>

            <p className="text-gray-600 mb-4">
              Số thứ tự của bạn
            </p>

            <div className="text-4xl font-bold text-blue-600 mb-6">
              #{successModal}
            </div>

            <button
              onClick={() => {
                setSuccessModal(null);
                navigate("/");
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* confirm modal */}
     {confirmModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div
      className="rounded-2xl w-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgConfirm})` }}
    >

      {/* lớp phủ */}
    <div className=" rounded-2xl p-6">

        <h2 className="text-lg font-bold mb-3">
          🧾 Xác nhận đơn hàng
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          👤 Học sinh: <span className="font-semibold">{student?.name}</span>
        </p>

        {/* LIST */}
        <div className="max-h-60 overflow-auto space-y-2 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="text-sm pb-1">

              <div className="flex justify-between">
                <span>{item.name} x{item.qty}</span>
                <span>{(item.price * item.qty).toLocaleString()}đ</span>
              </div>

              {item.note && (
                <div className="text-xs text-orange-500 italic mt-1">
                  📝 {item.note}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-bold mb-4 border-t border-gray-300 pt-3">
          <span>Tổng:</span>
          <span className="text-blue-600">
            {total.toLocaleString()}đ
          </span>
        </div>

        {/* PICKUP */}
        <div className="mb-4">
          <p className="font-semibold mb-2">📦 Hình thức nhận</p>

          <div className="flex gap-2 flex-wrap text-sm">
            {["Lấy liền", "Ra chơi lấy", "Ra về lấy"].map((type) => (
              <button
                key={type}
                onClick={() => setPickupType(type)}
                className={`px-3 py-1 rounded-lg border border-gray-300 ${
                  pickupType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="mb-4">
          <p className="font-semibold mb-2">💳 Thanh toán</p>

          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`px-3 py-1 rounded-lg border border-gray-300 text-sm ${
                paymentMethod === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Quẹt thẻ
            </button>

            <button
              onClick={() => setPaymentMethod("cash")}
              className={`px-3 py-1 rounded-lg border border-gray-300 text-sm ${
                paymentMethod === "cash"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Tiền mặt
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmModal(false)}
            className="flex-1 bg-gray-200 py-2 rounded text-sm"
          >
            Hủy
          </button>

          <button
            onClick={handleConfirmPayment}
            className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
          >
            Xác nhận
          </button>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}