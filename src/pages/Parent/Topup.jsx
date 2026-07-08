import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import momo from "../../assets/momo.jpg";

import AdvanceAmountModal from "../../components/Topup/AdvanceAmountModal";
import { Wallet } from "lucide-react";
import { updateCustomerAdvanceAmount } from "../../api/parent";
import { createMomoTopup } from "../../api/momo";

export default function Topup() {
  const { homeData, refreshHome } = useOutletContext() || {};
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("momo");
  const [advanceAmount, setAdvanceAmount] = useState(50000);
  const [savingAdvance, setSavingAdvance] = useState(false);
  const [paying, setPaying] = useState(false);

  const [openAdvanceModal, setOpenAdvanceModal] = useState(false);
  const quickAmounts = [10000, 20000, 50000, 100000];
  const customerId = homeData?.user?.id;
  const walletBalance = homeData?.wallet?.balance ?? 0;

  useEffect(() => {
    const currentLimit =
      homeData?.statistics?.month?.limit ?? homeData?.statistics?.week?.limit;

    if (currentLimit !== undefined && currentLimit !== null) {
      setAdvanceAmount(Number(currentLimit));
    }
  }, [homeData]);

  // Tự động cập nhật lại số dư ví khi người dùng quay lại tab ứng dụng
  useEffect(() => {
    const handleFocus = () => {
      refreshHome?.();
    };

    window.addEventListener("focus", handleFocus);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshHome?.();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshHome]);

  // Lắng nghe postMessage từ cửa sổ thanh toán MoMo (tab mới) để cập nhật và thông báo
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "MOMO_PAYMENT_SUCCESS") {
        setAmount(0); // Reset số tiền về 0 sau khi nạp thành công
        refreshHome?.();
        toast.success("Nạp tiền thành công! 🎉");
      } else if (event.data?.type === "MOMO_PAYMENT_FAILED") {
        toast.error(event.data?.message || "Thanh toán thất bại");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [refreshHome]);

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
    }
  ];

  const handleTopup = async () => {
    if (amount <= 0 || !customerId) return;
    
    if (method === "momo") {
      try {
        setPaying(true);
        const res = await createMomoTopup(customerId, amount);
        if (res?.payUrl) {
          const isZalo = /Zalo/i.test(navigator.userAgent);
          if (isZalo) {
            const link = document.createElement("a");
            link.href = res.payUrl;
            link.target = "_parent"; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            window.location.href = res.payUrl;
          }
        } else {
          toast.error("Không tạo được link thanh toán MoMo");
        }
      } catch (err) {
        console.error("Topup error:", err);
        toast.error(err.message || "Lỗi khi tạo yêu cầu nạp tiền");
      } finally {
        setPaying(false);
      }
    }
  };

  return (
    <div className="space-y-5 pb-8">

      {/* HEADER */}
      <h1 className="text-xl font-bold">💰 Nạp tiền</h1>

      {/* DEBT ALERT */}
      {walletBalance < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium">Tài khoản đang nợ</p>
            <p className="text-red-700 text-xl font-bold">{Math.abs(walletBalance).toLocaleString()}đ</p>
          </div>
          <button
            onClick={() => setAmount(Math.abs(walletBalance))}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition shadow-sm"
          >
            Nạp trả nợ
          </button>
        </div>
      )}

      
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
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-4">
        <p className="font-semibold text-gray-800 text-lg">
          Nhập số tiền cần nạp vào ví
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Nhập số tiền..."
          className="w-full bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 text-lg outline-none focus:ring-2 focus:ring-blue-400/50 shadow-inner transition-all"
        />

        {/* QUICK SELECT */}
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${
                amount === a
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
                  : "bg-white/50 text-gray-700 border-white/60 hover:bg-white/80 shadow-sm"
              }`}
            >
              {a.toLocaleString()}đ
            </button>
          ))}
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-4">
        <p className="font-semibold text-gray-800 text-lg">
          Chọn phương thức thanh toán
        </p>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              method === m.id
                ? "border-blue-400 bg-blue-50/80 shadow-sm"
                : "border-white/60 bg-white/50 hover:bg-white/80"
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
      {/* SUMMARY */}
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="font-semibold text-gray-700">Số tiền cần trả:</span>
        <span className="text-3xl font-bold text-blue-600 drop-shadow-sm">
          {amount.toLocaleString()}đ
        </span>
      </div>

      {/* BUTTON */}
      <button
        disabled={amount <= 0 || paying}
        onClick={handleTopup}
        className={`w-full py-4 rounded-3xl font-bold text-white transition-all text-lg shadow-lg ${
          amount > 0 && !paying
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-95"
            : "bg-gray-300 cursor-not-allowed opacity-70 shadow-none"
        }`}
      >
        {paying ? "Đang xử lý..." : `Nạp ${amount.toLocaleString()}đ`}
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

