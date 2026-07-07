import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { reportApi } from "../../../api";

const unwrapData = (response) => {
  if (response?.success !== undefined) return response.data;
  if (response?.data?.success !== undefined) return response.data.data;
  return response?.data || response || {};
};

export default function ProductSaleReport({ fromDate, toDate, branchId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, branchId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Format dates to ISO datetime for backend
      const from = fromDate ? new Date(fromDate).toISOString() : undefined;
      const to = toDate ? new Date(toDate).toISOString() : undefined;
      // Get monthly order plan report with date range
      const response = await reportApi.getMonthlyOrderPlan(null, from, to, branchId);
      const result = response;
      
      setReportData(result);
      
      // Map to FE format according to FE_HANDOFF.md
      const mappedData = result.data?.map((item) => ({
        stt: item.stt,
        group: item.group,
        code: item.code,
        name: item.name,
        unit: item.unit,
        usage: String(item.monthlyUsage || 0),
        stock: item.stockOnHand === null ? "" : String(item.stockOnHand),
        usagePer: item.usagePerMil === null ? "" : String(item.usagePerMil),
        min: String(item.planSales?.min || 0),
        max: String(item.planSales?.max || 0),
        warning: item.warningQuantity === null ? "" : String(item.warningQuantity),
        order: String(item.suggestedOrderQuantity || 0),
        adjust: "",
      })) || [];
      setRows(mappedData);
    } catch (error) {
      toast.error("Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  };
  return (

  <div className="w-full bg-white">

  <div className="inline-block border border-gray-400 " style={{
  width: "1700px",
}}>

    {/* HEADER */}
    <div className="grid grid-cols-12 border-b border-gray-400">

      {/* LEFT */}
      <div className="col-span-4 border-r border-gray-400 p-4">

        <div className="flex">

          {/* DOANH THU */}
          <div className="w-[180px] border border-gray-400">

            <div className="bg-[#DCE6F1] h-[110px] flex items-center justify-center text-center text-red-600 text-[24px] font-bold leading-tight border-b border-gray-400">
              DOANH THU
              <br />
              THÁNG
            </div>

            <div className="h-[90px] bg-[#FFFFCC] p-2 text-[14px] leading-5">

              <div className="font-bold">
                HCM-KD :
              </div>

              Doanh thu của tháng
              trước đó mà mình
              muốn lấy làm dữ liệu

            </div>

          </div>

          {/* VALUE */}
          <div className="flex-1 border-t border-r border-b border-gray-400 bg-[#DCE6F1] flex items-center justify-end px-8 text-[26px] font-bold">
            {(reportData?.revenueMonth || 0).toLocaleString("vi-VN")}
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="col-span-8 p-6">

        <div className="text-[28px] font-bold">
          {reportData?.companyName || ""}
        </div>

        <div className="mt-6 text-[22px] font-bold">
          {reportData?.schoolName ? `Trường : ${reportData.schoolName}` : ""}
        </div>

        <div className="mt-8 text-[38px] font-bold">
          {reportData?.title || "Kế hoạch đặt hàng hóa trong Tháng"}
        </div>

      </div>

    </div>

    {/* TABLE */}
    <table className="border-collapse  w-[1600px]">

      <thead>

        {/* HEADER ROW 1 */}
        <tr>

          <th rowSpan={3} className="border border-gray-500 bg-[#F4D35E] w-[60px] text-center font-bold py-2">
            STT
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#F4D35E] w-[120px] text-center font-bold">
            NHÓM
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#F4D35E] w-[120px] text-center font-bold">
            CODE
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#F4D35E] min-w-[350px] text-left px-3 font-bold">
            TÊN HÀNG
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#F4D35E] w-[80px] text-center font-bold">
            ĐVT
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#FFF200] w-[140px] text-center text-red-600 font-bold px-2">
            Số xuất dùng của tháng theo doanh thu
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#C6E0B4] w-[120px] text-center font-bold">
            Tồn Kiểm Kê
          </th>

          <th colSpan={5} className="border border-gray-500 bg-[#F4D35E] text-center font-bold py-2">
            Plan Sales cho thời gian nhập hàng tới:
          </th>

          <th rowSpan={3} className="border border-gray-500 bg-[#F8CBAD] w-[200px] text-center text-red-600 font-bold px-2">
            Số cần đặt sau điều chỉnh ( nhập PM )
          </th>

        </tr>

        {/* HEADER ROW 2 */}
        <tr>

          <th rowSpan={2} className="border border-gray-500 bg-[#E2EFDA] w-[110px] text-center text-red-600 font-bold">
            Usage per Mil
          </th>

          <th className="border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
            Min
          </th>

          <th className="border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
            Max
          </th>

          <th rowSpan={2} className="border border-gray-500 bg-[#F4D35E] w-[130px] text-center font-bold">
            Báo động
          </th>

          <th rowSpan={2} className="border border-gray-500 bg-[#F4D35E] w-[160px] text-center font-bold">
            Số cần đặt thêm
          </th>

        </tr>

        {/* HEADER ROW 3 */}
        <tr>

          <th className="border border-gray-500 text-center text-[12px] font-bold">
            120%
          </th>

          <th className="border border-gray-500 text-center text-[12px] font-bold">
            150%
          </th>

        </tr>

      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={13} className="text-center py-10">
              Đang tải dữ liệu...
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={13} className="text-center py-10">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
        rows.map((item) => (

    <tr
      key={item.stt}
      className="h-[38px]"
    >

      <td className="border border-gray-400 text-center">
        {item.stt}
      </td>

      <td className="border border-gray-400 text-center">
        {item.group}
      </td>

      <td className="border border-gray-400 text-center">
        {item.code}
      </td>

      <td className="border border-gray-400 px-2 font-semibold">
        {item.name}
      </td>

      <td className="border border-gray-400 text-center">
        {item.unit}
      </td>

      <td className="border border-gray-400 bg-[#FFF200] text-right px-2 text-red-600">
        {item.usage}
      </td>

      <td className="border border-gray-400 bg-[#C6E0B4] text-right px-2">
        {item.stock}
      </td>

      <td className="border border-gray-400 text-right px-2">
        {item.usagePer}
      </td>

      <td className="border border-gray-400 text-right px-2">
        {item.min}
      </td>

      <td className="border border-gray-400 text-right px-2">
        {item.max}
      </td>

      <td
        className={`
          border
          border-gray-400
          text-center

          font-semibold

          ${
            item.warning === "LOW"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }
        `}
      >
        {item.warning}
      </td>

      <td className="border border-gray-400 text-right px-2 bg-yellow-100">
        {item.order}
      </td>

      <td className="border border-gray-400 text-right px-2 bg-[#F8CBAD]">
        {item.adjust}
      </td>

    </tr>

  ))
  )}

</tbody>

    </table>

  </div>

</div>
  );
}
