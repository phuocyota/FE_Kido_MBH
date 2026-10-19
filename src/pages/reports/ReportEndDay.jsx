import { exportReportExcel, printReport } from "../../components/reports/reportActions";
import React, { useRef, useState } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ReportFilter from "../../components/reports/reportEndDay/ReportFilter";
import ReportContent from "../../components/reports/reportEndDay/ReportContent";
import { getVietnamDateKey } from "../../components/reports/reportEndDay/reportData";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

export default function ReportEndDay() {
  const [reportType, setReportType] = useState("portrait");

  const [dateType, setDateType] = useState("range");

  const today = getVietnamDateKey();
  const [fromDate, setFromDate] = useState(today);

  const [toDate, setToDate] = useState(today);

  const [zoom, setZoom] = useState(1);

  const [interest, setInterest] = useState("Tổng hợp bán hàng");

  const [openInterest, setOpenInterest] = useState(false);

  const previewRef = useRef();
  const exportRef = useRef();

  const interests = ["Tổng hợp bán hàng", "Hủy món"];

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

    const pageHeight = reportType === "portrait" ? 297 : 210;
    for (let offset = 0; offset < imgHeight; offset += pageHeight) {
      if (offset > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -offset, pdfWidth, imgHeight);
    }

    pdf.save("Bao_cao_cuoi_ngay.pdf");
  };

  const handleDownloadExcel = () => exportReportExcel(exportRef.current, "Bao_cao_cuoi_ngay.xlsx");
  const handlePrint = () => printReport(exportRef.current, reportType === "landscape");

  return (
    <div className="erp-page bg-gray-100">
      <div className="erp-content">
        {/* HEADER */}
        <div className="erp-page-header">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0"><h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
              Báo cáo cuối ngày
            </h1><p className="mt-1 text-xs leading-5 text-slate-500">Tổng hợp kết quả bán hàng và các khoản thu, chi để đối soát cuối ngày.</p></div>

            <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
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
            </ToolbarFilterDropdown>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              {interest}
            </span>
          </div>
        </div>

        {/* REPORT */}
        <div className="min-w-0">
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
  );
}
