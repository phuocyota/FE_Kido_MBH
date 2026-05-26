import React from "react";

import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  topSelling,
  lowSelling,
  colors1,
  colors2,
} from "../../../datas/productSaleData";

export default function ProductSaleChart() {   

  return (

    <div className="bg-white min-w-[1600px]">

      {/* HEADER */}
      <div className="border-b border-gray-300 px-10 pt-10 pb-7">

        <h1 className="text-[34px] font-bold text-center text-[#1E293B]">
          Biểu đồ bán hàng
        </h1>

        <div className="text-center mt-3 text-[18px] text-gray-600">
          Chi nhánh trung tâm
        </div>

        <div className="text-center mt-1 text-[16px] text-gray-500">
          Từ 07/05/2026 - Đến 07/05/2026
        </div>

      </div>

      {/* BODY */}
      <div className="p-10">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {[
            {
              title: "Doanh thu",
              value: "25.500.000đ",
              icon: Wallet,
            },

            {
              title: "Đơn hàng",
              value: "245",
              icon: ShoppingBag,
            },

            {
              title: "Sản phẩm bán",
              value: "1.250",
              icon: BarChart3,
            },

            {
              title: "Tăng trưởng",
              value: "+15%",
              icon: TrendingUp,
            },
          ].map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 p-6 bg-white shadow-sm"
              >

                <div className="flex items-center justify-between mb-5">

                  <div className="text-gray-500 text-sm">
                    {item.title}
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <Icon
                      size={24}
                      className="text-blue-600"
                    />

                  </div>

                </div>

                <div className="text-3xl font-bold text-gray-800">
                  {item.value}
                </div>

              </div>

            );
          })}

        </div>

        {/* PIE CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* TOP SELLING */}
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-[28px] font-bold text-[#1E293B]">
                  Món tiêu thụ nhiều
                </h2>

                <div className="text-gray-500 mt-2">
                  Các sản phẩm bán chạy cần nhập thêm hàng
                </div>

              </div>

              <div className="bg-green-100 text-green-700 px-5 py-2 rounded-2xl font-semibold">
                Top Selling
              </div>

            </div>

            <div className="h-[420px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={topSelling}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >

                    {topSelling.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={colors1[index % colors1.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* LOW SELLING */}
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-[28px] font-bold text-[#1E293B]">
                  Món tiêu thụ ít
                </h2>

                <div className="text-gray-500 mt-2">
                  Các sản phẩm tồn kho cao cần hạn chế nhập
                </div>

              </div>

              <div className="bg-red-100 text-red-700 px-5 py-2 rounded-2xl font-semibold">
                Low Selling
              </div>

            </div>

            <div className="h-[420px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={lowSelling}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >

                    {lowSelling.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={colors2[index % colors2.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}