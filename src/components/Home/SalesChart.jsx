

import React, { useMemo, useState } from "react";
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
  const filters = [
    "Hôm nay",
    "Hôm qua",
    "7 ngày qua",
    "Tháng này",
    "Tháng trước",
  ];

  const mockData = {

    "Hôm nay": {
      revenue: "2,450,000",
      orders: 12,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [1, 2, 4, 3, 5],
      },

      day: {
        labels: ["Hôm nay"],
        values: [24],
      },

      week: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [5, 9, 6, 12, 8, 15, 10],
      },
    },

    "Hôm qua": {
      revenue: "1,820,000",
      orders: 9,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [1, 1.5, 2, 3, 2],
      },

      day: {
        labels: ["Hôm qua"],
        values: [18],
      },

      week: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [4, 7, 5, 10, 7, 11, 8],
      },
    },

    "7 ngày qua": {
      revenue: "8,031,000",
      orders: 35,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [2, 4, 5, 3, 6],
      },

      day: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [8, 12, 9, 15, 11, 18, 13],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [45, 58, 62, 77],
      },
    },

    "Tháng này": {
      revenue: "32,550,000",
      orders: 148,

      hour: {
        labels: ["06h", "08h", "10h", "12h", "14h"],
        values: [5, 8, 12, 18, 15],
      },

      day: {
        labels: ["1", "5", "10", "15", "20", "25", "30"],
        values: [12, 18, 25, 22, 28, 30, 26],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [68, 74, 91, 103],
      },
    },

    "Tháng trước": {
      revenue: "28,740,000",
      orders: 132,

      hour: {
        labels: ["06h", "08h", "10h", "12h", "14h"],
        values: [4, 7, 10, 15, 13],
      },

      day: {
        labels: ["1", "5", "10", "15", "20", "25", "30"],
        values: [10, 15, 20, 19, 25, 28, 24],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [55, 67, 83, 95],
      },
    },

  };


  const currentData = mockData[filter];
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

  const [filter2, setFilter2] = useState("7 ngày qua");

  const [open2, setOpen2] = useState(false);

  const customerData = {

    "Hôm nay": {
      total: 48,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [2, 5, 8, 12, 9],
      },

      day: {
        labels: ["Hôm nay"],
        values: [48],
      },

      week: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [12, 18, 15, 20, 17, 25, 21],
      },
    },

    "Hôm qua": {
      total: 36,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [1, 3, 6, 9, 7],
      },

      day: {
        labels: ["Hôm qua"],
        values: [36],
      },

      week: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [10, 14, 12, 17, 15, 20, 18],
      },
    },

    "7 ngày qua": {
      total: 214,

      hour: {
        labels: ["06h", "07h", "08h", "09h", "10h"],
        values: [5, 9, 15, 22, 18],
      },

      day: {
        labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        values: [28, 35, 31, 40, 37, 45, 39],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [120, 158, 174, 214],
      },
    },

    "Tháng này": {
      total: 856,

      hour: {
        labels: ["06h", "08h", "10h", "12h", "14h"],
        values: [18, 25, 32, 40, 37],
      },

      day: {
        labels: ["1", "5", "10", "15", "20", "25", "30"],
        values: [45, 52, 68, 74, 81, 90, 86],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [220, 315, 428, 512],
      },
    },

    "Tháng trước": {
      total: 721,

      hour: {
        labels: ["06h", "08h", "10h", "12h", "14h"],
        values: [15, 20, 28, 35, 31],
      },

      day: {
        labels: ["1", "5", "10", "15", "20", "25", "30"],
        values: [40, 48, 59, 66, 72, 78, 74],
      },

      week: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        values: [180, 264, 358, 441],
      },
    },

  };

  const currentCustomerData = customerData[filter2];

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

              <p className="mt-3 text-[18px] font-semibold text-gray-900">
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
                <span>{filter2}</span>

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
                        setFilter2(item);
                        setOpen2(false);
                      }}
                      className={`
            w-full
            px-4
            py-3
            text-left
            hover:bg-gray-50

            ${filter2 === item
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