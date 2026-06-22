import React, { useEffect, useMemo, useState } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { dashboardApi } from "../../api/dashboardApi";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

const formatRelativeTime = (value) => {
  if (!value) return "";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
};

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getRecentActivities({ limit: 10 });
        if (active) {
          setActivities(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setActivities([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadActivities();
    const interval = setInterval(loadActivities, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const data = useMemo(
    () =>
      activities.map((item) => ({
        type: item.type,
        user: item.actor || "Hệ thống",
        text: item.type === "import" ? "vừa nhập hàng" : "vừa bán đơn hàng",
        amount: formatMoney(item.amount),
        time: formatRelativeTime(item.createdAt),
      })),
    [activities]
  );

  return (
    <div className="h-[508px] bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 w-full max-w-[360px] mx-0 flex flex-col">
      <div className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">
        CÁC HOẠT ĐỘNG GẦN ĐÂY
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
        <div className="relative pl-5 sm:pl-8">
          <div className="absolute left-[11px] sm:left-[16px] top-0 bottom-0 w-[2px] bg-gray-200" />

          {loading && (
            <div className="py-6 text-center text-sm text-gray-400">
              Đang tải dữ liệu...
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-400">
              Chưa có hoạt động gần đây
            </div>
          )}

          {!loading &&
            data.map((item, index) => (
              <div key={`${item.type}-${index}`} className="relative mb-4 sm:mb-5 last:mb-0">
                <div
                  className={`absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-white ${
                    item.type === "sale" ? "bg-blue-500" : "bg-pink-500"
                  }`}
                >
                  {item.type === "sale" ? <FileText size={12} /> : <RotateCcw size={12} />}
                </div>

                <div className="ml-8 sm:ml-12">
                  <div className="text-xs sm:text-sm leading-5">
                    <span className="text-blue-600 font-medium">{item.user}</span>{" "}
                    <span className="text-gray-600">{item.text}</span>
                  </div>

                  <div className="text-sm sm:text-base font-semibold text-gray-800">
                    {item.amount}
                  </div>

                  <div className="text-[11px] sm:text-xs text-gray-400 italic mt-0.5">
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
