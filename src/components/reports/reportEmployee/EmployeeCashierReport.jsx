import React from "react";
import employeeCashierReportData from "../../../datas/employeeCashierReportData";

const formatMoney = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export default function EmployeeCashierReport({
  viewType,
}) {
  const isHorizontal =
    viewType === "horizontal";

  const hasData =
    employeeCashierReportData.length > 0;

  const totalQuantity =
    employeeCashierReportData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  const totalRevenue =
    employeeCashierReportData.reduce(
      (sum, item) => sum + item.revenue,
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
        <div className="flex justify-between text-sm text-gray-700">
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

        <h1 className="text-center text-[20px] font-bold mt-2">
          Báo cáo danh sách hàng bán theo
          nhân viên thu ngân
        </h1>

        <div className="text-center text-sm mt-2">
          Từ ngày 08/06/2026 đến ngày
          14/06/2026
        </div>

        <div className="text-center text-sm mt-1">
          Chi nhánh: Chi nhánh trung tâm
        </div>

        <div className="text-right italic text-sm mt-6">
          (Đã phân bổ giảm giá hóa đơn,
          giảm giá phiếu trả)
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-200 border border-sky-300">
            <th className="w-[50%] p-3 text-left">
              Thu ngân
            </th>

            <th className="w-[20%] p-3 text-right">
              SL Bán
            </th>

            <th className="w-[30%] p-3 text-right">
              Doanh thu
            </th>
          </tr>
        </thead>

        <tbody>
          {hasData ? (
            employeeCashierReportData.map(
              (item) => (
                <tr
                  key={item.id}
                  className="border border-gray-300"
                >
                  <td className="p-3">
                    {item.employee}
                  </td>

                  <td className="p-3 text-right">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-right">
                    {formatMoney(
                      item.revenue
                    )}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr className="bg-[#f6f1d9]">
              <td
                colSpan={3}
                className="p-3 text-center italic"
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
                {totalQuantity}
              </td>

              <td className="p-3 text-right">
                {formatMoney(
                  totalRevenue
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}