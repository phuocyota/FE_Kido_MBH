import React, { useEffect, useState } from "react";
import { BarChart3, Wallet, Utensils, Clock } from "lucide-react";
import { mockOrders } from "../../datas/mockOrders";

export default function Stats() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("week");


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
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const chartData = [0, 0, 0, 0, 0, 0, 0];

  // map dữ liệu vào đúng ngày
  filteredOrders.forEach((o) => {
    const d = new Date(o.date).getDay(); // CN = 0

    const index = d === 0 ? 6 : d - 1; // convert về T2 = 0

    chartData[index] += o.price * o.quantity;
  });

  const maxChart = Math.max(...chartData, 1);

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
          ["7days", "7 ngày"],
          ["week", "Tuần"],
          ["30days", "30 ngày"],
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
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-500 text-white p-4 rounded-2xl">
          <Wallet size={18} />
          <p className="text-sm">Tổng tiền</p>
          <p className="font-bold">
            {totalMoney.toLocaleString()}đ
          </p>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-2xl">
          <Utensils size={18} />
          <p className="text-sm">Số đơn</p>
          <p className="font-bold">{totalOrders}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-2xl">
          <Clock size={18} />
          <p className="text-sm">Trung bình</p>
          <p className="font-bold">
            {Math.round(avgPerDay).toLocaleString()}đ
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
            Tuần này
          </span>
        </div>

        {/* CHART */}
        <div className="flex items-end justify-between h-44 gap-3">

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
                {days[i]}
              </span>
            </div>
          ))}
        </div>

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
              className={`h-2 rounded-full transition-all duration-500 ${
                i === 0
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