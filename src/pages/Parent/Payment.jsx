import React, { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import momo from "../../assets/momo.jpg";
import vnpay from "../../assets/vnpay.png";
import vietqr from "../../assets/vietqr.webp";

const CHECKOUT_KEY = "parentOrderCheckout";

const methods = [
  {
    id: "momo",
    name: "Thanh toán qua MoMo",
    img: momo,
  },
  {
    id: "vnpay",
    name: "Thanh toán qua VNPay",
    img: vnpay,
  },
  {
    id: "vietqr",
    name: "Thanh toán qua VietQR",
    img: vietqr,
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

const writeJsonStorage = (storage, key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

const getNextOrderNumber = () => {
  const current = Number(localStorage.getItem("orderNumber") || 0) + 1;
  localStorage.setItem("orderNumber", String(current));
  return current;
};

const formatMoney = (value = 0) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function Payment() {
  const navigate = useNavigate();
  const { refreshHome } = useOutletContext() || {};
  const [checkout] = useState(() =>
    readJsonStorage(sessionStorage, CHECKOUT_KEY)
  );
  const [method, setMethod] = useState("momo");
  const [pickupType, setPickupType] = useState("Lấy liền");
  const [successOrder, setSuccessOrder] = useState(null);

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

  const handleConfirmPayment = () => {
    if (!student || items.length === 0) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      navigate("/order");
      return;
    }

    const orderNumber = getNextOrderNumber();
    const createdAt = Date.now();
    const oldOrders = readJsonStorage(localStorage, "orders", []);

    const newOrder = {
      orderKey: `${createdAt}-${orderNumber}`,
      id: orderNumber,
      items,
      total,
      studentId: String(student.cardId || student.id),
      studentName: student.name,
      status: "pending",
      paymentMethod: selectedMethod.id,
      paymentMethodName: selectedMethod.name,
      isRefunded: false,
      pickupType,
      createdAt,
    };

    writeJsonStorage(localStorage, "orders", [...oldOrders, newOrder]);
    sessionStorage.removeItem(CHECKOUT_KEY);

    if (typeof refreshHome === "function") {
      refreshHome();
    }

    setSuccessOrder(orderNumber);
    toast.success("Thanh toán thành công");
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
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 font-semibold text-white transition hover:from-blue-600 hover:to-indigo-600 active:scale-[0.99]"
            >
              Thanh toán bằng {selectedMethod.name.replace("Thanh toán qua ", "")}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {successOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-green-600">
              Thanh toán thành công
            </h2>
            <p className="mt-2 text-sm text-gray-600">Số thứ tự của đơn</p>
            <p className="mt-3 text-4xl font-bold text-indigo-600">
              #{successOrder}
            </p>
            <button
              type="button"
              onClick={() => navigate("/order")}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
