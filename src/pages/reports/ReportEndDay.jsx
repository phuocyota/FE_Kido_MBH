import React, { useRef, useState } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ReportFilter from "../../components/reports/reportEndDay/ReportFilter";
import ReportContent from "../../components/reports/reportEndDay/ReportContent";

export default function ReportEndDay() {

  const [reportType, setReportType] = useState("portrait");

  const [dateType, setDateType] = useState("range");

  const [fromDate, setFromDate] = useState("2026-05-07");

  const [toDate, setToDate] = useState("2026-05-07");

  const [zoom, setZoom] = useState(1);

  const [interest, setInterest] = useState("Bán hàng");

  const [openInterest, setOpenInterest] = useState(false);

  const previewRef = useRef();
  const exportRef = useRef();

  const interests = [
    "Tổng hợp bán hàng",
    "Hủy món",
  ];

  const formatDate = (date) => {
    const d = new Date(date);

    return d.toLocaleDateString("vi-VN");
  };

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
    document.documentElement.requestFullscreen();
  };

  const handleDownloadPDF = async () => {

    const element = exportRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: reportType === "portrait" ? "portrait" : "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = reportType === "portrait" ? 210 : 297;

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      imgHeight
    );

    pdf.save("Bao_cao_cuoi_ngay.pdf");
  };

  const handlePrint = () => {

  const printContents =
    exportRef.current.innerHTML;

  const originalContents =
    document.body.innerHTML;

  document.body.innerHTML = `
    <div style="padding:20px;font-family:Arial">

      <style>

        table{
          width:100%;
          border-collapse:collapse;
        }

        th,
        td{
          border:1px solid #d1d5db;
          padding:10px;
          text-align:center;
          font-size:14px;
        }

        h1{
          text-align:center;
          margin-bottom:10px;
        }

      </style>

      ${printContents}

    </div>
  `;

  window.print();

  document.body.innerHTML =
    originalContents;

  window.location.reload();
};

  const handleDownloadExcel = () => { };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-5">

      <div className="max-w-[1800px] mx-auto">

        {/* HEADER */}
        <div className="mb-4 lg:mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
            Báo cáo cuối ngày
          </h1>

        </div>

        {/* CONTENT */}
        <div className="flex flex-col 2xl:flex-row gap-4">

          {/* SIDEBAR */}
          <div className="w-full 2xl:w-[340px] 2xl:min-w-[340px] shrink-0">

            <ReportFilter
              reportType={reportType}
              setReportType={setReportType}
              interest={interest}
              interests={interests}
              openInterest={openInterest}
              setOpenInterest={setOpenInterest}
              setInterest={setInterest}
              dateType={dateType}
              setDateType={setDateType}
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              formatDate={formatDate}
            />

          </div>

          {/* REPORT */}
          <div className="flex-1 min-w-0">

            <ReportContent
              reportType={reportType}
              interest={interest}
              dateType={dateType}
              fromDate={fromDate}
              toDate={toDate}
              zoom={zoom}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleResetZoom={handleResetZoom}
              handleFullscreen={handleFullscreen}
              handleDownloadPDF={handleDownloadPDF}
              handleDownloadExcel={handleDownloadExcel}
              handlePrint={handlePrint}
              previewRef={previewRef}
              exportRef={exportRef}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
