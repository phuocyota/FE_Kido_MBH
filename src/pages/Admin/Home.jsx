import React from "react";
import Summary from "../../components/Home/Summary";
import SalesChart from "../../components/Home/SalesChart";
import TopProducts from "../../components/Home/TopProducts";
import RecentActivities from "../../components/Home/RecentActivities";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-4 space-y-4">

        {/* SUMMARY */}
        <Summary />
        {/* MAIN */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            <SalesChart />
            <TopProducts />
          </div>
          {/* RIGHT */}
          <div className="space-y-4">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
}