import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardingOrderAdmin from "../../components/BoardingOrder/BoardingOrderAdmin";
import { decodeBoardingDemoToken, getBoardingDemoToken } from "../../api/boardingDemoSession";

export default function BoardingOrderDemo() {
  const token = getBoardingDemoToken();
  const payload = token ? decodeBoardingDemoToken(token) : null;
  const [now, setNow] = useState(() => Date.now());
  const expiry = payload?.exp ? payload.exp * 1000 : 0;
  useEffect(() => {
    if (!expiry || expiry <= now) return;
    const timer = setTimeout(() => setNow(Date.now()), Math.min(expiry - now, 2147483647));
    return () => clearTimeout(timer);
  }, [expiry, now]);
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : null;
  const isReady = Boolean(payload?.branchId && expiry > now);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Demo quản lý bán trú</h1>
            {isReady ? (
              <>
                <p className="mt-1 text-sm text-slate-700">
                  {payload.branchName} · {payload.email} · {payload.userType}
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  Đang dùng API thật. Các thao tác lưu, sửa, xóa sẽ cập nhật dữ liệu của chi nhánh này.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Token hết hạn: {expiresAt.toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" })} (GMT+7)
                </p>
              </>
            ) : (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {!token
                  ? "Chưa có token demo. Cấu hình VITE_BOARDING_DEMO_TOKEN trong .env.local và khởi động lại Vite."
                  : "Token demo không hợp lệ hoặc đã hết hạn. Cập nhật VITE_BOARDING_DEMO_TOKEN trong .env.local và khởi động lại Vite."}
              </p>
            )}
          </div>
          <Link to="/boarding-orders" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Về trang bán trú
          </Link>
        </div>
      </div>
      {isReady && <BoardingOrderAdmin />}
    </main>
  );
}
