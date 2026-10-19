import React, { useState, useEffect, useCallback, useRef } from "react";
import { unwrapProductReport, filterProductReportRows, validateReportDates } from "./productReportData";
import { reportApi } from "../../../api";

const formatMoney = (value) => Number(value || 0).toLocaleString("vi-VN");

const getMonthLabel = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

export default function ProductInventoryReport({ fromDate, toDate, branchId, branch, ...filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    elapsedDays: 0,
    revenue: 0,
  });

  const requestId = useRef(0);
  const [error, setError] = useState("");
  const fetchInventory = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      validateReportDates(fromDate, toDate);
      const [inventoryResponse, revenueResponse, planResponse] = await Promise.all([
        reportApi.getInventory(branchId),
        reportApi.getRevenue(fromDate, toDate, branchId),
        reportApi.getMonthlyOrderPlan(null, fromDate, toDate, branchId),
      ]);
      if (id !== requestId.current) return;
      const result = unwrapProductReport(inventoryResponse);
      const revenue = unwrapProductReport(revenueResponse);
      const inventoryItems = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : null;
      if (!inventoryItems)
        throw new Error("Dữ liệu báo cáo tồn kho không hợp lệ");
      const planByProduct = new Map((planResponse?.data || []).map(item => [item.productId, item]));
      // Map BE data to the existing common form.
      const mappedData = inventoryItems.map((item, index) => {
        const plan = planByProduct.get(item.productId);
        return ({
        productId: item.productId,
        categoryId: item.categoryId,
        productType: item.productType,
        stt: index + 1,
        group: item.group || plan?.group || "",
        code: item.code || item.inventoryItemId || "",
        name: item.name,
        unit: item.unit,
        value: item.value == null && item.totalValue == null ? "" : formatMoney(item.value ?? item.totalValue),
        stockStart: item.stockStart != null ? String(item.stockStart) : "",
        week1: item.week1 != null ? String(item.week1) : "",
        week2: item.week2 != null ? String(item.week2) : "",
        week3: item.week3 != null ? String(item.week3) : "",
        week4: item.week4 != null ? String(item.week4) : "",
        week5: item.week5 != null ? String(item.week5) : "",
        week6: item.week6 != null ? String(item.week6) : "",
        outside: item.outside != null ? String(item.outside) : "",
        totalImport: item.totalImport != null ? String(item.totalImport) : "",
        destroy1: "",
        destroy2: "",
        destroy3: "",
        destroy4: "",
        destroy5: "",
        stockEnd: String(item.quantity || 0),
        sale: plan ? String(plan.monthlyUsage) : "0",
        totalCost: item.totalCost == null ? "" : formatMoney(item.totalCost),
        usagePer: item.usagePerMil != null ? String(item.usagePerMil) : "",
        min: plan?.planSales?.min != null ? String(plan.planSales.min) : "",
        max: plan?.planSales?.max != null ? String(plan.planSales.max) : "",
        warning: item.quantity < 10 ? "Sắp hết hàng" : "",
        order:
          plan?.suggestedOrderQuantity != null
            ? String(plan.suggestedOrderQuantity)
            : "",
      });
      });
      setRows(mappedData);
      setSummary({
        elapsedDays:
          fromDate && toDate
            ? Math.max(
                1,
                Math.round((new Date(toDate) - new Date(fromDate)) / 86400000) +
                  1,
              )
            : 0,
        revenue: revenue.totalRevenue || revenue.netRevenue || 0,
      });
    } catch (error) {
      if (id !== requestId.current) return;
      setRows([]);
      setError(
        [
          error?.response?.data?.message ||
            error.message ||
            "Không thể tải báo cáo tồn kho",
        ]
          .flat()
          .join("\n"),
      );
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [fromDate, toDate, branchId]);
  useEffect(() => {
    fetchInventory();
    return () => {
      requestId.current += 1;
    };
  }, [fetchInventory]);

  const visibleRows = filterProductReportRows(rows, filters);

  if (error && !loading)
    return (
      <div role="alert" className="p-6 text-red-700">
        {error}{" "}
        <button
          type="button"
          onClick={fetchInventory}
          className="ml-3 underline"
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div
      aria-busy={loading}
      className="bg-white inline-block"
      style={{
        width: "3200px",
      }}
    >
      <div className="px-4 py-2 text-sm text-slate-600">{branch} · Từ {fromDate} đến {toDate} · Số tồn hiện tại khi tải báo cáo</div>
      {/* TOP */}
      <div className="grid grid-cols-12 border border-gray-400">
        {/* LEFT */}
        <div className="col-span-4 border-r border-gray-400">
          <div className="grid grid-cols-2">
            <div className="border-b border-r border-gray-400 p-2 font-semibold">
              Số ngày doanh thu tính đến hiện tại :
            </div>

            <div className="border-b border-gray-400 p-2 text-right">
              {summary.elapsedDays}
            </div>

            <div className="border-b border-r border-gray-400 p-2 text-red-600 font-bold">
              DOANH THU HIỆN TẠI TRONG THÁNG
            </div>

            <div className="border-b border-gray-400 p-2 text-right text-[22px] font-bold bg-[#DCE6F1]">
              {formatMoney(summary.revenue)}
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG SNACK :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              0
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG KẸO :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              0
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG NƯỚC :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              0
            </div>

            <div className="border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG KHÔ :
            </div>

            <div className="p-2 text-right font-bold text-[#1F4E79]">0</div>
          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-1 flex flex-col justify-end pb-2 gap-4">
          <div className="text-red-600 text-center">0%</div>

          <div className="text-red-600 text-center">0%</div>

          <div className="text-red-600 text-center">0%</div>

          <div className="text-red-600 text-center">0%</div>
        </div>

        {/* RIGHT */}
        <div className="col-span-7 flex flex-col items-center justify-center">
          <div className="text-[34px] font-bold">
            CHI PHÍ SỬ DỤNG HÀNG HÓA TRONG THÁNG
          </div>

          <div className="flex items-center gap-5 mt-4">
            <div className="text-[24px]">THÁNG:</div>

            <div className="bg-[#8EAADB] px-8 py-2 text-[26px]">
              {getMonthLabel(fromDate)}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="border-collapse  ">
        <thead>
          {/* HEADER ROW 1 */}
          <tr>
            <th
              rowSpan={2}
              className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[60px] text-center font-bold"
            >
              STT
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[140px] text-center font-bold"
            >
              NHÓM
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[100px] text-center font-bold"
            >
              CODE
            </th>

            <th
              rowSpan={2}
              className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[260px] text-center font-bold"
            >
              TÊN HÀNG
            </th>

            <th
              rowSpan={2}
              className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold"
            >
              ĐVT
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[130px] text-center font-bold"
            >
              Giá trị hàng hóa
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#A9D18E] w-[120px] text-center font-bold"
            >
              Tồn Đầu
            </th>

            <th
              colSpan={6}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] text-center font-bold"
            >
              Số lượng nhập từ NCC
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#D9EAD3] w-[120px] text-center font-bold"
            >
              Số lượng mua phía ngoài
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4CCCC] w-[120px] text-center text-red-600 font-bold"
            >
              Tổng nhập
            </th>

            <th
              colSpan={5}
              className="  whitespace-nowrap border border-gray-500 bg-[#F4CCCC] text-center font-bold"
            >
              Số lượng hủy hàng
            </th>

            <th
              rowSpan={2}
              className="  whitespace-nowrap border border-gray-500 bg-[#D9EAD3] w-[120px] text-center font-bold"
            >
              Tồn Cuối (Kiểm Kê)
            </th>

            <th
              rowSpan={2}
              className="border border-gray-500 bg-[#FFF200] w-[120px] text-center text-red-600 font-bold"
            >
              Xuất bán trong tháng
            </th>

            <th
              rowSpan={2}
              className="border border-gray-500 bg-[#FCE5CD] w-[150px] text-center font-bold"
            >
              Tổng chi phí sử dụng trong tháng
            </th>

            <th
              colSpan={4}
              className="border border-gray-500 bg-[#F4D35E] text-center font-bold"
            >
              Plan Sales cho thời gian nhập hàng tới:
            </th>

            <th
              rowSpan={2}
              className="border border-gray-500 bg-[#F4D35E] w-[140px] text-center font-bold"
            >
              Số cần đặt thêm
            </th>
          </tr>

          {/* HEADER ROW 2 */}
          <tr>
            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 1
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 2
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 3
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 4
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 5
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 6
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 1
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 2
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 3
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 4
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 5
            </th>

            <th className="border border-gray-500 bg-[#E2EFDA] w-[120px] text-center text-red-600 font-bold">
              Usage per Mil
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
              Min
            </th>

            <th className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
              Max
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[220px] px-4 py-2 text-center text-black font-bold whitespace-nowrap">
              {" "}
              Báo động
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={30} className="text-center py-10">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : visibleRows.length === 0 ? (
            <tr>
              <td colSpan={30} className="text-center py-10">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            visibleRows.map((item) => (
              <tr key={item.stt} className="h-[38px]">
                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.stt}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 px-2">
                  {item.group}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.code}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 px-2 font-semibold">
                  {item.name}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.unit}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-right px-2 text-red-600">
                  {item.value}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 bg-[#A9D18E] text-center">
                  {item.stockStart}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week1}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week2}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week3}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week4}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week5}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.week6}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 bg-[#A9D18E] text-center">
                  {item.outside}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 bg-[#FCE4D6] text-center text-red-600 font-bold">
                  {item.totalImport}
                </td>

                <td className=" whitespace-nowrap border border-gray-400"></td>

                <td className=" whitespace-nowrap border border-gray-400"></td>

                <td className=" whitespace-nowrap border border-gray-400"></td>

                <td className=" whitespace-nowrap border border-gray-400"></td>

                <td className=" whitespace-nowrap border border-gray-400"></td>

                <td className=" whitespace-nowrap border border-gray-400 bg-[#D9EAD3] text-center">
                  {item.stockEnd}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 bg-[#FFF200] text-center text-red-600">
                  {item.sale}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.totalCost}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.usagePer}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.min}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.max}
                </td>

                <td className="border border-gray-400 bg-[#FF0000] w-[220px] px-4 text-white text-center font-bold whitespace-nowrap">
                  {" "}
                  {item.warning}
                </td>

                <td className=" whitespace-nowrap border border-gray-400 text-center">
                  {item.order}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
