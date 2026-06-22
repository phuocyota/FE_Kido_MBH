import React from "react";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

export default function EmployeeCashierReport({ viewType, rows = [], reportData }) {
  const isHorizontal = viewType === "horizontal";
  const totalQuantity = rows.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalRevenue = rows.reduce((sum, item) => sum + Number(item.revenue || 0), 0);

  return (
    <div className={`bg-white p-3 ${isHorizontal ? "w-[1123px] min-h-[794px]" : "w-[794px] min-h-[1123px]"}`}>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Ngày lập: {new Date().toLocaleString("vi-VN")}</span>
        </div>
        <h1 className="text-center text-[20px] font-bold mt-2">
          Báo cáo danh sách hàng bán theo nhân viên thu ngân
        </h1>
        <div className="text-center text-sm mt-2">
          Từ ngày {reportData?.from ? new Date(reportData.from).toLocaleDateString("vi-VN") : ""} đến ngày{" "}
          {reportData?.to ? new Date(reportData.to).toLocaleDateString("vi-VN") : ""}
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-200 border border-sky-300">
            <th className="w-[50%] p-3 text-left">Thu ngân</th>
            <th className="w-[20%] p-3 text-right">SL Bán</th>
            <th className="w-[30%] p-3 text-right">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="bg-[#f6f1d9]">
              <td colSpan={3} className="p-3 text-center italic">
                Báo cáo không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id} className="border border-gray-300">
                <td className="p-3">{item.employee}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{formatMoney(item.revenue)}</td>
              </tr>
            ))
          )}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <tr className="bg-blue-50 font-bold border border-gray-300">
              <td className="p-3">Tổng cộng</td>
              <td className="p-3 text-right">{totalQuantity}</td>
              <td className="p-3 text-right">{formatMoney(totalRevenue)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
