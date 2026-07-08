import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const orderId = searchParams.get("orderId") || "";
  const orderInfo = searchParams.get("orderInfo") || "";
  const isTopup =
    orderId.startsWith("TOPUP-") ||
    orderInfo.toLowerCase().includes("nap tien") ||
    orderInfo.toLowerCase().includes("nạp tiền");

  const targetPath = isTopup ? "/topup" : "/";
  
  // Dynamic button labels based on transaction type and status
  let buttonText = "Trở về trang chủ";
  if (isTopup) {
    buttonText = status === "success" ? "Quay lại trang nạp tiền" : "Thử lại nạp tiền";
  }

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const momoMessage = searchParams.get("message");
    
    if (resultCode === "0") {
      setStatus("success");
      setMessage("Thanh toán thành công!");
    } else {
      setStatus("error");
      setMessage(momoMessage || "Giao dịch bị từ chối hoặc có lỗi xảy ra");
    }
  }, [searchParams]);

  // Automatic redirect countdown on success
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(targetPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate, targetPath]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
        {status === "success" ? (
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
        )}
        
        <h2 className={`mt-4 text-xl font-bold ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {status === "success" ? "Giao dịch thành công" : "Giao dịch thất bại"}
        </h2>
        
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        {status === "success" && (
          <p className="mt-3 text-xs text-gray-400">
            Tự động chuyển hướng sau {countdown} giây...
          </p>
        )}
        
        <button
          type="button"
          onClick={() => navigate(targetPath)}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
