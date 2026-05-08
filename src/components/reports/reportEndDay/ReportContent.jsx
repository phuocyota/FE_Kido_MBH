import React from "react";

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

export default function ReportContent({
  reportType,
  interest,
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


  // ✅ DATA MẪU
  const data = [
    {
      date: "07/05/2026",
      code: "SP001",
      name: "Bánh mì xúc xích",
      price: "20,000",
      qty: 3,
      total: "60,000",
      gross: "60,000",
      tax: "6,000",
      net: "54,000",
    },

    {
      date: "07/05/2026",
      code: "SP002",
      name: "Sữa tươi",
      price: "15,000",
      qty: 5,
      total: "75,000",
      gross: "75,000",
      tax: "7,500",
      net: "67,500",
    },

    {
      date: "07/05/2026",
      code: "SP003",
      name: "Mì Ý",
      price: "35,000",
      qty: 2,
      total: "70,000",
      gross: "70,000",
      tax: "7,000",
      net: "63,000",
    },
  ];

  const isPortrait =
  reportType === "portrait";

  return (
    <div
      className="
        flex-1
        min-w-0
        rounded-3xl
        shadow-sm
        border
        border-gray-300
        overflow-hidden
        bg-white
      "
    >

      {/* TOOLBAR */}
      <div
        className="
          h-16
          px-4
          flex
          items-center
          gap-2
          overflow-x-auto
          bg-gray-600
          text-white
        "
      >

        <button
          onClick={handleResetZoom}
          className="toolbar-btn"
        >
          <RotateCcw size={24} />
        </button>

        <button className="toolbar-btn">
          <ChevronsLeft size={24} />
        </button>

        <button className="toolbar-btn">
          <ChevronsRight size={24} />
        </button>

        <div className="flex-1"></div>

        <button
          onClick={handleDownloadPDF}
          className="toolbar-btn"
        >
          <FileText size={24} />
        </button>

        <button
          onClick={handleDownloadExcel}
          className="toolbar-btn"
        >
          <FileSpreadsheet size={24} />
        </button>

        <button
          onClick={handlePrint}
          className="toolbar-btn"
        >
          <Printer size={24} />
        </button>

        <button
          onClick={handleZoomIn}
          className="toolbar-btn"
        >
          <ZoomIn size={24} />
        </button>

        <button
          onClick={handleZoomOut}
          className="toolbar-btn"
        >
          <ZoomOut size={24} />
        </button>

        <button
          onClick={handleFullscreen}
          className="toolbar-btn"
        >
          <Maximize size={24} />
        </button>

      </div>

    
      {/* PREVIEW */}
<div
  className="
  h-[75vh]

  overflow-x-auto
  overflow-y-auto

  p-2
  sm:p-5

  flex
  justify-start
  lg:justify-center

  bg-gray-200
"
>
  <div
    ref={previewRef}
    style={{
  transform:
    window.innerWidth < 768
      ? "scale(1)"
      : `scale(${zoom})`,

  transformOrigin: "top center",
}}
    className={`
  min-w-max

  transition-all
  duration-300

  ${
    isPortrait
      ? `
        w-[210mm]
        min-h-[297mm]
      `
      : `
        w-[297mm]
        min-h-[210mm]
      `
  }

  shadow-xl
  border
  bg-white
`}
  >
    {/* HEADER */}
    <div
  className={`
    border-b
    border-gray-300

    ${
      isPortrait
        ? "pb-4 pt-8 px-8"
        : "pb-5 pt-6 px-12"
    }
  `}
>
      <h1 className="text-[34px] font-bold text-center text-[#1E293B]">

  {interest === "Hủy món"
    ? "Báo cáo hủy món"
    : "Báo cáo doanh thu bán hàng"}

</h1>

      <div className="text-center mt-3 text-[20px] text-gray-700">
        Trường tiểu học ABC
      </div>
    </div>

    {/* TABLE */}
    <div
  className={`
    overflow-x-auto

    ${
      isPortrait
        ? "px-3 py-6"
        : "px-8 py-4"
    }
  `}
>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F3F4F6]">
            <th className="report-th w-[120px]">
              Ngày
            </th>

            <th className="report-th">
              Mã Hàng
            </th>

            <th className="report-th">
              Tên sản phẩm
            </th>

            <th className="report-th">
              Giá
            </th>

            <th className="report-th">
              Số lượng
            </th>

            <th className="report-th">
              Tổng
            </th>

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
  {data.length === 0 ? (
    <tr>
      <td
        colSpan={9}
        className="
          border
          border-[#D6D3C4]
          py-10
          text-center
          italic
          text-gray-700
          bg-[#F4EFD8]
        "
      >
        Báo cáo không có dữ liệu
      </td>
    </tr>
  ) : (
    data.map((item, index) => (
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
        width:
          reportType === "portrait"
            ? "210mm"
            : "297mm",

        minHeight:
          reportType === "portrait"
            ? "297mm"
            : "210mm",
      }}
      className="bg-white p-10"
    >
      Export PDF
    </div>
  </div>
</div>
    </div>
  );
}