import React from "react";

import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Wallet,
} from "lucide-react";

export default function ProductSaleChart() {

  return (

    <div className="bg-white">

      {/* HEADER */}
      <div
        className="
          border-b
          border-gray-300
          px-10
          pt-10
          pb-7
        "
      >

        <h1
          className="
            text-[34px]
            font-bold
            text-center
            text-[#1E293B]
          "
        >
          Biểu đồ bán hàng
        </h1>

        <div
          className="
            text-center
            mt-3
            text-[18px]
            text-gray-600
          "
        >
          Chi nhánh trung tâm
        </div>

        <div
          className="
            text-center
            mt-1
            text-[16px]
            text-gray-500
          "
        >
          Từ 07/05/2026 - Đến 07/05/2026
        </div>

      </div>

      {/* BODY */}
      <div className="p-10">

        {/* KPI */}
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-5
            mb-10
          "
        >

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
                className="
                  rounded-3xl
                  border
                  border-gray-200
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  "
                >

                  <div
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    {item.title}
                  </div>

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <Icon
                      size={24}
                      className="text-blue-600"
                    />

                  </div>

                </div>

                <div
                  className="
                    text-3xl
                    font-bold
                    text-gray-800
                  "
                >
                  {item.value}
                </div>

              </div>

            );
          })}

        </div>

        {/* CHART */}
        <div
          className="
            h-[500px]
            rounded-[32px]
            border
            border-gray-200
            flex
            items-center
            justify-center
            bg-[#F8FAFC]
          "
        >

          <div className="text-center">

            <BarChart3
              size={80}
              className="
                mx-auto
                mb-5
                text-blue-500
              "
            />

            <div
              className="
                text-3xl
                font-bold
                text-gray-700
                mb-3
              "
            >
              Khu vực biểu đồ doanh thu
            </div>

            <div
              className="
                text-gray-500
                text-lg
              "
            >
              Hiển thị thống kê bán hàng theo thời gian
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}