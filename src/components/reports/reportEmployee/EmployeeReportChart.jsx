import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

export default function EmployeeReportChart({ rows = [] }) {
  return (
    <div className="w-[1123px] h-[794px] bg-white p-8">
      <div className="mb-8">
        <div className="text-center text-sm text-gray-500">CÔNG TY TNHH KIDO EDU</div>
        <h1 className="text-center text-2xl font-bold text-gray-800 mt-2">BÁO CÁO NHÂN VIÊN</h1>
        <div className="text-center text-sm text-gray-500 mt-2">
          Ngày in: {new Date().toLocaleDateString("vi-VN")}
        </div>
        <h2 className="text-center text-lg font-medium text-gray-700 mt-5">
          Top 10 người bán nhiều nhất
        </h2>
      </div>

      <div className="h-[650px]">
        {rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Báo cáo không có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 20, right: 120, left: 20, bottom: 20 }}
            >
              <CartesianGrid stroke="#d1d5db" vertical horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => (value === 0 ? "0" : `${Math.round(value / 1000000)}Tr`)}
                tick={{ fontSize: 13 }}
              />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 14, fill: "#374151" }} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="revenue" fill="#1976F3" barSize={34}>
                <LabelList
                  position="right"
                  formatter={(value) => `${formatMoney(value)}  `}
                  style={{ fill: "#1976F3", fontSize: 14 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
