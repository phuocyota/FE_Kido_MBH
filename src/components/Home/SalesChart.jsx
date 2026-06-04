

import React, { useMemo, useState, useEffect } from "react";
import { reportApi } from "../../api/reportApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  ChevronDown,
  Check,
} from "lucide-react";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  const tabs = ["Theo giờ", "Theo ngày", "Theo thứ"];

  // LEFT
  const [activeTab, setActiveTab] = useState("Theo thứ");
  const [filter, setFilter] = useState("7 ngày qua");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);

  const filters = [
    "Hôm nay",
    "Hôm qua",
    "7 ngày qua",
    "Tháng này",
    "Tháng trước",
  ];

  // Helper to get date range from filter
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let from = new Date(today);
    let to = new Date(today);

    switch (filter) {
      case "Hôm nay":
        break;
      case "Hôm qua":
        from.setDate(from.getDate() - 1);
        to.setDate(to.getDate() - 1);
        break;
      case "7 ngày qua":
        from.setDate(from.getDate() - 6);
        break;
      case "Tháng này":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Tháng trước":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        from.setDate(from.getDate() - 6);
    }

    const formatDate = (d) => d.toISOString().split('T')[0];
    return { from: formatDate(from), to: formatDate(to) };
  };

  // Fetch data from API when filter changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { from, to } = getDateRange();
        const [revenueRes, customers] = await Promise.all([
          reportApi.getDailyRevenue(from, to),
          reportApi.getCustomerStats("today"),
        ]);
        // Extract data from API response wrapper
        const revenue = revenueRes.data || revenueRes;
        setRevenueData(revenue);
        setCustomerStats(customers);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  // Transform API data to chart format
  const transformRevenueData = () => {
    if (!revenueData) {
      return {
        revenue: "0",
        orders: 0,
        hour: { labels: [], values: [] },
        day: { labels: [], values: [] },
        week: { labels: [], values: [] },
      };
    }

    // Handle reportApi.getDailyRevenue response format
    // Response: { from, to, data: [{ date, orderCount, revenue }, ...] }
    let dailyData = [];
    if (Array.isArray(revenueData)) {
      dailyData = revenueData;
    } else if (revenueData?.data && Array.isArray(revenueData.data)) {
      dailyData = revenueData.data;
    } else if (revenueData?.daily && Array.isArray(revenueData.daily)) {
      dailyData = revenueData.daily;
    }

    // Format currency
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN").format(value || 0);
    };

    // Get day of week in Vietnamese
    const getDayLabel = (dateStr) => {
      const date = new Date(dateStr);
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return days[date.getDay()];
    };

    // Calculate totals from daily data
    const totalRevenue = dailyData.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const totalOrders = dailyData.reduce((sum, d) => sum + (d.orderCount || d.orders || 0), 0);

    return {
      revenue: formatCurrency(totalRevenue),
      orders: totalOrders,
      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: dailyData.length > 0 ? dailyData.map(() => totalRevenue / 5 / 1000000) : [0, 0, 0, 0, 0],
      },
      day: {
        labels: dailyData.map((d) => getDayLabel(d.date)),
        values: dailyData.map((d) => (d.revenue || 0) / 1000000),
      },
      week: {
        labels: dailyData.map((d) => getDayLabel(d.date)),
        values: dailyData.map((d) => (d.revenue || 0) / 1000000),
      },
    };
  };

  const currentData = transformRevenueData();
  const chartData = useMemo(() => {

    if (activeTab === "Theo giờ") {
      return currentData.hour;
    }

    if (activeTab === "Theo ngày") {
      return currentData.day;
    }

    return currentData.week;

  }, [activeTab, currentData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) => value + "tr",
        },

        grid: {
          color: "#f1f5f9",
        },

        border: {
          display: false,
        },
      },

      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },
    },
  };

  // RIGHT
  const [activeTab2, setActiveTab2] = useState("Theo thứ");
  const [open2, setOpen2] = useState(false);
  // Use same filter for both charts

  // Transform API customer data to chart format
  const transformCustomerData = () => {
    if (!customerStats) {
      return {
        total: 0,
        hour: { labels: [], values: [] },
        day: { labels: [], values: [] },
        week: { labels: [], values: [] },
      };
    }

    const daily = customerStats.daily || [];

    // Get day of week in Vietnamese
    const getDayLabel = (dateStr) => {
      const date = new Date(dateStr);
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return days[date.getDay()];
    };

    // Aggregate hourly data from daily (simplified)
    const hourlyValues = daily.length > 0 
      ? daily.map((d) => Math.round(d.customers / 8)) // Estimate per hour
      : [];

    return {
      total: customerStats.totalCustomers || 0,
      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: hourlyValues.length >= 5 ? hourlyValues.slice(0, 5) : [0, 0, 0, 0, 0],
      },
      day: {
        labels: daily.map((d) => getDayLabel(d.date)),
        values: daily.map((d) => d.customers),
      },
      week: {
        labels: daily.map((d) => getDayLabel(d.date)),
        values: daily.map((d) => d.customers),
      },
    };
  };

  const currentCustomerData = transformCustomerData();

  const customerChartData = useMemo(() => {

    if (activeTab2 === "Theo giờ") {
      return currentCustomerData.hour;
    }

    if (activeTab2 === "Theo ngày") {
      return currentCustomerData.day;
    }

    return currentCustomerData.week;

  }, [activeTab2, currentCustomerData]);



  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">

      {/* ================= LEFT ================= */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

        {/* HEADER */}
        <div className="p-4 sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div>
              <h2 className="text-[18px] font-bold text-gray-900">
                Doanh thu thuần
              </h2>

              <p className="mt-3 text-[22px] font-bold text-blue-600">
                {currentData.revenue}đ
              </p>

              <p className="mt-1 text-[14px] font-medium text-gray-500">
                ({currentData.orders} hóa đơn)
              </p>
            </div>

            {/* FILTER */}
            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="
    h-11
    px-4
    rounded-2xl
    border
    border-blue-500
    bg-white
    hover:bg-blue-50
    transition-all
    flex
    items-center
    justify-between
    gap-3
    min-w-[160px]
    text-[15px]
    font-medium
    text-gray-700
  "
              >
                <span>{filter}</span>

                <ChevronDown
                  size={18}
                  className={`
      transition-transform duration-300
      ${open ? "rotate-180" : ""}
    `}
                />
              </button>

              {open && (
                <div className="
      absolute
      right-0
      mt-2
      w-[180px]
      bg-white
      rounded-2xl
      shadow-xl
      border
      border-gray-200
      overflow-hidden
      z-50
    ">

                  {filters.map((item) => (

                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setOpen(false);
                      }}
                      className={`
            w-full
            px-4
            py-3
            text-left
            hover:bg-gray-50

            ${filter === item
                          ? "bg-blue-50 text-blue-600"
                          : ""
                        }
          `}
                    >
                      {item}
                    </button>

                  ))}

                </div>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-7 mt-7 border-b border-gray-200 overflow-x-auto">

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
        pb-3 text-[15px] whitespace-nowrap transition relative
        ${activeTab === tab
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-black"
                  }
      `}
              >
                {tab}

                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            ))}

          </div>
        </div>


        {/* CHART */}
        <div className="p-4 sm:p-5 pt-0">

          <div className="w-full overflow-x-auto">

            <div className="
      min-w-[700px]
      h-[320px]
      sm:h-[420px]
    ">

              <Bar
                data={{
                  labels: chartData.labels,

                  datasets: [
                    {
                      label: "Doanh thu",

                      data: chartData.values,

                      backgroundColor: "#1677ff",

                      borderRadius: 8,

                      maxBarThickness: 32,
                    },
                  ],
                }}
                options={options}
              />

            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

        {/* HEADER */}
        <div className="p-4 sm:p-5">

          <div className="flex items-start justify-between gap-3">

            <div>
              <h2 className="text-[18px] font-bold text-gray-900">
                Lượng khách hàng
              </h2>

              <p className="mt-3 text-[18px] font-bold text-black">
                {currentCustomerData.total} lượt khách
              </p>
            </div>

            {/* FILTER */}
            <div className="relative">

              <button
                onClick={() => setOpen2(!open2)}
                className="
      h-11
      px-4
      rounded-2xl
      border
      border-blue-500
      bg-white
      hover:bg-blue-50
      transition-all
      flex
      items-center
      justify-between
      gap-3
      min-w-[160px]
      text-[15px]
      font-medium
      text-gray-700
    "
              >
                <span>{filter}</span>

                <ChevronDown
                  size={18}
                  className={`
        transition-transform duration-300
        ${open2 ? "rotate-180" : ""}
      `}
                />
              </button>

              {open2 && (
                <div className="
      absolute
      right-0
      mt-2
      w-[180px]
      bg-white
      rounded-2xl
      shadow-xl
      border
      border-gray-200
      overflow-hidden
      z-50
    ">

                  {filters.map((item) => (

                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setOpen2(false);
                      }}
                      className={`
            w-full
            px-4
            py-3
            text-left
            hover:bg-gray-50

            ${filter === item
                          ? "bg-blue-50 text-blue-600"
                          : ""
                        }
          `}
                    >
                      {item}
                    </button>

                  ))}

                </div>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-7 mt-7 border-b border-gray-200 overflow-x-auto">

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab2(tab)}
                className={`
                  pb-3 text-[15px] whitespace-nowrap transition relative
                  ${activeTab2 === tab
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-black"
                  }
                `}
              >
                {tab}

                {activeTab2 === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            ))}

          </div>
        </div>

        {/* CHART */}
        <div className="p-4 sm:p-5 pt-0">

          <div className="w-full overflow-x-auto">

            <div className="
      min-w-[700px]
      h-[320px]
      sm:h-[420px]
    ">

              <Line
  data={{
    labels: customerChartData.labels,

    datasets: [
      {
        label: "Khách hàng",

        data: customerChartData.values,

        borderColor: "#22c55e",

        backgroundColor: "rgba(34,197,94,0.15)",

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 7,

        pointBackgroundColor: "#22c55e",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,
      },
    ],
  }}
  options={{
    ...options,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        grid: {
          color: "#f1f5f9",
        },

        border: {
          display: false,
        },
      },

      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },
    },
  }}
/>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}