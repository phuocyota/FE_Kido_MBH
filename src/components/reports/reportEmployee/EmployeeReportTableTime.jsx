import React from "react";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

export default function EmployeeReportTableTime({ rows = [], reportData }) {
  return (
    <div className="w-[1123px] min-h-[794px] bg-white p-2">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>Ngày lập: {new Date().toLocaleString("vi-VN")}</span>
        </div>
        <h1 className="text-center text-[20px] font-bold text-gray-900">Báo cáo bán hàng theo nhân viên</h1>
        <div className="text-center text-sm text-gray-700 mt-2">
          Từ ngày {reportData?.from ? new Date(reportData.from).toLocaleDateString("vi-VN") : ""} đến ngày{" "}
          {reportData?.to ? new Date(reportData.to).toLocaleDateString("vi-VN") : ""}
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-200 border border-sky-300">
            <th className="p-3 text-left font-semibold">Thu ngân</th>
            <th className="p-3 text-center font-semibold">SL Đơn bán</th>
            <th className="p-3 text-right font-semibold">Tổng tiền hàng</th>
            <th className="p-3 text-right font-semibold">Giảm giá HĐ</th>
            <th className="p-3 text-right font-semibold">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="bg-[#f6f1d9]">
              <td colSpan={5} className="p-3 text-center italic text-gray-600">
                Báo cáo không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id} className="border border-gray-300">
                <td className="p-3 text-left">{item.employee}</td>
                <td className="p-3 text-center">{item.orders}</td>
                <td className="p-3 text-right tabular-nums">{formatMoney(item.totalAmount)}</td>
                <td className="p-3 text-right tabular-nums">{formatMoney(item.discount)}</td>
                <td className="p-3 text-right font-medium tabular-nums">{formatMoney(item.revenue)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
