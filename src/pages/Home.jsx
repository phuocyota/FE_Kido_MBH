import React from "react";
import Summary from "../components/Home/Summary";
import SalesChart from "../components/Home/SalesChart";
import TopProducts from "../components/Home/TopProducts";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f5f7]">

      {/* CONTAINER */}
      <div className="
        w-full
        max-w-[1600px]
        mx-auto
        px-3
        sm:px-4
        lg:px-5
        py-4
        space-y-4
      ">

        {/* HEADER */}
        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
        ">

          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900">
              Tổng quan kinh doanh
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Theo dõi doanh thu, đơn hàng và hiệu suất bán hàng hôm nay
            </p>
          </div>

           
        </div>

        {/* SUMMARY */}
        <Summary />

        {/* MAIN CONTENT */}
        <div className="space-y-4">

          {/* SALES CHART */}
          <div >
            <SalesChart />
          </div>

          {/* TOP PRODUCTS */}
          <div className="
            bg-white
            rounded-3xl
            border
            border-gray-200
            shadow-sm
            overflow-hidden
          ">
            <TopProducts />
          </div>

        </div>

      </div>
    </div>
  );
}