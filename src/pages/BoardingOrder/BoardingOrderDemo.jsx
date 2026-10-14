import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardingOrderAdmin from "../../components/BoardingOrder/BoardingOrderAdmin";
import { decodeBoardingDemoToken, getBoardingDemoToken, saveBoardingDemoToken } from "../../api/boardingDemoSession";

export default function BoardingOrderDemo() {
  const [token, setToken] = useState(getBoardingDemoToken);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
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

  const activateToken = (event) => {
    event.preventDefault();
    const nextToken = tokenInput.trim();
    const nextPayload = decodeBoardingDemoToken(nextToken);
    const currentTime = Date.now();
    if (!nextPayload?.branchId || !nextPayload?.exp || nextPayload.exp * 1000 <= currentTime) {
      setTokenError("Token không hợp lệ hoặc đã hết hạn. Vui lòng nhập token khác.");
      return;
    }
    saveBoardingDemoToken(nextToken);
    setNow(currentTime);
    setToken(nextToken);
    setTokenInput("");
    setTokenError("");
  };

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
                  ? "Nhập token để mở trang demo bán trú, không cần đăng nhập qua màn đăng nhập."
                  : "Token demo không hợp lệ hoặc đã hết hạn. Vui lòng nhập token mới bên dưới."}
              </p>
            )}
          </div>
          <Link to="/boarding-orders" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Về trang bán trú
          </Link>
        </div>
      </div>
      {!isReady && (
        <form onSubmit={activateToken} className="mx-auto mt-8 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="boarding-demo-token" className="block text-sm font-medium text-slate-700">Token demo</label>
          <input
            id="boarding-demo-token"
            type="password"
            autoComplete="off"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Dán token bạn muốn sử dụng"
          />
          <p className="mt-2 text-sm text-slate-500">Token chỉ lưu trong phiên tab hiện tại. Trang demo sử dụng dữ liệu thật của chi nhánh trong token.</p>
          {tokenError && <p role="alert" className="mt-2 text-sm text-red-700">{tokenError}</p>}
          <button type="submit" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Mở demo bán trú</button>
        </form>
      )}
      {isReady && <BoardingOrderAdmin />}
    </main>
  );
}
