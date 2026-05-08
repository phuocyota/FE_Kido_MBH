import React from "react";

import {
  BarChart3,
} from "lucide-react";

export default function ReportProductContent({
  viewType,
  interest,
}) {

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm

        h-[80vh]

        flex
        items-center
        justify-center
      "
    >

      <div className="text-center">

        <div
          className="
            w-20
            h-20
            rounded-full
            bg-blue-50

            flex
            items-center
            justify-center

            mx-auto
            mb-5
          "
        >
          <BarChart3
            size={40}
            className="text-blue-600"
          />
        </div>

        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
            mb-3
          "
        >
          {interest === "Hủy món"
            ? "Báo cáo hủy món"
            : "Báo cáo bán hàng"}
        </h2>

        <div
          className="
            text-gray-500
            text-lg
          "
        >
          Chưa có dữ liệu
        </div>

      </div>
    </div>
  );
}