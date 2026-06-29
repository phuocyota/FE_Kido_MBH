import React, { useEffect, useState } from "react";
import { BarChart3, Wallet, Utensils, Clock } from "lucide-react";
import { mockOrders } from "../../datas/mockOrders";

import bang from "../../assets/bang.png";
import vuot from "../../assets/vuot.png";
import tietkiem from "../../assets/tietkiem.png";

export default function Stats() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("week");
  const [compareType, setCompareType] = useState("");
  
  
  const [start1, setStart1] = useState("");
const [end1, setEnd1] = useState("");

const [start2, setStart2] = useState("");
const [end2, setEnd2] = useState("");


  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    setOrders(mockOrders);
  }, []);
  const now = new Date();

  // =========================
  // 📅 FILTER LOGIC
  // =========================
  const filteredOrders = orders.filter((o) => {
    const d = new Date(o.date);

    // HÔM NAY
    if (filter === "today") {
      return d.toDateString() === now.toDateString();
    }

    // 7 NGÀY
    if (filter === "7days") {
      const start = new Date();
      start.setDate(now.getDate() - 7);
      return d >= start;
    }

    // 30 NGÀY
    if (filter === "30days") {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      return d >= start;
    }

    // TUẦN CHUẨN (T2 → CN)
    if (filter === "week") {
      const day = now.getDay(); // CN=0
      const diff = day === 0 ? 6 : day - 1;

      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      return d >= start && d <= end;
    }

    // THÁNG
    if (filter === "month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // =========================
  // 📊 TÍNH TOÁN
  // =========================
  const totalMoney = filteredOrders.reduce(
    (sum, o) => sum + o.price * o.quantity,
    0
  );

  const totalOrders = filteredOrders.length;

  const avgPerDay =
    totalMoney /
    (filter === "month" || filter === "30days" ? 30 : 7);

  // =========================
  // 📊 CHART
  // =========================
  // =========================
  // 📊 CHART DATA (CHUẨN T2 → CN)
  // =========================
  let labels = [];
  let chartData = [];

  if (filter === "today") {
    // chia theo giờ
    labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    chartData = Array(24).fill(0);

    filteredOrders.forEach((o) => {
      const h = new Date(o.date).getHours();
      chartData[h] += o.price * o.quantity;
    });
  }

  else if (filter === "week") {
    labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    chartData = Array(7).fill(0);

    filteredOrders.forEach((o) => {
      const d = new Date(o.date).getDay();
      const index = d === 0 ? 6 : d - 1;
      chartData[index] += o.price * o.quantity;
    });
  }

  else if (filter === "month") {
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    chartData = Array(daysInMonth).fill(0);

    filteredOrders.forEach((o) => {
      const d = new Date(o.date).getDate();
      chartData[d - 1] += o.price * o.quantity;
    });
  }

  const maxChart = Math.max(...chartData, 1);

 // =========================
// 📊 SO SÁNH
// =========================
const getTotal = (list) =>
  list.reduce((sum, o) => sum + o.price * o.quantity, 0);

// =========================
// 📅 TÍNH TOTAL THEO TỪNG KIỂU
// =========================

// 👉 TUẦN
const getWeekRange = (date, offset = 0) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;

  const start = new Date(d);
  start.setDate(d.getDate() - diff + offset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// 👉 THÁNG
const getMonth = (date, offset = 0) => {
  const d = new Date(date);
  return {
    month: d.getMonth() + offset,
    year: d.getFullYear(),
  };
};

// =========================
// 🎯 MAIN COMPARE
// =========================
let currentTotal = 0;
let prevTotal = 0;

if (compareType === "week") {
  const { start, end } = getWeekRange(now, 0);
  const { start: prevStart, end: prevEnd } = getWeekRange(now, -7);

  const current = orders.filter(
    (o) => new Date(o.date) >= start && new Date(o.date) <= end
  );

  const prev = orders.filter(
    (o) => new Date(o.date) >= prevStart && new Date(o.date) <= prevEnd
  );

  currentTotal = getTotal(current);
  prevTotal = getTotal(prev);
}

else if (compareType === "month") {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevDate = new Date(currentYear, currentMonth - 1);

  const current = orders.filter((o) => {
    const d = new Date(o.date);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  const prev = orders.filter((o) => {
    const d = new Date(o.date);
    return (
      d.getMonth() === prevDate.getMonth() &&
      d.getFullYear() === prevDate.getFullYear()
    );
  });

  currentTotal = getTotal(current);
  prevTotal = getTotal(prev);
}

// 👉 CUSTOM (CHỌN LỊCH)
else if (compareType === "custom" && start1 && end1 && start2 && end2) {
  const current = orders.filter((o) => {
    const d = new Date(o.date);
    return d >= new Date(start1) && d <= new Date(end1);
  });

  const prev = orders.filter((o) => {
    const d = new Date(o.date);
    return d >= new Date(start2) && d <= new Date(end2);
  });

  currentTotal = getTotal(current);
  prevTotal = getTotal(prev);
}

// 👉 CHÊNH LỆCH
const diff = currentTotal - prevTotal;

// 👉 FEEDBACK
const getFeedback = (diff) => {
  if (diff < 0) {
    return {
      text: `🎉 Tiết kiệm ${Math.abs(diff).toLocaleString()}đ`,
      type: "good",
    };
  }
  if (diff > 0) {
    return {
      text: `😢 Tiêu nhiều hơn ${diff.toLocaleString()}đ`,
      type: "bad",
    };
  }
  return {
    text: "😐 Không thay đổi",
    type: "neutral",
  };
};

const feedback = getFeedback(diff);
  // =========================
  // 🍱 TOP FOOD
  // =========================
  const foodMap = {};
  filteredOrders.forEach((o) => {
    if (!foodMap[o.name]) foodMap[o.name] = 0;
    foodMap[o.name] += o.quantity;
  });

  const topFoods = Object.entries(foodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // =========================
  // 🕒 THÓI QUEN ĂN
  // =========================
  let morning = 0,
    noon = 0,
    evening = 0;

  filteredOrders.forEach((o) => {
    const h = new Date(o.date).getHours();
    if (h < 10) morning++;
    else if (h < 15) noon++;
    else evening++;
  });

  const totalTime = morning + noon + evening || 1;

  // =========================
  // UI
  // =========================
  return (
    <div className="p-5 space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">📊 Thống kê</h1>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {[
          ["today", "Hôm nay"],
          ["week", "Tuần"],
          ["month", "Tháng"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-sm ${filter === key
              ? "bg-blue-500 text-white"
              : "bg-gray-100"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SUMMARY */}
<div className="grid grid-cols-1 gap-3 md:grid-cols-3">

  {/* Tổng tiền */}
  <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-3 shadow-sm transition-all duration-300 hover:shadow-md">

    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-emerald-100/40"></div>

    <div className="relative z-10 flex items-start justify-between">

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Tổng tiền
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-800 whitespace-nowrap">
          {totalMoney.toLocaleString()}đ
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">
        <Wallet className="h-5 w-5 text-emerald-500" />
      </div>

    </div>

    <p className="relative z-10 mt-2 text-right text-[11px] italic text-slate-400">
      Hôm nay
    </p>

  </div>

  {/* Số đơn */}
  <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-3 shadow-sm transition-all duration-300 hover:shadow-md">

    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-sky-100/40"></div>

    <div className="relative z-10 flex items-start justify-between">

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          Số đơn
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-800">
          {totalOrders}
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-white shadow-sm">
        <Utensils className="h-5 w-5 text-sky-500" />
      </div>

    </div>

    <p className="relative z-10 mt-2 text-right text-[11px] italic text-slate-400">
      Tuần này
    </p>

  </div>

  {/* Trung bình */}
  <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-3 shadow-sm transition-all duration-300 hover:shadow-md">

    <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-violet-100/40"></div>

    <div className="relative z-10 flex items-start justify-between">

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">
          Trung bình
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-800 whitespace-nowrap">
          {Math.round(avgPerDay).toLocaleString()}đ
        </h2>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-white shadow-sm">
        <Clock className="h-5 w-5 text-violet-500" />
      </div>

    </div>

    <p className="relative z-10 mt-2 text-right text-[11px] italic text-slate-400">
      Mỗi ngày
    </p>

  </div>

</div>
      {/* CHART */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            📊 Chi tiêu theo ngày
          </p>
          <span className="text-xs text-gray-400">
            {filter === "today"
              ? "Hôm nay"
              : filter === "week"
                ? "Tuần này"
                : "Tháng này"}
          </span>
        </div>

        {/* CHART */}
        <div className="flex items-end justify-between h-44 gap-1 overflow-x-auto">

          {chartData.map((v, i) => (
            <div key={i} className="flex flex-col items-center flex-1">

              {/* VALUE */}
              {v > 0 && (
                <span className="text-[10px] text-gray-500 mb-1">
                  {(v / 1000).toFixed(0)}k
                </span>
              )}

              {/* BAR */}
              <div
                className="w-full rounded-xl bg-gradient-to-t from-blue-500 to-blue-300 shadow-md transition-all duration-500 hover:scale-105"
                style={{
                  height: `${(v / maxChart) * 100}%`,
                  minHeight: v > 0 ? "10px" : "4px",
                }}
              />

              {/* DAY */}
              <span className="text-xs mt-2 text-gray-600 font-medium">
                {labels[i]}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* So sánh chi tiêu */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">

  <p className="font-semibold">⚖️ So sánh chi tiêu</p>

  {/* COMBOBOX */}
  <select
    value={compareType}
    onChange={(e) => setCompareType(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
  >
    <option value="">-- Chọn kiểu so sánh --</option>
    <option value="week">Tuần này với tuần trước</option>
    <option value="month">Tháng này với tháng trước</option>
    <option value="custom">Chọn khoảng thời gian</option>
  </select>

  {/* nếu chọn khoảng thời gian thì hiện thị  */}
  {compareType === "custom" && (
  <div className="grid grid-cols-2 gap-3">
    
    {/* KHOẢNG 1 */}
    <div>
      <p className="text-xs text-gray-500">Khoảng 1</p>
      <input
        type="date"
        onChange={(e) => setStart1(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        onChange={(e) => setEnd1(e.target.value)}
        className="w-full border p-2 rounded mt-1"
      />
    </div>

    {/* KHOẢNG 2 */}
    <div>
      <p className="text-xs text-gray-500">Khoảng 2</p>
      <input
        type="date"
        onChange={(e) => setStart2(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        onChange={(e) => setEnd2(e.target.value)}
        className="w-full border p-2 rounded mt-1"
      />
    </div>

  </div>
)}
  {compareType && (
  <div className="p-4 rounded-xl bg-gray-50 space-y-3">

  {/* TITLE */}
  <p className="text-sm text-gray-500">
    {compareType === "week"
  ? "Tuần này vs tuần trước"
  : compareType === "month"
  ? "Tháng này vs tháng trước"
  : "Khoảng bạn chọn với khoảng bạn chọn"}
  </p>

  {/* 2 CỘT SO SÁNH */}
  <div className="flex justify-between items-center">

    <div className="text-center flex-1">
      <p className="text-xs text-gray-400">Hiện tại</p>
      <p className="font-bold text-lg text-blue-600">
        {currentTotal.toLocaleString()}đ
      </p>
    </div>

    <div className="text-gray-300 text-xl">→</div>

    <div className="text-center flex-1">
      <p className="text-xs text-gray-400">Kỳ trước</p>
      <p className="font-bold text-lg text-gray-600">
        {prevTotal.toLocaleString()}đ
      </p>
    </div>

  </div>

  {/* KẾT LUẬN */}
  <div className="text-center">

    <p
      className={`text-sm font-medium ${
        diff < 0
          ? "text-green-500"
          : diff > 0
          ? "text-red-500"
          : "text-gray-500"
      }`}
    >
      {diff < 0 && `🎉 Tiết kiệm ${Math.abs(diff).toLocaleString()}đ`}
      {diff > 0 && `😢 Tiêu nhiều hơn ${diff.toLocaleString()}đ`}
      {diff === 0 && "😐 Không thay đổi"}
    </p>

  </div>

  {/* IMAGE */}
  <div className="flex justify-center">
    <img
  src={
    diff < 0
      ? tietkiem
      : diff > 0
      ? vuot
      : bang
  }
  className="w-40"
/>
  </div>

</div>
)}

      </div>

      {/* TOP FOOD */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            🍱 Món ăn yêu thích
          </p>
          <span className="text-xs text-gray-400">
            Top {topFoods.length}
          </span>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {topFoods.map((f, i) => {
            const max = topFoods[0]?.[1] || 1;
            const percent = (f[1] / max) * 100;

            return (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-center mb-2">

                  {/* LEFT */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>

                    <span className="font-medium text-gray-800">
                      {f[0]}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <span className="text-sm text-gray-500">
                    {f[1]} lần
                  </span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${i === 0
                      ? "bg-green-500"
                      : i === 1
                        ? "bg-blue-500"
                        : "bg-purple-400"
                      }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* EMPTY */}
          {topFoods.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              Chưa có dữ liệu
            </p>
          )}

        </div>
      </div>

      {/* HABITS */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            🕒 Thói quen ăn
          </p>
          <span className="text-xs text-gray-400">
            Theo buổi
          </span>
        </div>

        {/* LIST */}
        <div className="space-y-4">

          {[
            {
              label: "Sáng",
              value: Math.round((morning / totalTime) * 100),
              icon: "🌅",
              color: "from-yellow-400 to-orange-400",
            },
            {
              label: "Trưa",
              value: Math.round((noon / totalTime) * 100),
              icon: "🌞",
              color: "from-green-400 to-green-600",
            },
            {
              label: "Chiều",
              value: Math.round((evening / totalTime) * 100),
              icon: "🌙",
              color: "from-purple-400 to-indigo-500",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-1">

              {/* TOP ROW */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>

                <span className="text-gray-500 font-medium">
                  {item.value}%
                </span>
              </div>

              {/* PROGRESS */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}