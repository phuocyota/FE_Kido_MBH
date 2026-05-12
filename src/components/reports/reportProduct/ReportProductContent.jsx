import React from "react";

import {
  BarChart3,
  TrendingUp,
  Package,
  Trash2,
} from "lucide-react";

export default function ReportProductContent({
  viewType,
  interest,
}) {

  // ===== DATA =====
  const reportData = {
    "Bán hàng": {
      title: "Báo cáo bán hàng",
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600",
      chart: true,
    },

    "Lợi nhuận ": {
      title: "Báo cáo lợi nhuận",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      chart: false,
    },

    "Xuất nhập tồn": {
      title: "Báo cáo xuất nhập tồn",
      icon: Package,
      color: "bg-orange-100 text-orange-600",
      chart: false,
    },

    "Xuất hủy": {
      title: "Báo cáo xuất hủy",
      icon: Trash2,
      color: "bg-red-100 text-red-600",
      chart: false,
    },
  };

  const current =
    reportData[interest] ||
    reportData["Bán hàng"];

  const Icon = current.icon;

  return (
    <div
      className="
        bg-[#F8FAFC]
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
        min-h-[80vh]
      "
    >

      {/* HEADER */}
      <div
        className="
          bg-white
          border-b
          border-gray-200
          px-8
          py-7
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
              mb-2
            "
          >
            {current.title}
          </h1>

          <p className="text-gray-500">
            Trường tiểu học ABC
          </p>

        </div>

        <div
          className={`
            w-20
            h-20
            rounded-3xl
            flex
            items-center
            justify-center
            ${current.color}
          `}
        >

          <Icon size={40} />

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-8">

        {/* ===== BÁN HÀNG ===== */}
        {current.chart ? (

          <>

            {/* CARD */}
            <div
              className="
                grid
                grid-cols-4
                gap-5
                mb-8
              "
            >

              {[
                {
                  title: "Doanh thu",
                  value: "12.500.000đ",
                },

                {
                  title: "Đơn hàng",
                  value: "245",
                },

                {
                  title: "Sản phẩm bán",
                  value: "1.245",
                },

                {
                  title: "Lợi nhuận",
                  value: "4.200.000đ",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    p-5
                  "
                >

                  <div
                    className="
                      text-gray-500
                      text-sm
                      mb-2
                    "
                  >
                    {item.title}
                  </div>

                  <div
                    className="
                      text-2xl
                      font-bold
                      text-gray-800
                    "
                  >
                    {item.value}
                  </div>

                </div>

              ))}

            </div>

            {/* CHART */}
            <div
              className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                h-[450px]
                flex
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <BarChart3
                  size={70}
                  className="
                    mx-auto
                    mb-5
                    text-blue-500
                  "
                />

                <div
                  className="
                    text-2xl
                    font-bold
                    text-gray-700
                    mb-2
                  "
                >
                  Biểu đồ bán hàng
                </div>

                <div className="text-gray-500">
                  Hiển thị doanh thu theo thời gian
                </div>

              </div>

            </div>

          </>

        ) : (

          /* ===== CÁC BÁO CÁO KHÁC ===== */
          <div
            className="
              bg-white
              rounded-3xl
              border
              border-gray-200
              overflow-hidden
            "
          >

            <table className="w-full">

              <thead>

                <tr className="bg-[#D8EEF8]">

                  {[
                    "Ngày",
                    "Mã SP",
                    "Tên sản phẩm",
                    "Số lượng",
                    "Giá",
                    "Tổng",
                  ].map((item) => (

                    <th
                      key={item}
                      className="
                        px-5
                        py-4
                        text-center
                        font-bold
                        text-gray-800
                        border
                        border-gray-200
                      "
                    >
                      {item}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {[
                  {
                    date: "07/05/2026",
                    code: "SP001",
                    name: "Bánh snack",
                    quantity: 5,
                    price: "10,000",
                    total: "50,000",
                  },

                  {
                    date: "07/05/2026",
                    code: "SP002",
                    name: "Nước suối",
                    quantity: 10,
                    price: "10,000",
                    total: "100,000",
                  },

                  {
                    date: "07/05/2026",
                    code: "SP003",
                    name: "Kẹo mút",
                    quantity: 20,
                    price: "5,000",
                    total: "100,000",
                  },
                ].map((item, index) => (

                  <tr key={index}>

                    <td className="report-td">
                      {item.date}
                    </td>

                    <td className="report-td">
                      {item.code}
                    </td>

                    <td className="report-td">
                      {item.name}
                    </td>

                    <td className="report-td">
                      {item.quantity}
                    </td>

                    <td className="report-td">
                      {item.price}
                    </td>

                    <td className="report-td">
                      {item.total}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}
      </div>
    </div>
  );
}