import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  FileSpreadsheet,
  FileText,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { reportApi } from "../../../api";
import { getBranchNameFromToken } from "../../../api/authSession";

export default function ReportContent({
  reportType,
  interest,
  dateType,
  fromDate,
  toDate,
  zoom,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleFullscreen,
  handleDownloadPDF,
  handleDownloadExcel,
  handlePrint,
  previewRef,
  exportRef,
}) {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const branchName = getBranchNameFromToken() || "Trường tiểu học ABC";

  // Fetch end of day report
  useEffect(() => {
    fetchReport();
  }, [dateType, fromDate, toDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const effectiveFromDate = fromDate || new Date().toISOString().split("T")[0];
      const effectiveToDate = dateType === "single" ? effectiveFromDate : toDate || effectiveFromDate;
      const branchId = "11111111-1111-4111-8111-111111111111";
      const result = await reportApi.getEndOfDay(effectiveFromDate, effectiveToDate, branchId);
      // Map BE data to FE format - result.data.data contains the items array
      const mappedData = result.data?.data?.map(item => ({
        date: new Date(item.date).toLocaleDateString("vi-VN"),
        code: item.code,
        name: item.name,
        price: item.price.toLocaleString(),
        qty: item.qty,
        total: item.total.toLocaleString(),
        gross: item.gross.toLocaleString(),
        tax: item.tax.toLocaleString(),
        net: item.net.toLocaleString(),
      })) || [];
      setReportData(mappedData);
    } catch {
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const data = reportData;

  const isPortrait =
  reportType === "portrait";


return (
  <div className="flex-1 min-w-0 rounded-3xl shadow-sm border border-gray-300 overflow-hidden bg-white">

    {/* TOOLBAR */}
    <div className="h-16 px-4 flex items-center gap-2 overflow-x-auto bg-gray-600 text-white">

      <button onClick={handleResetZoom} className="toolbar-btn">
        <RotateCcw size={24} />
      </button>

      <button className="toolbar-btn">
        <ChevronsLeft size={24} />
      </button>

      <button className="toolbar-btn">
        <ChevronsRight size={24} />
      </button>

      <div className="flex-1"></div>

      <button onClick={handleDownloadPDF} className="toolbar-btn">
        <FileText size={24} />
      </button>

      <button onClick={handleDownloadExcel} className="toolbar-btn">
        <FileSpreadsheet size={24} />
      </button>

      <button onClick={handlePrint} className="toolbar-btn">
        <Printer size={24} />
      </button>

      <button onClick={handleZoomIn} className="toolbar-btn">
        <ZoomIn size={24} />
      </button>

      <button onClick={handleZoomOut} className="toolbar-btn">
        <ZoomOut size={24} />
      </button>

      <button onClick={handleFullscreen} className="toolbar-btn">
        <Maximize size={24} />
      </button>

    </div>

    {/* PREVIEW */}
    <div className="h-[75vh] overflow-x-auto overflow-y-auto p-2 sm:p-5 flex justify-start lg:justify-center bg-gray-200">

      <div
        ref={previewRef}
        style={{
          transform: window.innerWidth < 768 ? "scale(1)" : `scale(${zoom})`,
          transformOrigin: "top center",
        }}
        className={`min-w-max transition-all duration-300 ${isPortrait ? "w-[210mm] min-h-[297mm]" : "w-[297mm] min-h-[210mm]"} shadow-xl border bg-white`}
      >

        {/* HEADER */}
        <div className={`border-b border-gray-300 ${isPortrait ? "pb-4 pt-8 px-8" : "pb-5 pt-6 px-12"}`}>

          <h1 className="text-[34px] font-bold text-center text-[#1E293B]">

            {interest === "Hủy món"
              ? "Báo cáo hủy món"
              : "Báo cáo doanh thu bán hàng"}

          </h1>

          <div className="text-center mt-3 text-[20px] text-gray-700">
            {branchName}
          </div>

        </div>

        {/* TABLE */}
        <div className={`${isPortrait ? "px-3 py-6" : "px-8 py-4"} overflow-x-auto`}>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-[#F3F4F6]">

                <th className="report-th w-[120px]">Ngày</th>

                <th className="report-th">Mã Hàng</th>

                <th className="report-th">Tên sản phẩm</th>

                <th className="report-th">Giá</th>

                <th className="report-th">Số lượng</th>

                <th className="report-th">Tổng</th>

                <th className="report-th">
                  Doanh thu
                  <br />
                  (Gross Sale)
                </th>

                <th className="report-th">
                  Thuế GTGT
                </th>

                <th className="report-th">
                  Doanh thu
                  <br />
                  (Net Sale)
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan={9} className="border border-[#D6D3C4] py-10 text-center italic text-gray-700 bg-[#F4EFD8]">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : data.length === 0 ? (

                <tr>

                  <td colSpan={9} className="border border-[#D6D3C4] py-10 text-center italic text-gray-700 bg-[#F4EFD8]">
                    Báo cáo không có dữ liệu
                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr key={index}>

                    <td className="report-td">{item.date}</td>

                    <td className="report-td">{item.code}</td>

                    <td className="report-td">{item.name}</td>

                    <td className="report-td">{item.price}</td>

                    <td className="report-td">{item.qty}</td>

                    <td className="report-td">{item.total}</td>

                    <td className="report-td">{item.gross}</td>

                    <td className="report-td">{item.tax}</td>

                    <td className="report-td">{item.net}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* EXPORT */}
      <div className="fixed left-[-99999px] top-0">

        <div
          ref={exportRef}
          style={{
            width: reportType === "portrait" ? "210mm" : "297mm",
            minHeight: reportType === "portrait" ? "297mm" : "210mm",
          }}
          className="bg-white"
        >

           {/* HEADER */}
        <div className={`border-b border-gray-300 ${isPortrait ? "pb-4 pt-8 px-8" : "pb-5 pt-6 px-12"}`}>

          <h1 className="text-[34px] font-bold text-center text-[#1E293B]">

            {interest === "Hủy món"
              ? "Báo cáo hủy món"
              : "Báo cáo doanh thu bán hàng"}

          </h1>

          <div className="text-center mt-3 text-[20px] text-gray-700">
            {branchName}
          </div>

        </div>

        {/* TABLE */}
<div className={isPortrait ? "px-6 py-6" : "px-8 py-4"}>

  <table className="w-full table-fixed border-collapse">

    <thead>

      <tr className="bg-[#F3F4F6]">

        <th className="report-th w-[13%]">
          Ngày
        </th>

        <th className="report-th w-[10%]">
          Mã Hàng
        </th>

        <th className="report-th w-[20%]">
          Tên sản phẩm
        </th>

        <th className="report-th w-[10%]">
          Giá
        </th>

        <th className="report-th w-[9%]">
          Số lượng
        </th>

        <th className="report-th w-[10%]">
          Tổng
        </th>

        <th className="report-th w-[13%]">
          Doanh thu
          <br />
          (Gross Sale)
        </th>

        <th className="report-th w-[10%]">
          Thuế GTGT
        </th>

        <th className="report-th w-[13%]">
          Doanh thu
          <br />
          (Net Sale)
        </th>

      </tr>

    </thead>

    <tbody>

      {data.map((item, index) => (

        <tr key={index}>

          <td className="report-td break-words">
            {item.date}
          </td>

          <td className="report-td break-words">
            {item.code}
          </td>

          <td className="report-td break-words">
            {item.name}
          </td>

          <td className="report-td">
            {item.price}
          </td>

          <td className="report-td">
            {item.qty}
          </td>

          <td className="report-td">
            {item.total}
          </td>

          <td className="report-td">
            {item.gross}
          </td>

          <td className="report-td">
            {item.tax}
          </td>

          <td className="report-td">
            {item.net}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

        </div>

      </div>

    </div>

  </div>
);
}
