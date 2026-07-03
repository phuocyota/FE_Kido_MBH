import React, { useState, useEffect, useMemo } from "react";
import {
  ChefHat,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Printer,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  UtensilsCrossed,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import toast from "react-hot-toast";
import { reportApi } from "../../../api";

const COLORS_LEVEL = ["#3B82F6", "#10B981"]; // Blue for Primary, Green for Preschool
const COLORS_MEAL = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"]; // Yellow, Green, Blue, Red

const MEAL_NAMES_VN = {
  BREAKFAST: "Ăn sáng",
  LUNCH: "Ăn trưa",
  AFTERNOON: "Ăn xế",
  DINNER: "Ăn tối"
};

const LEVEL_NAMES_VN = {
  preschool: "Mầm non",
  primary: "Tiểu học"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl text-white">
        <p className="text-xs font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-6 text-sm font-semibold justify-between mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              {pld.name}:
            </span>
            <span className="font-extrabold text-white text-right">
              {pld.name.includes("Doanh thu") 
                ? `${Number(pld.value * 1000).toLocaleString("vi-VN")}đ` 
                : `${pld.value} suất`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportBoardingContent({
  viewType,
  interest,
  fromDate,
  toDate,
  branch,
  branchId,
  zoom,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleFullscreen,
  handleDownloadExcel,
  handlePrint,
  previewRef,
  level,
  mealPeriod
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await reportApi.getBoardingStats(
          fromDate,
          toDate,
          branchId || undefined,
          level === "all" ? undefined : level,
          mealPeriod === "all" ? undefined : mealPeriod
        );
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          toast.error("Không thể tải báo cáo thống kê bán trú");
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (fromDate && toDate) {
      fetchData();
    } else {
      setData(null);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [fromDate, toDate, branchId, level, mealPeriod]);

  // Dynamic Data mapping from API response
  const reportData = useMemo(() => {
    if (!data) {
      return {
        kpis: {
          totalMealsOrdered: 0,
          totalMealsCancelled: 0,
          totalMealsServed: 0,
          totalRevenue: 0,
          completionRate: "0.0"
        },
        chartData: [],
        tableRows: [],
        levelPie: [],
        mealPie: []
      };
    }

    const summary = data.summary || {};
    const kpis = {
      totalMealsOrdered: summary.totalMealsOrdered || 0,
      totalMealsCancelled: summary.totalMealsCancelled || 0,
      totalMealsServed: summary.totalMealsServed || (summary.totalMealsOrdered - summary.totalMealsCancelled) || 0,
      totalRevenue: summary.totalRevenue || 0,
      completionRate: summary.completionRate !== undefined ? Number(summary.completionRate).toFixed(1) : "0.0"
    };

    // Format dailyTrend to chartData
    const chartData = (data.dailyTrend || []).map((item) => {
      let label = "";
      if (item.date) {
        const parts = item.date.split("-");
        if (parts.length === 3) {
          label = `${parts[2]}/${parts[1]}`;
        } else {
          label = item.date;
        }
      }
      return {
        date: label,
        "Suất ăn": item.portions || 0,
        "Doanh thu (k)": Math.round((item.revenue || 0) / 1000)
      };
    });

    // Format levelStats to levelPie matching COLORS_LEVEL order
    const levelPie = [];
    const primaryStat = (data.levelStats || []).find((item) => item.level === "primary");
    const preschoolStat = (data.levelStats || []).find((item) => item.level === "preschool");
    if (primaryStat && primaryStat.value > 0) {
      levelPie.push({ name: primaryStat.name || "Tiểu học", value: primaryStat.value });
    }
    if (preschoolStat && preschoolStat.value > 0) {
      levelPie.push({ name: preschoolStat.name || "Mầm non", value: preschoolStat.value });
    }
    // Fallback if structure is different
    if (levelPie.length === 0 && (data.levelStats || []).length > 0) {
      data.levelStats.forEach(item => {
        if (item.value > 0) {
          levelPie.push({ name: item.name || LEVEL_NAMES_VN[item.level] || item.level, value: item.value });
        }
      });
    }

    // Format mealStats to mealPie matching COLORS_MEAL order
    const mealPeriodsOrder = ["BREAKFAST", "LUNCH", "AFTERNOON", "DINNER"];
    const mealPie = [];
    mealPeriodsOrder.forEach((period) => {
      const stat = (data.mealStats || []).find((item) => item.mealPeriod === period);
      if (stat && stat.value > 0) {
        mealPie.push({ name: stat.name || MEAL_NAMES_VN[period], value: stat.value });
      }
    });
    // Fallback
    if (mealPie.length === 0 && (data.mealStats || []).length > 0) {
      data.mealStats.forEach(item => {
        if (item.value > 0) {
          mealPie.push({ name: item.name || MEAL_NAMES_VN[item.mealPeriod] || item.mealPeriod, value: item.value });
        }
      });
    }

    // Format detailLogs to tableRows
    const tableRows = (data.detailLogs || []).map((log) => {
      let statusText = "Hoàn thành";
      let statusColor = "bg-green-50 text-green-700 border-green-200";

      if (log.status === "PENDING" || log.status === "SERVING") {
        statusText = "Đang phục vụ";
        statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
      } else if (log.status === "SCHEDULED" || log.status === "MENU_PLANNED") {
        statusText = "Đã lên thực đơn";
        statusColor = "bg-blue-50 text-blue-700 border-blue-200";
      } else if (log.status === "CANCELLED") {
        statusText = "Đã hủy";
        statusColor = "bg-red-50 text-red-700 border-red-200";
      } else {
        const todayStr = new Date().toISOString().split("T")[0];
        if (log.date > todayStr) {
          statusText = "Đã lên thực đơn";
          statusColor = "bg-blue-50 text-blue-700 border-blue-200";
        } else if (log.date === todayStr) {
          statusText = "Đang phục vụ";
          statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
        }
      }

      return {
        date: log.date,
        level: LEVEL_NAMES_VN[log.level] || log.level,
        meal: MEAL_NAMES_VN[log.mealPeriod] || log.mealPeriod,
        dishName: log.dishName,
        price: log.unitPrice || 0,
        ordered: log.ordered || 0,
        cancelled: log.cancelled || 0,
        served: log.served || 0,
        amount: log.amount || 0,
        statusText,
        statusColor
      };
    });

    return {
      kpis,
      chartData,
      tableRows,
      levelPie,
      mealPie
    };
  }, [data]);

  const { kpis, chartData, tableRows, levelPie, mealPie } = reportData;

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="bg-slate-50/50 rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col min-w-[1300px]">
      {/* TOOLBAR */}
      <div className="flex items-center justify-between border-b border-gray-200/60 px-6 py-4 bg-slate-50 report-sidebar">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-200/70 rounded-xl transition text-slate-600"
            title="Thu nhỏ"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-bold text-slate-700 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-200/70 rounded-xl transition text-slate-600"
            title="Phóng to"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-slate-200/70 rounded-xl transition text-slate-500 hover:text-slate-700"
            title="Đặt lại zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFullscreen}
            className="h-10 px-4 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-2 text-sm font-bold shadow-2xs transition"
          >
            <Maximize2 size={16} />
            Toàn màn hình
          </button>
          <button
            onClick={handleDownloadExcel}
            className="h-10 px-4 border border-emerald-600/30 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 text-sm font-bold shadow-2xs transition"
          >
            📊 Xuất Excel
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 bg-blue-600 rounded-xl text-white hover:bg-blue-700 flex items-center gap-2 text-sm font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Printer size={16} />
            In báo cáo
          </button>
        </div>
      </div>

      {/* REPORT CONTENT WRAPPER */}
      {loading ? (
        <div className="flex-1 min-h-[500px] flex flex-col justify-center items-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            <p className="text-slate-500 font-bold text-sm tracking-wide animate-pulse">
              Đang tải dữ liệu báo cáo...
            </p>
          </div>
        </div>
      ) : (
        <div 
          ref={previewRef} 
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }} 
          className="flex-1 p-8 space-y-8 bg-slate-50/30 transition-all duration-150"
        >
          {/* REPORT HEADER PRINT */}
          <div className="border-b border-slate-200 pb-6 text-center">
            <h1 className="text-[32px] font-black text-[#1E293B] tracking-tight">
              BÁO CÁO THỐNG KÊ CHI TIẾT BÁN TRÚ
            </h1>
            <p className="text-slate-600 mt-2 font-semibold text-lg">
              Chi nhánh: {branch || "Tất cả chi nhánh"}
            </p>
            <p className="text-slate-400 mt-1 font-bold text-xs bg-slate-100 border border-slate-200/60 rounded-full px-3 py-1 inline-block">
              Thời gian: {fromDate ? formatDateLabel(fromDate) : ""} - {toDate ? formatDateLabel(toDate) : ""}
            </p>
          </div>

          {/* KPI METRICS */}
          <div className="grid grid-cols-5 gap-5">
            {[
              {
                title: "Tổng suất đặt",
                value: Number(kpis.totalMealsOrdered || 0).toLocaleString("vi-VN"),
                icon: ShoppingBag,
                desc: "Tổng lượt suất ăn học sinh đăng ký",
                color: "text-blue-600",
                iconBg: "bg-blue-500/10 text-blue-600"
              },
              {
                title: "Thực nhận",
                value: Number(kpis.totalMealsServed || 0).toLocaleString("vi-VN"),
                icon: UtensilsCrossed,
                desc: "Số lượng suất đã chuẩn bị & phục vụ",
                color: "text-emerald-600",
                iconBg: "bg-emerald-500/10 text-emerald-600"
              },
              {
                title: "Doanh thu bán trú",
                value: `${Number(kpis.totalRevenue || 0).toLocaleString("vi-VN")}đ`,
                icon: DollarSign,
                desc: "Tổng doanh thu ăn bán trú tạm tính",
                color: "text-amber-600",
                iconBg: "bg-amber-500/10 text-amber-600"
              },
              {
                title: "Tỷ lệ hoàn thành",
                value: `${kpis.completionRate || "0.0"}%`,
                icon: CheckCircle,
                desc: "Tỷ lệ nhận suất thành công",
                color: "text-indigo-600",
                iconBg: "bg-indigo-500/10 text-indigo-600"
              },
              {
                title: "Số suất hủy/đổi",
                value: Number(kpis.totalMealsCancelled || 0).toLocaleString("vi-VN"),
                icon: AlertTriangle,
                desc: "Học sinh báo nghỉ/hủy suất ăn",
                color: "text-red-600",
                iconBg: "bg-red-500/10 text-red-600"
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs shadow-slate-100 hover:shadow-md hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Glow Background Accent */}
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-transform group-hover:scale-125 ${item.iconBg.split(" ")[0]}`} />

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                      {item.title}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs ${item.iconBg}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className={`text-[28px] font-black tracking-tight leading-none ${item.color}`}>
                      {item.value}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-2.5 font-medium leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHARTS CONTAINER */}
          {viewType === "chart" && (
            <div className="grid grid-cols-12 gap-6">
              {/* AREA CHART - Trend */}
              <div className="col-span-8 border border-slate-200/60 rounded-3xl p-6 bg-white shadow-xs">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={18} />
                  Biểu đồ xu hướng suất ăn & Doanh thu hàng ngày
                </h3>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorServings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36}/>
                      <Area
                        type="monotone"
                        dataKey="Suất ăn"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorServings)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Doanh thu (k)"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PIE CHARTS - Composition */}
              <div className="col-span-4 flex flex-col gap-6">
                {/* Level Pie */}
                <div className="border border-slate-200/60 rounded-3xl p-5 bg-white shadow-xs flex-1">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <Users className="text-green-500" size={16} />
                    Suất ăn theo khối lớp
                  </h3>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={levelPie}
                          cx="50%"
                          cy="42%"
                          innerRadius={42}
                          outerRadius={62}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {levelPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_LEVEL[index % COLORS_LEVEL.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" layout="horizontal" align="center" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Meal Pie */}
                <div className="border border-slate-200/60 rounded-3xl p-5 bg-white shadow-xs flex-1">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <ChefHat className="text-amber-500" size={16} />
                    Suất ăn theo bữa ăn
                  </h3>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mealPie}
                          cx="50%"
                          cy="42%"
                          innerRadius={42}
                          outerRadius={62}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {mealPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_MEAL[index % COLORS_MEAL.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" layout="horizontal" align="center" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAILED DATA GRID */}
          <div className="border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs bg-white">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ChefHat size={18} className="text-blue-600" />
                Chi tiết nhật ký chia suất ăn & Thực đơn
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                Tổng cộng: {tableRows.length} dòng
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-4 text-center w-12">STT</th>
                    <th className="py-4 px-4 w-28 text-center">Ngày</th>
                    <th className="py-4 px-4 w-28 text-center">Khối lớp</th>
                    <th className="py-4 px-4 w-28 text-center">Bữa ăn</th>
                    <th className="py-4 px-4 min-w-[200px] text-left">Thực đơn chi tiết</th>
                    <th className="py-4 px-4 text-right w-28">Đơn giá</th>
                    <th className="py-4 px-4 text-center w-24">Số đặt</th>
                    <th className="py-4 px-4 text-center w-24">Hủy/Trả</th>
                    <th className="py-4 px-4 text-center w-24">Thực nhận</th>
                    <th className="py-4 px-4 text-right w-36">Thành tiền</th>
                    <th className="py-4 px-4 text-center w-36">Trạng thái bếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableRows.length > 0 ? (
                    tableRows.map((row, index) => (
                      <tr
                        key={index}
                        className="text-sm font-medium text-slate-700 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">{index + 1}</td>
                        <td className="py-3.5 px-4 text-center text-slate-500">{formatDateLabel(row.date)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                            row.level === "Mầm non" 
                              ? "bg-teal-50 text-teal-700 border-teal-200/50" 
                              : "bg-indigo-50 text-indigo-700 border-indigo-200/50"
                          }`}>
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-600">{row.meal}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 hover:text-blue-600 transition-colors">{row.dishName}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-500">
                          {row.price.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">{row.ordered}</td>
                        <td className={`py-3.5 px-4 text-center font-bold ${row.cancelled > 0 ? "text-red-500" : "text-slate-400 font-normal"}`}>
                          {row.cancelled > 0 ? `-${row.cancelled}` : "0"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block py-1 px-2.5 rounded-lg text-emerald-600 font-extrabold bg-emerald-50/50 border border-emerald-100/50">
                            {row.served}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-blue-600">
                          {row.amount.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${row.statusColor}`}>
                            {row.statusText}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 font-semibold">
                        Không có thông tin suất ăn trong khoảng thời gian này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
