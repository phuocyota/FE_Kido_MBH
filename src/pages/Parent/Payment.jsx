import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check, ChevronRight, Wallet } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import momo from "../../assets/momo.jpg";
import vnpay from "../../assets/vnpay.png";
import { addMyCartItem, clearMyCart, completeMyCart } from "../../api/cart";
import { createMomoPayment } from "../../api/momo";

const CHECKOUT_KEY = "parentOrderCheckout";

const methods = [
  {
    id: "WALLET",
    name: "Thanh toán bằng ví/tạm ứng",
    img: momo, // TODO: Update this icon if it's for internal wallet
  },
  {
    id: "CASH",
    name: "Trả tiền mặt tại căn tin",
    img: vnpay, // TODO: Update this icon
  },
  {
    id: "MOMO",
    name: "Thanh toán qua MoMo",
    img: momo,
  },
];

const pickupTypes = ["Lấy liền", "Ra chơi lấy", "Ra về lấy"];

const readJsonStorage = (storage, key, fallback = null) => {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const formatMoney = (value = 0) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const getOrderType = (pickupType) =>
  pickupType === "Ra chơi lấy" ? "PRE_ORDER" : "TAKEAWAY";

export default function Payment() {
  const navigate = useNavigate();
  const { refreshHome } = useOutletContext() || {};
  const [checkout] = useState(() =>
    readJsonStorage(sessionStorage, CHECKOUT_KEY)
  );
  const [method, setMethod] = useState("WALLET");
  const [pickupType, setPickupType] = useState("Lấy liền");
  const [successOrder, setSuccessOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  const clearCartPromise = useRef(null);

  useEffect(() => {
    // Kích hoạt xóa giỏ hàng cũ chạy ngầm ngay khi mở màn hình thanh toán
    clearCartPromise.current = clearMyCart().catch((err) => {
      console.error("Pre-clear cart error:", err);
    });
  }, []);

  const selectedMethod = useMemo(
    () => methods.find((item) => item.id === method) || methods[0],
    [method]
  );

  const items = checkout?.items || [];
  const total =
    checkout?.total ??
    items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);
  const student = checkout?.student;

  const handleConfirmPayment = async () => {
    if (!student || items.length === 0) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      navigate("/order");
      return;
    }

    if (paying) return;

    try {
      setPaying(true);
      
      // Chờ tiến trình xóa giỏ hàng chạy trước đó hoàn tất
      if (clearCartPromise.current) {
        await clearCartPromise.current;
      } else {
        await clearMyCart();
      }

      // Thêm tất cả các món trong giỏ hàng song song (Parallel)
      await Promise.all(
        items.map((item) =>
          addMyCartItem({
            productId: item.id,
            quantity: item.qty,
            note: item.note || undefined,
          })
        )
      );

      const result = await completeMyCart({
        branchId: checkout?.branchId || student.branchId,
        paymentMethod: selectedMethod.id,
        orderType: getOrderType(pickupType),
        note: pickupType,
      });

      const orderId = result?.order?.orderCode || result?.order?.id;

      if (selectedMethod.id === "MOMO") {
        const res = await createMomoPayment(result.order.id);
        if (res?.payUrl) {
          window.location.href = res.payUrl;
          return;
        } else {
          throw new Error("Không lấy được đường dẫn thanh toán MoMo");
        }
      }

      sessionStorage.removeItem(CHECKOUT_KEY);

      if (typeof refreshHome === "function") {
        await refreshHome();
      }

      setSuccessOrder(orderId || "OK");
      toast.success(
        selectedMethod.id === "CASH"
          ? "Đã tạo đơn, vui lòng thanh toán tại căn tin"
          : "Thanh toán thành công"
      );
    } catch (error) {
      console.error("Complete cart error:", error);
      toast.error(error.message || "Không thanh toán được đơn hàng");
    } finally {
      setPaying(false);
    }
  };

  if (!checkout || items.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-100 -m-4 p-4 md:-m-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow">
          <h1 className="text-lg font-bold text-gray-800">
            Chưa có đơn cần thanh toán
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng quay lại đặt món và chọn sản phẩm trước.
          </p>
          <button
            type="button"
            onClick={() => navigate("/order")}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Quay lại đặt món
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100 -m-4 p-4 md:-m-6 md:p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/order")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
            Thanh toán đơn hàng
          </h1>

          <div className="h-10 w-10" />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white shadow-lg">
          <p className="text-sm opacity-80">Tổng thanh toán</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-3xl font-bold">{formatMoney(total)}</p>
            <p className="text-sm opacity-90">
              {totalQuantity} món cho {student?.name || "học sinh"}
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow">
              <p className="font-semibold text-gray-700">Chi tiết món</p>

              <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatMoney(item.price)} x {item.qty}
                      </p>
                      {item.note && (
                        <p className="mt-1 line-clamp-2 text-xs italic text-orange-500">
                          Ghi chú: {item.note}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 font-semibold text-gray-800">
                      {formatMoney(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <p className="font-semibold text-gray-700">Hình thức nhận món</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                {pickupTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPickupType(type)}
                    className={`rounded-xl border px-3 py-2 font-medium transition ${
                      pickupType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="font-semibold text-gray-700">
              Chọn phương thức thanh toán
            </p>

            <div className="mt-4 space-y-3">
              {methods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    method === item.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-contain"
                    />

                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>

                  {method === item.id && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check size={15} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-800">
                <span>Cần thanh toán</span>
                <span className="text-blue-600">{formatMoney(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={paying}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 font-semibold text-white transition hover:from-blue-600 hover:to-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {paying ? "Đang xử lý..." : `Thanh toán bằng ${selectedMethod.name.replace("Thanh toán bằng ", "")}`}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {successOrder && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Wallet size={28} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-green-600">
              Thanh toán thành công
            </h2>
            <p className="mt-2 text-sm text-gray-600">Mã đơn</p>
            <p className="mt-3 break-words text-2xl font-bold text-indigo-600">
              {successOrder}
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
