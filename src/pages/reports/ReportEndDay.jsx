import React, { useState } from "react";
import {
  ChevronDown,
  Calendar,
  RotateCcw,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  FileSpreadsheet,
  FileText,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function ReportEndDay() {
  const [interest, setInterest] = useState("Bán hàng");
  const [openInterest, setOpenInterest] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const reportRef = useRef();
  const interests = [
    "Bán hàng",
    "Thu chi",
    "Hàng hóa",
    "Hủy món",
    "Tổng hợp",
  ];

  const handleZoomIn = () => {
    setZoom((prev) => prev + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom((prev) => prev - 0.1);
    }
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleFullscreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const handlePrint = async () => {
  const element = reportRef.current;

  const canvas = await html2canvas(element, {
    scale: 4 ,
    useCORS: true,
    backgroundColor: "#ffffff",
    foreignObjectRendering: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = pdfWidth;
  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    imgWidth,
    imgHeight
  );

  pdf.autoPrint();

  window.open(pdf.output("bloburl"), "_blank");
};
  const handleDownloadPDF = async () => {
  const element = reportRef.current;

  const canvas = await html2canvas(element, {
    scale: 4,
    useCORS: true,
    backgroundColor: "#ffffff",
      foreignObjectRendering: true,

  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = 210;

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    imgWidth,
    imgHeight
  );

  pdf.save("Bao_cao_cuoi_ngay.pdf");
};

 const handleDownloadExcel = () => {
  fetch("/Bao_cao_ban_hang.xls")
    .then((response) => response.blob())
    .then((blob) => {

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Bao_cao_ban_hang.xls";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    });
};
  return (
    <div
  className="min-h-screen p-3 lg:p-5"
  style={{
    background: "#f3f4f6",
  }}
>

      {/* CONTAINER */}
      <div className="max-w-[1800px] mx-auto">

        {/* TITLE */}
        <h1
  className="text-3xl font-bold mb-5"
  style={{
    color: "#1f2937",
  }}
>
          Báo cáo cuối ngày
        </h1>

        {/* LAYOUT */}
        <div className="flex flex-col xl:flex-row gap-4">

          {/* SIDEBAR */}
          <div
            className="
            report-sidebar
              w-full
              xl:w-[320px]
              shrink-0
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-200
              p-5
              h-fit
            "
          >
            {/* DISPLAY */}
            <div className="mb-8">
              <h2 className="font-semibold text-xl text-gray-800 mb-5">
                Kiểu hiển thị
              </h2>

              <div className="space-y-4">

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="w-5 h-5 accent-blue-600"
                  />

                  <span className="text-xl">
                    Báo cáo dọc
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    className="w-5 h-5 accent-blue-600"
                  />

                  <span className="text-xl">
                    Báo cáo ngang
                  </span>
                </label>

              </div>
            </div>

            {/* INTEREST */}
            <div className="mb-8 relative">
              <h2 className="font-semibold text-xl text-gray-800 mb-4">
                Mối quan tâm
              </h2>

              {/* SELECT */}
              <button
                onClick={() =>
                  setOpenInterest(!openInterest)
                }
                className="
                  w-full
                  h-14
                  border
                  border-gray-300
                  rounded-2xl
                  px-4
                  flex
                  items-center
                  justify-between
                  text-lg
                  hover:border-blue-500
                  transition-all
                "
              >
                <span>{interest}</span>

                <ChevronDown size={22} />
              </button>

              {/* DROPDOWN */}
              {openInterest && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    mt-2
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    border
                    border-gray-200
                    overflow-hidden
                    z-50
                  "
                >
                  {interests.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setInterest(item);
                        setOpenInterest(false);
                      }}
                      className={`
                        w-full
                        px-5
                        py-4
                        text-left
                        text-xl
                        hover:bg-blue-50
                        transition-all
                        flex
                        items-center
                        justify-between

                        ${interest === item
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : ""
                        }
                      `}
                    >
                      {item}

                      {interest === item && (
                        <span>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* TIME */}
            <div>
              <h2 className="font-semibold text-xl text-gray-800 mb-4">
                Thời gian
              </h2>

              <div className="space-y-4">

                {/* SINGLE */}
                <div className="flex gap-3 items-center">

                  <input
                    type="radio"
                    className="w-5 h-5 accent-blue-600"
                  />

                  <div
                    className="
                      flex-1
                      h-14
                      border
                      border-gray-300
                      rounded-2xl
                      px-4
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span className="text-lg">
                      07/05/2026
                    </span>

                    <Calendar size={20} />
                  </div>
                </div>

                {/* RANGE */}
                <div className="flex gap-3 items-center">

                  <input
                    type="radio"
                    checked
                    readOnly
                    className="w-5 h-5 accent-blue-600"
                  />

                  <div
                    className="
                      flex-1
                      h-14
                      border
                      border-gray-300
                      rounded-2xl
                      px-4
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span className="text-lg truncate">
                      07/05/2026 - 07/05/2026
                    </span>

                    <Calendar size={20} />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* REPORT */}
          <div
            className="
              flex-1
              min-w-0
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-200
              overflow-hidden
            "
          >

            {/* TOOLBAR */}
            {/* TOOLBAR */}
            <div
              className="
    h-16
    bg-gray-600
    px-4
    flex
    items-center
    gap-2
    overflow-x-auto
    text-white
    scrollbar-hide
  "
            >

              {/* RESET */}
              <button
                onClick={handleResetZoom}
                className="toolbar-btn"
                title="Reset Zoom"
              >
                <RotateCcw size={24} />
              </button>

              {/* PREV */}
              <button
                className="toolbar-btn"
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                }}
              >
                <ChevronsLeft size={24} />
              </button>

              {/* PAGE */}
              <div className="flex items-center gap-2 px-3">
                <input
                  value={page}
                  readOnly
                  className="
        w-12
        h-9
        text-center
        text-black
        rounded
        font-semibold
      "
                />

                <span className="text-lg">
                  / 1
                </span>
              </div>

              {/* NEXT */}
              <button
                className="toolbar-btn"
                onClick={() => {
                  if (page < 1) setPage(page + 1);
                }}
              >
                <ChevronsRight size={24} />
              </button>

              <div className="flex-1"></div>

              {/* DOWNLOAD PDF */}
              <button
                onClick={handleDownloadPDF}
                className="toolbar-btn" 
                title="Tải PDF"
              >
                <FileText size={24} />
              </button>

              {/* DOWNLOAD EXCEL */}
              <button
                onClick={handleDownloadExcel}
                className="toolbar-btn"
                title="Tải Excel"
              >
                <FileSpreadsheet size={24} />
              </button>

              {/* PRINT */}
              <button
                onClick={handlePrint}
                className="toolbar-btn"
                title="In PDF"
              >
                <Printer size={24} />
              </button>

              {/* ZOOM IN */}
              <button
                onClick={handleZoomIn}
                className="toolbar-btn"
              >
                <ZoomIn size={24} />
              </button>

              {/* ZOOM OUT */}
              <button
                onClick={handleZoomOut}
                className="toolbar-btn"
              >
                <ZoomOut size={24} />
              </button>

              {/* FULLSCREEN */}
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
                bg-gray-200
                h-[75vh]
                overflow-auto
                p-5
                flex
                justify-center
              "
            >

              {/* PAPER */}
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
                ref={reportRef}
                className="
                  bg-white
                  w-[210mm]
min-h-[297mm]
                  shadow-xl
                  border
                  border-gray-300
                  p-10
                "
              >

                {/* HEADER */}
                <div className="text-center mb-10">

                  <div className="text-sm text-gray-500 mb-3">
                    Ngày bán 07/05/2026
                  </div>

                  <h2 className="text-3xl font-bold mb-3">
                    Báo cáo cuối ngày về bán hàng
                  </h2>

                  <div className="text-gray-500">
                    Chi nhánh: Chi nhánh trung tâm
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                  <table className="w-full border text-sm">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="border p-3">
                          Mã Hàng
                        </th>

                        <th className="border p-3">
                          Tên Sản Phẩm
                        </th>

                        <th className="border p-3">
                          Giá
                        </th>

                        <th className="border p-3">
                          Số Lượng
                        </th>

                        <th className="border p-3">
                          Tổng
                        </th>

                        <th className="border p-3">
                          Doanh Thu (Gross Sale)
                        </th>

                        <th className="border p-3">
                          Thuế GTGT
                        </th>

                        <th className="border p-3">
                          Doanh Thu (Net Sale)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center p-10 text-gray-500"
                        >
                          Báo cáo không có dữ liệu
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}