import React from "react";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

export default function EmployeeProfitReport({ viewType, rows = [], reportData }) {
  const isHorizontal = viewType === "horizontal";
  const totals = rows.reduce(
    (sum, item) => ({
      totalPurchase: sum.totalPurchase + Number(item.totalPurchase || 0),
      discount: sum.discount + Number(item.discount || 0),
      revenue: sum.revenue + Number(item.revenue || 0),
      cost: sum.cost + Number(item.cost || 0),
      profit: sum.profit + Number(item.profit || 0),
    }),
    { totalPurchase: 0, discount: 0, revenue: 0, cost: 0, profit: 0 }
  );

  return (
    <div className={`bg-white p-3 ${isHorizontal ? "w-[1123px] min-h-[794px]" : "w-[794px] min-h-[1123px]"}`}>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>Ngày lập: {new Date().toLocaleString("vi-VN")}</span>
        </div>
        <h1 className="text-center text-[20px] font-bold text-gray-900">Báo cáo lợi nhuận theo nhân viên</h1>
        <div className="text-center text-sm text-gray-700 mt-2">
          Từ ngày {reportData?.from ? new Date(reportData.from).toLocaleDateString("vi-VN") : ""} đến ngày{" "}
          {reportData?.to ? new Date(reportData.to).toLocaleDateString("vi-VN") : ""}
        </div>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-sky-200 border border-sky-300">
            <th className="w-[20%] p-3 text-left">Thu ngân</th>
            <th className="w-[16%] p-3 text-right">Tổng tiền hàng</th>
            <th className="w-[14%] p-3 text-right">Giảm giá HĐ</th>
            <th className="w-[16%] p-3 text-right">Doanh thu</th>
            <th className="w-[16%] p-3 text-right">Tổng giá vốn</th>
            <th className="w-[18%] p-3 text-right">Lợi nhuận gộp</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="bg-[#f6f1d9]">
              <td colSpan={6} className="p-3 text-center italic text-gray-600">
                Báo cáo không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id} className="border border-gray-300 hover:bg-blue-50">
                <td className="p-3">{item.employee}</td>
                <td className="p-3 text-right">{formatMoney(item.totalPurchase)}</td>
                <td className="p-3 text-right">{formatMoney(item.discount)}</td>
                <td className="p-3 text-right font-medium">{formatMoney(item.revenue)}</td>
                <td className="p-3 text-right">{formatMoney(item.cost)}</td>
                <td className="p-3 text-right font-semibold text-green-700">{formatMoney(item.profit)}</td>
              </tr>
            ))
          )}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <tr className="bg-blue-50 font-bold border border-gray-300">
              <td className="p-3">Tổng cộng</td>
              <td className="p-3 text-right">{formatMoney(totals.totalPurchase)}</td>
              <td className="p-3 text-right">{formatMoney(totals.discount)}</td>
              <td className="p-3 text-right">{formatMoney(totals.revenue)}</td>
              <td className="p-3 text-right">{formatMoney(totals.cost)}</td>
              <td className="p-3 text-right">{formatMoney(totals.profit)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
