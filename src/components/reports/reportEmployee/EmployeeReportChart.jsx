import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

import employeeChartData from "../../../datas/employeeChartData";

const formatMoney = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export default function EmployeeReportChart() {
  return (
    <div className="w-[1123px] h-[794px] bg-white p-8">
      {/* TITLE */}
     <div className="mb-8">
  <div className="text-center text-sm text-gray-500">
    CÔNG TY TNHH ABC
  </div>

  <h1 className="text-center text-2xl font-bold text-gray-800 mt-2">
    BÁO CÁO NHÂN VIÊN
  </h1>

  <div className="text-center text-sm text-gray-500 mt-2">
    Ngày in: {new Date().toLocaleDateString("vi-VN")}
  </div>

  <h2 className="text-center text-lg font-medium text-gray-700 mt-5">
    Top 10 người bán nhiều nhất (đã trừ trả hàng)
  </h2>
</div>

      {/* CHART */}
      <div className="h-[650px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={employeeChartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 120,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              stroke="#d1d5db"
              vertical
              horizontal={false}
            />

            <XAxis
              type="number"
              tickFormatter={(value) =>
                value === 0
                  ? "0"
                  : `${Math.round(
                      value / 1000000
                    )}Tr`
              }
              tick={{
                fontSize: 13,
              }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{
                fontSize: 14,
                fill: "#374151",
              }}
            />

            <Tooltip
              formatter={(value) =>
                formatMoney(value)
              }
            />

            <Bar
              dataKey="revenue"
              fill="#1976F3"
              barSize={34}
            >
              <LabelList
                position="right"
                formatter={(value, entry) =>
                  `${formatMoney(
                    value
                  )}  `
                }
                style={{
                  fill: "#1976F3",
                  fontSize: 14,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}