import React from "react";
import employeeProfitReportData from "../../../datas/employeeProfitReportData";

const formatMoney = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export default function EmployeeProfitReport({
  viewType,
}) {
  const hasData = employeeProfitReportData.length > 0;

const isHorizontal = viewType === "horizontal";
console.log("viewType =", viewType);
console.log("isHorizontal =", isHorizontal);
  const totalPurchase =
    employeeProfitReportData.reduce(
      (sum, item) =>
        sum + item.totalPurchase,
      0
    );

  const totalDiscount =
    employeeProfitReportData.reduce(
      (sum, item) =>
        sum + item.discount,
      0
    );

  const totalRevenue =
    employeeProfitReportData.reduce(
      (sum, item) =>
        sum + item.revenue,
      0
    );

  const totalCost =
    employeeProfitReportData.reduce(
      (sum, item) =>
        sum + item.cost,
      0
    );

  const totalProfit =
    employeeProfitReportData.reduce(
      (sum, item) =>
        sum + item.profit,
      0
    );

  return (
    
    <div
  className={`
    bg-white p-3
    ${
      isHorizontal
        ? "w-[1123px] min-h-[794px]"
        : "w-[794px] min-h-[1123px]" 
    }
  `}
>

      {/* HEADER */}
      <div className="mb-8">
        

        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>
            Ngày lập:
            {new Date().toLocaleDateString(
              "vi-VN"
            )}{" "}
            {new Date().toLocaleTimeString(
              "vi-VN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>
        </div>

        <h1 className="text-center text-[20px] font-bold text-gray-900">
          Báo cáo lợi nhuận theo nhân viên
        </h1>

        <div className="text-center text-sm text-gray-700 mt-2">
          Từ ngày 08/06/2026 đến ngày
          14/06/2026
        </div>

        <div className="text-center text-sm text-gray-700 mt-1">
          Chi nhánh: Chi nhánh trung tâm
        </div>

      </div>

      {/* TABLE */}
      <table className="w-full table-fixed border-collapse text-sm">

        <thead>

          <tr className="bg-sky-200 border border-sky-300">

            <th className="w-[20%] p-3 text-left">
              Thu ngân
            </th>

            <th className="w-[16%] p-3 text-right">
              Tổng tiền hàng
            </th>

            <th className="w-[14%] p-3 text-right">
              Giảm giá HĐ
            </th>

            <th className="w-[16%] p-3 text-right">
              Doanh thu
            </th>

            <th className="w-[16%] p-3 text-right">
              Tổng giá vốn
            </th>

            <th className="w-[18%] p-3 text-right">
              Lợi nhuận gộp
            </th>

          </tr>

        </thead>

        <tbody>

          {hasData ? (

            employeeProfitReportData.map(
              (item) => (

                <tr
                  key={item.id}
                  className="border border-gray-300 hover:bg-blue-50"
                >

                  <td className="p-3">
                    {item.employee}
                  </td>

                  <td className="p-3 text-right">
                    {formatMoney(
                      item.totalPurchase
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {formatMoney(
                      item.discount
                    )}
                  </td>

                  <td className="p-3 text-right font-medium">
                    {formatMoney(
                      item.revenue
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {formatMoney(
                      item.cost
                    )}
                  </td>

                  <td className="p-3 text-right font-semibold text-green-700">
                    {formatMoney(
                      item.profit
                    )}
                  </td>

                </tr>
              )
            )

          ) : (

            <tr className="bg-[#f6f1d9]">

              <td
                colSpan={6}
                className="p-3 text-center italic text-gray-600"
              >
                Báo cáo không có dữ liệu
              </td>

            </tr>

          )}

        </tbody>

        {hasData && (

          <tfoot>

            <tr className="bg-blue-50 font-bold border border-gray-300">

              <td className="p-3">
                Tổng cộng
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalPurchase
                )}
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalDiscount
                )}
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalRevenue
                )}
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalCost
                )}
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalProfit
                )}
              </td>

            </tr>

          </tfoot>

        )}

      </table>

    </div>
  );
}