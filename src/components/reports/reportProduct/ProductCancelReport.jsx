import React from "react";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "";

export default function ProductCancelReport({ fromDate, toDate, branch }) {

  return (

    <div className="w-full h-full bg-white">

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
          Báo cáo xuất hủy
        </h1>

        <div
          className="
            text-center
            mt-3
            text-[18px]
            text-gray-600
          "
        >
          {branch || ""}
        </div>

        <div
          className="
            text-center
            mt-1
            text-[16px]
            text-gray-500
          "
        >
          Từ {formatDate(fromDate)} - Đến {formatDate(toDate)}
        </div>

      </div>

      {/* BODY */}
      <div className="p-10">

        <div
          className="
            h-[500px]
            rounded-3xl
            border
            border-dashed
            border-gray-300
            flex
            items-center
            justify-center
            text-gray-400
            text-2xl
            font-semibold
          "
        >
          Nội dung báo cáo xuất hủy
        </div>

      </div>

    </div>

  );
}
