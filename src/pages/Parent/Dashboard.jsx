import React, { useState, useEffect, useRef } from "react";
import { Bell, Wallet, Utensils, BarChart3, X } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelParentOrder } from "../../api/parent";
import { mapParentStatus } from "../../api/parentData";

const getStatusText = (status, isFoodOrder = true) => {
  const mapped = mapParentStatus(status);
  if (!isFoodOrder) {
    const statusMap = {
      completed: "Hoàn thành",
      cancel: "Đã hủy",
      pending: "Đang xử lý",
      payment: "Chờ thanh toán",
      ready: "Đang xử lý",
    };
    return statusMap[mapped] || "Đang xử lý";
  }
  const statusMap = {
    completed: "Hoàn thành",
    ready: "Chờ lấy món",
    pending: "Chờ chế biến",
    payment: "Chờ thanh toán",
    cancel: "Đã hủy",
  };
  return statusMap[mapped] || "Chờ chế biến";
};

const getStatusColor = (status) => {
  const mapped = mapParentStatus(status);
  switch (mapped) {
    case "completed": return "bg-emerald-50 text-emerald-600 border-emerald-100/50";
    case "ready": return "bg-amber-50 text-amber-600 border-amber-100/50";
    case "payment": return "bg-indigo-50 text-indigo-600 border-indigo-100/50";
    case "cancel": return "bg-rose-50 text-rose-600 border-rose-100/50";
    default: return "bg-blue-50 text-blue-600 border-blue-100/50";
  }
};

const formatMoney = (value = 0) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

const formatTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProgress = (spent = 0, limit = 0) => {
  if (!limit) return 0;

  return Math.min(Math.round((spent / limit) * 100), 100);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { homeData, loading, error, refreshHome } = useOutletContext();
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    if (homeData && typeof refreshHome === "function") {
      refreshHome();
    }

    const interval = setInterval(() => {
      if (typeof refreshHome === "function") {
        refreshHome();
      }
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshHome]);

  const walletBalance = homeData?.wallet?.balance ?? 0;
  const notifications = homeData?.notifications ?? [];
  const todayOrder = homeData?.todayOrder ?? null;
  const recentHistory = homeData?.recentHistory ?? [];
  const weekStats = homeData?.statistics?.week ?? { spent: 0, limit: 0 };
  const monthStats = homeData?.statistics?.month ?? { spent: 0, limit: 0 };
  const advanceAmount = monthStats.limit ?? weekStats.limit ?? 0;
  const canCancelTodayOrder =
    todayOrder &&
    ![0, 5, 6, 10, 11].includes(Number(todayOrder.status)) &&
    (Date.now() - new Date(todayOrder.orderedAt || todayOrder.createdAt).getTime() <= 15 * 60 * 1000);

  const handleCancelTodayOrder = async () => {
    if (!todayOrder?.id || cancellingOrder) return;

    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn hàng này?");

    if (!confirmed) return;

    try {
      setCancellingOrder(true);
      await cancelParentOrder(todayOrder.id);
      toast.success("Đã hủy đơn hàng");
      await refreshHome?.();
    } catch (err) {
      console.error("Cancel order error:", err);
    } finally {
      setCancellingOrder(false);
    }
  };

  return (
    <div className="space-y-6 min-h-full">
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-gray-800">Good Morning</h1>
        {loading && <p className="text-sm text-gray-500 mt-1">Đang tải dữ liệu...</p>}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Wallet Card - Premium Glow & Pattern */}
        <div className={`relative md:col-span-1 p-6 rounded-3xl flex justify-between items-center text-white overflow-hidden transition-transform hover:-translate-y-1 ${
          walletBalance < 0 
            ? "bg-gradient-to-br from-rose-400 to-red-600 shadow-lg shadow-rose-500/30" 
            : "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-teal-500/30"
        }`}>
          {/* Abstract Background Pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <p className="text-sm text-white/90 mb-1 font-medium tracking-wide uppercase text-xs">
              {walletBalance < 0 ? "Tài khoản nợ" : "Số dư khả dụng"}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {formatMoney(Math.abs(walletBalance))}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">
              <p className="text-xs font-medium text-white">
                Tạm ứng: {formatMoney(advanceAmount)}
              </p>
            </div>
          </div>
          <div className="relative z-10 p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Wallet size={32} className="text-white drop-shadow-md" />
          </div>
        </div>

        {/* Notifications Card - Glassmorphism & Hover Effects */}
        <div className="md:col-span-2 bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Bell size={18} className="text-amber-600" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Thông báo</p>
          </div>

          <div className="space-y-2 text-sm">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div key={item.id} className="group flex justify-between items-center gap-4 p-3.5 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300" />
                    </div>
                    <span className="text-gray-700 font-medium line-clamp-1">{item.message}</span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium shrink-0 bg-white/80 px-2 py-1 rounded-lg">{formatTime(item.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <Bell size={32} className="opacity-20 mb-2" />
                <p>Chưa có thông báo</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Order Card - Glassmorphism */}
        <div className="md:col-span-3 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-green-100 rounded-xl">
              <Utensils size={18} className="text-green-600" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Order hôm nay của con</p>
          </div>

          {todayOrder ? (
            <div className="flex flex-col gap-4 bg-white/50 p-4 rounded-2xl border border-white">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800 text-base">
                    {todayOrder.items?.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Đặt lúc {formatTime(todayOrder.orderedAt)}</p>
                </div>
                <p className="text-lg font-bold text-green-600 whitespace-nowrap shrink-0 bg-green-50 px-3 py-1 rounded-xl">
                  {formatMoney(todayOrder.totalAmount)}
                </p>
              </div>

              {todayOrder.addons?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {todayOrder.addons.map((addon) => (
                    <span
                      key={addon.id}
                      className="rounded-lg bg-white shadow-sm border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                      + {addon.name} x{addon.quantity}
                      {addon.price > 0 ? ` - ${formatMoney(addon.price)}` : ""}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-200/60">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  mapParentStatus(todayOrder.status) === 'completed' ? 'bg-emerald-50/80 border-emerald-100/50' :
                  mapParentStatus(todayOrder.status) === 'ready' ? 'bg-amber-50/80 border-amber-100/50' :
                  mapParentStatus(todayOrder.status) === 'payment' ? 'bg-indigo-50/80 border-indigo-100/50' :
                  mapParentStatus(todayOrder.status) === 'cancel' ? 'bg-rose-50/80 border-rose-100/50' :
                  'bg-blue-50/80 border-blue-100/50'
                }`}>
                  <div className="relative flex h-2.5 w-2.5">
                    {['pending', 'ready', 'payment'].includes(mapParentStatus(todayOrder.status)) && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        mapParentStatus(todayOrder.status) === 'ready' ? 'bg-amber-400' :
                        mapParentStatus(todayOrder.status) === 'payment' ? 'bg-indigo-400' :
                        'bg-blue-400'
                      }`}></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      mapParentStatus(todayOrder.status) === 'completed' ? 'bg-emerald-500' :
                      mapParentStatus(todayOrder.status) === 'ready' ? 'bg-amber-500' :
                      mapParentStatus(todayOrder.status) === 'payment' ? 'bg-indigo-500' :
                      mapParentStatus(todayOrder.status) === 'cancel' ? 'bg-rose-500' :
                      'bg-blue-500'
                    }`}></span>
                  </div>
                  <span className={`whitespace-nowrap text-sm font-semibold ${
                      mapParentStatus(todayOrder.status) === 'completed' ? 'text-emerald-700' :
                      mapParentStatus(todayOrder.status) === 'ready' ? 'text-amber-700' :
                      mapParentStatus(todayOrder.status) === 'payment' ? 'text-indigo-700' :
                      mapParentStatus(todayOrder.status) === 'cancel' ? 'text-rose-700' :
                      'text-blue-700'
                  }`}>
                    {getStatusText(todayOrder.status, true)}
                  </span>
                </div>
                
                {canCancelTodayOrder && (
                  <button
                    type="button"
                    onClick={handleCancelTodayOrder}
                    disabled={cancellingOrder}
                    className="flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancellingOrder ? "Đang hủy..." : "Hủy đơn"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-white/40 rounded-2xl border border-dashed border-gray-300">
              <Utensils size={32} className="text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-500">Hôm nay chưa có order</p>
            </div>
          )}
        </div>

        {/* Recent History Card */}
        <div className="md:col-span-3 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold text-gray-800 text-lg">Lịch sử gần đây</p>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="text-sm font-semibold text-blue-600 cursor-pointer hover:text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full transition-colors"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2 text-sm">
            {recentHistory.length > 0 ? (
              recentHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-3 p-3.5 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 transition-all duration-300">
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-medium">{formatTime(item.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className={item.amount < 0 ? "text-rose-600 font-bold text-base" : "text-emerald-600 font-bold text-base"}>
                      {item.amount > 0 ? "+" : ""}{formatMoney(item.amount)}
                    </p>
                    <p className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status, item.type !== "TOPUP")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Chưa có giao dịch</p>
            )}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="md:col-span-3 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <BarChart3 size={18} className="text-indigo-600" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Thống kê chi tiêu</p>
          </div>

          <div className="flex flex-col gap-3 mb-2">
            <div className="bg-white/60 p-4 rounded-2xl border border-white">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Tuần này</span>
                <span className="font-bold text-gray-800">{formatMoney(weekStats.spent)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getProgress(weekStats.spent, weekStats.limit)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500 font-medium">
                <span>0đ</span>
                <span>{formatMoney(weekStats.limit)}</span>
              </div>
            </div>

            <div className="bg-white/60 p-4 rounded-2xl border border-white">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Tháng này</span>
                <span className="font-bold text-gray-800">{formatMoney(monthStats.spent)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getProgress(monthStats.spent, monthStats.limit)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500 font-medium">
                <span>0đ</span>
                <span>{formatMoney(monthStats.limit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
