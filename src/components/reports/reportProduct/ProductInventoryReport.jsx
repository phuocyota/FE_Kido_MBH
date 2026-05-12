import React from "react";

export default function ProductInventoryReport() {

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
          Báo cáo xuất nhập tồn
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
          Nội dung báo cáo xuất nhập tồn
        </div>

      </div>

    </div>

  );
}