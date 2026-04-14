import React from "react";
import ParentLeft from "../../components/Parent/ParentLeft";
import { Outlet } from "react-router-dom";

export default function ParentLayout() {
  return (
    <div className="h-screen bg-gray-100 p-10">

      <div className="h-full flex gap-4">

        {/* LEFT */}
        <ParentLeft />

        {/* RIGHT */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-auto">
          <Outlet />
        </div>

      </div>

    </div>
  );
}