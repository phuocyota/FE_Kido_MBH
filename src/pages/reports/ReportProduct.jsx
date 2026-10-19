import React, { useEffect, useRef, useState } from "react";

import { branchApi } from "../../api";
import {
  getBranchIdFromToken,
  getBranchNameFromToken,
  getTokenPayload,
} from "../../api/authSession";
import ReportProductFilter from "../../components/reports/reportProduct/ReportProductFilter";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

import ReportProductContent from "../../components/reports/reportProduct/ReportProductContent";

import { getProductReportRange } from "../../components/reports/reportProduct/productReportData";
import { getVietnamDateKey } from "../../components/reports/reportEndDay/reportData";
const todayInput = () => getVietnamDateKey();

export default function ReportProduct() {
  // =========================
  // VIEW
  // =========================
  const [viewType, setViewType] = useState("report");

  // =========================
  // INTEREST
  // =========================
  const [interest, setInterest] = useState("Bán hàng");

  const interests = [
    "Bán hàng",
    // "Lợi nhuận",
    "Tồn kho hiện tại",
    // "Xuất hủy",
  ];

  // =========================
  // BRANCH
  // =========================
  const [branchId] = useState(() => {
    const token = getTokenPayload();
    return (token ? token.branchId : getBranchIdFromToken()) || undefined;
  });
  const [branch, setBranch] = useState(() =>
    branchId
      ? getBranchNameFromToken() || "Chi nhánh hiện tại"
      : "Tất cả chi nhánh",
  );
  useEffect(() => {
    if (!branchId) return;
    let cancelled = false;
    branchApi
      .getById(branchId)
      .then((data) => {
        if (!cancelled && data?.name) setBranch(data.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [branchId]);

  // =========================
  // TIME
  // =========================
  const [dateMode, setDateMode] = useState("preset");

  const [timeType, setTimeType] = useState("Hôm nay");

  const [fromDate, setFromDate] = useState(todayInput());

  const [toDate, setToDate] = useState(todayInput());

  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  const effectiveRange =
    dateMode === "preset"
      ? getProductReportRange(timeType)
      : dateMode === "hour"
        ? {
            from: `${fromDate}T${fromTime}:00+07:00`,
            to: `${toDate}T${toTime}:59.999+07:00`,
          }
        : { from: fromDate, to: toDate };

  // =========================
  // FILTER
  // =========================
  const [productKeyword, setProductKeyword] = useState("");

  const [category, setCategory] = useState("");

  const [foodTypes, setFoodTypes] = useState([]);

  // =========================
  // UI STATE
  // =========================
  const [zoom, setZoom] = useState(1);

  const previewRef = useRef();

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("vi-VN");
  };

  // =========================
  // ZOOM
  // =========================
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

  // =========================
  // FULLSCREEN
  // =========================
  const handleFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const handleDownloadExcel = () => {
    alert("Xuất Excel đang được phát triển");
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    const printContents = previewRef.current.innerHTML;

    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
    <html>

      <head>

        <title>Báo cáo</title>

        <style>

          *{
            box-sizing:border-box;
          }

          html,
          body{
            width:100%;
            height:100%;
            margin:0;
            padding:0;
            background:white;
            overflow:hidden;
            font-family:Arial,sans-serif;
          }

          body{
            display:flex;
            justify-content:center;
            align-items:flex-start;
          }

          .print-container{
            width:100%;
            padding:0;
            margin:0;
            background:white;
          }

          table{
            width:100%;
            border-collapse:collapse;
            table-layout:fixed;
          }

          th,
          td{
            border:1px solid #94a3b8;
            padding:8px;
            font-size:12px;
          }

          @page{
            size:A4 landscape;
            margin:0;
          }

          @media print{

            html,
            body{
              background:white !important;
            }

            body{
              -webkit-print-color-adjust:exact;
              print-color-adjust:exact;
            }

          }

        </style>

      </head>

      <body>

        <div class="print-container">

          ${printContents}

        </div>

      </body>

    </html>
  `;

    setTimeout(() => {
      window.print();

      document.body.innerHTML = originalContents;

      window.location.reload();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-2 sm:p-4 lg:p-5">
      <div className="max-w-[1800px] mx-auto">
        {/* HEADER */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
              Báo cáo hàng hóa
            </h1>

            <ToolbarFilterDropdown panelClassName="sm:w-[760px]">
              <ReportProductFilter
                viewType={viewType}
                setViewType={setViewType}
                interest={interest}
                setInterest={setInterest}
                interests={interests}
                branch={branch}
                dateMode={dateMode}
                setDateMode={setDateMode}
                timeType={timeType}
                setTimeType={setTimeType}
                fromDate={
                  dateMode === "preset" ? effectiveRange.from : fromDate
                }
                toDate={dateMode === "preset" ? effectiveRange.to : toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                fromTime={fromTime}
                toTime={toTime}
                setFromTime={setFromTime}
                setToTime={setToTime}
                formatDate={formatDate}
                productKeyword={productKeyword}
                setProductKeyword={setProductKeyword}
                category={category}
                setCategory={setCategory}
                foodTypes={foodTypes}
                setFoodTypes={setFoodTypes}
              />
            </ToolbarFilterDropdown>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              {interest}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-w-0">
          <ReportProductContent
            productKeyword={productKeyword}
            category={category}
            foodTypes={foodTypes}
            // VIEW
            viewType={viewType}
            // INTEREST
            interest={interest}
            // TIME
            fromDate={effectiveRange.from}
            toDate={effectiveRange.to}
            branch={branch}
            branchId={branchId}
            // ZOOM
            zoom={zoom}
            // ACTIONS
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
            handleFullscreen={handleFullscreen}
            handleDownloadExcel={handleDownloadExcel}
            handlePrint={handlePrint}
            // REFS
            previewRef={previewRef}
          />
        </div>
      </div>
    </div>
  );
}
