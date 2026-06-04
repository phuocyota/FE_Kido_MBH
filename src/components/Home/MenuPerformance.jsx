import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Info,
} from "lucide-react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { dashboardApi } from "../../api/dashboardApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const filterOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "Hôm qua", value: "yesterday" },
  { label: "7 ngày qua", value: "7days" },
  { label: "Tháng này", value: "thisMonth" },
  { label: "Tháng trước", value: "lastMonth" },
];

const viewTypeOptions = {
  "Theo nhóm": "category",
  "Theo loại": "type",
};

const formatCompactCurrency = (value) => {
  const amount = Number(value) || 0;

  if (amount >= 1000000) {
    return `${Math.round(amount / 1000000)}M`;
  }

  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}K`;
  }

  return `${amount}`;
};

const formatCurrency = (value) => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

export default function MenuPerformance() {

  const [viewType, setViewType] = useState("Theo loại");

  const [filter, setFilter] = useState("7 ngày qua");

  const [open, setOpen] = useState(false);

  const [menuPerformance, setMenuPerformance] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const filterValue = useMemo(() => {
    return filterOptions.find((item) => item.label === filter)?.value || "7days";
  }, [filter]);

  const groupBy = viewTypeOptions[viewType] || "type";

  const categoryData = menuPerformance?.groups || [];

  const summary = menuPerformance?.summary || {};

  useEffect(() => {
    let active = true;

    const fetchMenuPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await dashboardApi.getMenuPerformance({
          filter: filterValue,
          groupBy,
        });

        if (active) {
          setMenuPerformance(data);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Không thể tải dữ liệu hiệu quả thực đơn");
          setMenuPerformance(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMenuPerformance();

    return () => {
      active = false;
    };
  }, [filterValue, groupBy]);

  return (
    <div className="
      bg-white
      border
      border-gray-200
      rounded-3xl
      shadow-sm
      overflow-hidden
    ">

      {/* HEADER */}
      <div className="p-4 sm:p-5 border-b border-gray-100">

        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-4
        ">

          {/* TITLE */}
          <div>
            <h2 className="text-[22px] font-bold text-gray-900">
              Hiệu quả thực đơn
            </h2>
          </div>

          {/* ACTIONS */}
          <div className="
            flex
            flex-wrap
            items-center
            gap-3
          ">

            {/* TOGGLE */}
            <div className="
              bg-gray-100
              rounded-2xl
              p-1
              flex
              items-center
            ">

              <button
                onClick={() => setViewType("Theo nhóm")}
                className={`
                  px-4
                  h-10
                  rounded-xl
                  text-sm
                  font-medium
                  transition

                  ${viewType === "Theo nhóm"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                  }
                `}
              >
                Theo nhóm
              </button>

              <button
                onClick={() => setViewType("Theo loại")}
                className={`
                  px-4
                  h-10
                  rounded-xl
                  text-sm
                  font-medium
                  transition

                  ${viewType === "Theo loại"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                  }
                `}
              >
                Theo loại
              </button>

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
                  border-gray-200
                  bg-white
                  hover:bg-gray-50
                  transition-all
                  flex
                  items-center
                  gap-2
                  text-[15px]
                  font-medium
                  text-gray-700
                  min-w-[150px]
                  justify-between
                "
              >
                {filter}

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
                  border
                  border-gray-200
                  shadow-2xl
                  overflow-hidden
                  z-50
                ">

                  {filterOptions.map((item) => (

                    <button
                      key={item.value}
                      onClick={() => {
                        setFilter(item.label);
                        setOpen(false);
                      }}
                      className={`
                        w-full
                        px-4
                        py-3
                        text-left
                        text-sm
                        transition

                        ${filter === item.label
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {item.label}
                    </button>

                  ))}

                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mt-6
        ">

          {/* ITEM */}
          <div className="flex items-start gap-4">

            <div className="text-[42px]">
              🍴
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-700 font-medium">
                Giá trị trung bình/món
                <Info size={16} className="text-gray-400" />
              </div>

              <div className="text-[34px] font-bold text-black mt-1">
                {formatCompactCurrency(summary.averagePerItem)}
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="flex items-start gap-4">

            <div className="text-[42px]">
              🍔
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-700 font-medium">
                Giá trị trung bình/đồ ăn
                <Info size={16} className="text-gray-400" />
              </div>

              <div className="text-[34px] font-bold text-black mt-1">
                {formatCompactCurrency(summary.averageFood)}
              </div>
            </div>
          </div>

          {/* ITEM */}
          <div className="flex items-start gap-4">

            <div className="text-[42px]">
              🥤
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-700 font-medium">
                Giá trị trung bình/đồ uống
                <Info size={16} className="text-gray-400" />
              </div>

              <div className="text-[34px] font-bold text-black mt-1">
                {formatCompactCurrency(summary.averageDrink)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
      ">

        {/* LEFT */}
        <div className="
          p-5
          border-b
          xl:border-b-0
          xl:border-r
          border-gray-200
        ">

          <h3 className="text-[20px] font-semibold text-gray-900 mb-5">
            {viewType === "Theo nhóm" ? "Nhóm thực đơn" : "Loại thực đơn"}
          </h3>

          <div className="
            h-[350px]
            flex
            flex-col
            items-center
            justify-center
          ">

            <div className="w-[260px]">

              <Doughnut
                data={{
                  labels: categoryData.map((item) => item.name),

                  datasets: [
                    {
                      data: categoryData.map((item) => item.percentage || 0),

                      backgroundColor: [
                        "#1677ff",
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444",
                      ],

                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "68%",

                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>

            <p className="mt-6 text-gray-600 text-center">
              {loading ? "Đang tải dữ liệu..." : error || "Doanh thu theo nhóm món"}
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="p-5">

          <div className="
            flex
            items-center
            justify-between
            gap-3
            mb-5
          ">

            <h3 className="text-[20px] font-semibold text-gray-900">
              {viewType === "Theo nhóm" ? "Chi tiết từng nhóm thực đơn" : "Chi tiết từng loại thực đơn"}
            </h3>

            <button className="
              h-11
              px-4
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              text-gray-600
              text-sm
              flex
              items-center
              gap-2
            ">
              Chọn loại
              <ChevronDown size={16} />
            </button>
          </div>

          {/* TABLE */}
          <div className="
            overflow-x-auto
            rounded-2xl
            border
            border-gray-200
          ">

            <table className="w-full min-w-[650px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    STT
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Tên nhóm/loại
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
                    Số lượng
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700">
                    Doanh thu
                  </th>

                </tr>

              </thead>

              <tbody>

                {categoryData.map((item, index) => (

                  <tr
                    key={item.id || item.name || index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">

                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>

                    </td>

                    <td className="px-4 py-4 text-center font-medium text-blue-600">
                      {item.quantity || 0}
                    </td>

                    <td className="px-4 py-4 text-right font-semibold text-green-600">
                      {formatCurrency(item.revenue)}đ
                    </td>

                  </tr>

                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}