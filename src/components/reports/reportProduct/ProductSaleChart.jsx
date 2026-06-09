import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { reportApi } from "../../../api";

const colors1 = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const colors2 = [
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#CA8A04",
];

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const unwrapData = (response) => response?.data?.data || response?.data || response || {};

export default function ProductSaleChart({ fromDate, toDate, branch, branchId }) {
  const [topSelling, setTopSelling] = useState([]);
  const [lowSelling, setLowSelling] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, branchId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch top and bottom products in parallel
      const [topData, bottomData, revenueData] = await Promise.all([
        reportApi.getTopProducts(fromDate, toDate, branchId),
        reportApi.getBottomProducts(fromDate, toDate, branchId),
        reportApi.getRevenue(fromDate, toDate, branchId),
      ]);

      // Map to chart format
      const topItems = unwrapData(topData);
      const bottomItems = unwrapData(bottomData);

      const mappedTop = (Array.isArray(topItems) ? topItems : []).map(item => ({
        name: item.productName,
        value: item.totalQuantity,
      }));

      const mappedBottom = (Array.isArray(bottomItems) ? bottomItems : []).map(item => ({
        name: item.productName,
        value: item.totalQuantity,
      }));

      setTopSelling(mappedTop);
      setLowSelling(mappedBottom);
      setSummary(unwrapData(revenueData));
    } catch (error) {
      toast.error("Không thể tải dữ liệu biểu đồ");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };   

  const soldQuantity = topSelling.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (

    <div className="bg-white min-w-[1600px]">

      {/* HEADER */}
      <div className="border-b border-gray-300 px-10 pt-10 pb-7">

        <h1 className="text-[34px] font-bold text-center text-[#1E293B]">
          Biểu đồ bán hàng
        </h1>

        <div className="text-center mt-3 text-[18px] text-gray-600">
          {branch || ""}
        </div>

        <div className="text-center mt-1 text-[16px] text-gray-500">
          Từ {formatDate(fromDate)} - Đến {formatDate(toDate)}
        </div>

      </div>

      {/* BODY */}
      <div className="p-10">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {[
            {
              title: "Doanh thu",
              value: formatMoney(summary?.totalRevenue || summary?.netRevenue),
              icon: Wallet,
            },

            {
              title: "Đơn hàng",
              value: Number(summary?.orderCount || 0).toLocaleString("vi-VN"),
              icon: ShoppingBag,
            },

            {
              title: "Sản phẩm bán",
              value: soldQuantity.toLocaleString("vi-VN"),
              icon: BarChart3,
            },

            {
              title: "Tăng trưởng",
              value: "N/A",
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
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Đang tải dữ liệu biểu đồ...
          </div>
        ) : (
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
        )}

      </div>

    </div>

  );
}
