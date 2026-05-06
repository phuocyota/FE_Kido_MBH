

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  BarChart3,
  LineChart,
} from "lucide-react";

export default function DashboardCharts() {
  const [activeTab1, setActiveTab1] = useState("Theo thứ");
  const [activeTab2, setActiveTab2] = useState("Theo thứ");

  const [filter1, setFilter1] = useState("7 ngày qua");
  const [filter2, setFilter2] = useState("7 ngày qua");

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
      labels: ["06h", "07h", "08h", "09h"],
      values: [1, 2, 4, 3],
    },

    day: {
      labels: ["Hôm nay"],
      values: [24],
    },

    week: {
      labels: ["T2", "T3", "T4", "T5"],
      values: [5, 9, 6, 12],
    },
  },

  "7 ngày qua": {
    revenue: "8,031,000",
    orders: 35,

    hour: {
      labels: ["06h", "07h", "08h", "09h"],
      values: [2, 4, 5, 3],
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

  // RIGHT




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
      flex
      items-center
      gap-2
    "
  >
    {filter}
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
                onClick={() => setActiveTab1(tab)}
                className={`
                  pb-3 text-[15px] whitespace-nowrap transition relative
                  ${activeTab1 === tab
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-black"
                  }
                `}
              >
                {tab}

                {activeTab1 === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            ))}

          </div>
        </div>

        {/* EMPTY */}
        <div className="h-[340px] sm:h-[420px] flex flex-col items-center justify-center px-6">

          {/* ICON */}
          <div className="relative mb-5">
            <div className="flex items-end gap-1">

              <div className="w-3 h-5 rounded-sm border-2 border-blue-600 bg-blue-50" />

              <div className="w-3 h-9 rounded-sm bg-blue-500" />

              <div className="w-3 h-14 rounded-sm bg-blue-700" />

              <div className="w-3 h-8 rounded-sm bg-blue-200" />

            </div>
          </div>

          <p className="text-gray-600 text-center text-[16px]">
            Bạn chưa bán đơn nào
          </p>

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
                0 lượt khách
              </p>
            </div>

            {/* FILTER */}
            <button className="h-11 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-[15px] font-medium text-gray-700 shrink-0">
              {filter2}
              <ChevronDown size={18} />
            </button>
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

        {/* EMPTY */}
        <div className="h-[340px] sm:h-[420px] flex flex-col items-center justify-center px-6">

          {/* ICON */}
          <div className="mb-5 relative">

            <div className="relative">

              {/* CHART BG */}
              <div className="w-[58px] h-[38px] bg-blue-100 rounded-md" />

              {/* LINE */}
              <svg
                className="absolute inset-0"
                width="58"
                height="38"
                viewBox="0 0 58 38"
                fill="none"
              >
                <path
                  d="M2 25L12 18L22 22L32 15L42 18L52 8"
                  stroke="#1677ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </div>
          </div>

          <p className="text-gray-600 text-center text-[16px]">
            Chưa có lượt khách nào
          </p>

        </div>
      </div>
    </div>
  );
}