import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import momo from "../../assets/momo.jpg";
import vnpay from "../../assets/vnpay.png";
import vietqr from "../../assets/vietqr.webp";

import AdvanceAmountModal from "../../components/Topup/AdvanceAmountModal";
import { Wallet } from "lucide-react";
import { updateCustomerAdvanceAmount } from "../../api/parent";

export default function Topup() {
  const { homeData, refreshHome } = useOutletContext() || {};
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("momo");
  const [advanceAmount, setAdvanceAmount] = useState(50000);
  const [savingAdvance, setSavingAdvance] = useState(false);

const [openAdvanceModal, setOpenAdvanceModal] = useState(false);
  const quickAmounts = [10000, 20000, 50000, 100000];
  const customerId = homeData?.user?.id;

  useEffect(() => {
    const currentLimit =
      homeData?.statistics?.month?.limit ?? homeData?.statistics?.week?.limit;

    if (currentLimit !== undefined && currentLimit !== null) {
      setAdvanceAmount(Number(currentLimit));
    }
  }, [homeData]);

  const handleSaveAdvanceAmount = async (nextAmount) => {
    if (!customerId) {
      toast.error("Khong tim thay thong tin hoc sinh");
      return;
    }

    try {
      setSavingAdvance(true);
      await updateCustomerAdvanceAmount(customerId, nextAmount);
      setAdvanceAmount(nextAmount);
      await refreshHome?.();
      toast.success("Da cap nhat muc tam ung");
      setOpenAdvanceModal(false);
    } catch (err) {
      console.error("Update advance amount error:", err);
      toast.error(err.message || "Khong cap nhat duoc muc tam ung");
    } finally {
      setSavingAdvance(false);
    }
  };

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

  return (
    <div className="p-5 space-y-5">

      {/* HEADER */}
      <h1 className="text-xl font-bold">💰 Nạp tiền</h1>

      
      {/* ADVANCE BALANCE */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg text-white sm:p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="flex items-start gap-4 flex-1">

            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-16 sm:w-16">
              <Wallet size={30} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-sm text-blue-100 sm:text-base">
                Mức tạm ứng số dư mong muốn
              </p>

              <h2 className="mt-1 break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
                {advanceAmount.toLocaleString()}đ
              </h2>

              <p className="mt-2 text-xs leading-5 text-blue-100 sm:text-sm">
                Nhà trường sẽ tự động trừ dần vào các khoản ăn uống,
                bán trú và các dịch vụ phát sinh của học sinh.
              </p>

            </div>

          </div>

          {/* Right */}
          <div className="w-full lg:w-auto">

            <button
              onClick={() => setOpenAdvanceModal(true)}
              className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-blue-600 shadow transition hover:bg-blue-50 active:scale-95 lg:w-auto"
            >
              Thiết lập
            </button>

          </div>

        </div>
      </div>

      {/* INPUT AMOUNT */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-3">
        <p className="font-semibold text-gray-700">
          Nhập số tiền cần nạp vào ví
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Nhập số tiền..."
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* QUICK SELECT */}
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-2 rounded-full text-sm border border-gray-300 ${
                amount === a
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {a.toLocaleString()}đ
            </button>
          ))}
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-3">
        <p className="font-semibold text-gray-700">
          Chọn phương thức thanh toán
        </p>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
              method === m.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* ICON */}
              <img
  src={m.img}
  alt={m.name}
  className="w-10 h-10 object-contain"
/>

              <span className="text-gray-800 font-medium">
                {m.name}
              </span>
            </div>

            {/* CHECK */}
            {method === m.id && (
              <span className="text-blue-500 font-bold">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        disabled={amount <= 0}
        className={`w-full py-3 rounded-2xl font-semibold text-white transition ${
          amount > 0
            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
            : "bg-gray-300"
        }`}
      >
        Nạp {amount.toLocaleString()}đ
      </button>

      <AdvanceAmountModal
  open={openAdvanceModal}
  value={advanceAmount}
  saving={savingAdvance}
  onClose={() => {
    if (!savingAdvance) {
      setOpenAdvanceModal(false);
    }
  }}
  onSave={handleSaveAdvanceAmount}
/>

    </div>
  );
}

