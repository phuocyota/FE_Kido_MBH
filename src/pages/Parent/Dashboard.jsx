import React from "react";
import { Bell, Wallet, Utensils, BarChart3 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

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

const previewTodayOrder = {
  id: "order_001",
  status: "PREPARING",
  statusText: "Đang chuẩn bị",
  orderedAt: "2026-05-29T09:45:00+07:00",
  items: [
    {
      id: "item_001",
      name: "Cơm gà",
      quantity: 2,
      unitPrice: 15000,
      totalPrice: 30000,
    },
  ],
  addons: [
    {
      id: "addon_001",
      name: "Sữa",
      quantity: 1,
      price: 0,
    },
  ],
  totalAmount: 30000,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { homeData, loading, error } = useOutletContext();

  const walletBalance = homeData?.wallet?.balance ?? 0;
  const notifications = homeData?.notifications ?? [];
  const todayOrder = homeData?.todayOrder ?? previewTodayOrder;
  const recentHistory = homeData?.recentHistory ?? [];
  const weekStats = homeData?.statistics?.week ?? { spent: 0, limit: 0 };
  const monthStats = homeData?.statistics?.month ?? { spent: 0, limit: 0 };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Good Morning</h1>
        {loading && <p className="text-sm text-gray-500 mt-1">Đang tải dữ liệu...</p>}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1 bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80 mb-1">Số dư</p>
            <p className="text-3xl font-bold">{formatMoney(walletBalance)}</p>
          </div>
          <Wallet size={40} className="opacity-80" />
        </div>

        <div className="md:col-span-2 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-yellow-500" />
            <p className="font-semibold text-gray-800">Thông báo</p>
          </div>

          <div className="space-y-3 text-sm">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-3">
                  <span className="text-gray-700">{item.message}</span>
                  <span className="text-gray-400 shrink-0">{formatTime(item.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Chưa có thông báo</p>
            )}
          </div>
        </div>

        <div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Utensils size={18} className="text-green-600" />
            <p className="font-semibold text-gray-800">Order hôm nay của con</p>
          </div>

          {todayOrder ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {todayOrder.items?.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                  </p>
                  <p className="text-xs text-gray-400">Đặt lúc {formatTime(todayOrder.orderedAt)}</p>
                </div>

                {todayOrder.addons?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {todayOrder.addons.map((addon) => (
                      <span
                        key={addon.id}
                        className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                      >
                        + {addon.name} x{addon.quantity}
                        {addon.price > 0 ? ` - ${formatMoney(addon.price)}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {todayOrder.statusText}
                </span>
                <p className="text-sm font-semibold text-gray-800">
                  {formatMoney(todayOrder.totalAmount)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Hôm nay chưa có order</p>
          )}
        </div>

        <div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">Lịch sử gần đây</p>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="text-xs text-blue-600 cursor-pointer hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {recentHistory.length > 0 ? (
              recentHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-gray-400 text-xs">{formatTime(item.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className={item.amount < 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                      {formatMoney(item.amount)}
                    </p>
                    <p className="text-green-600 text-xs">{item.statusText}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Chưa có giao dịch</p>
            )}
          </div>
        </div>

        <div className="md:col-span-3 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-blue-600" />
            <p className="font-semibold text-gray-800">Thống kê</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Tuần này</span>
              <span className="font-medium">{formatMoney(weekStats.spent)}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${getProgress(weekStats.spent, weekStats.limit)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tháng này</span>
              <span className="font-medium">{formatMoney(monthStats.spent)}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${getProgress(monthStats.spent, monthStats.limit)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
