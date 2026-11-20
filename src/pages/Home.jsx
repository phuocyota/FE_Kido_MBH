import React from "react";
import { authApi } from "../api";
import Summary from "../components/Home/Summary";
import SalesChart from "../components/Home/SalesChart";
// import TopProducts from "../components/Home/TopProducts";
import MenuPerformance from "../components/Home/MenuPerformance";
import StaffAndCancelReport from "../components/Home/StaffAndCancelReport";

export default function Home() {
  return (
    <div className="erp-page">

      {/* CONTAINER */}
      <div className="erp-content space-y-4">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-5 py-6 text-white shadow-lg shadow-blue-900/10 sm:px-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-[13px] font-medium text-blue-100">
              Xin chào, {authApi.getUserInfo()?.fullName || "Admin"} 👋
            </p>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight sm:text-[26px]">Tổng quan kinh doanh</h1>
            <p className="mt-1 text-sm text-blue-100/90">
              Theo dõi doanh thu, đơn hàng và hiệu suất bán hàng hôm nay
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <Summary />

        {/* MAIN CONTENT */}
        <div className="space-y-4">

          {/* SALES CHART */}
          
            <SalesChart />

            <MenuPerformance />

            <StaffAndCancelReport />         

         
        </div>

      </div>
    </div>
  );
}