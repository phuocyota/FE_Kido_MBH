import React, { useEffect, useRef, useState } from "react";
import { branchApi } from "../../api";
import { getBranchIdFromToken, getBranchNameFromToken } from "../../api/authSession";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";
import ReportBoardingFilter from "../../components/reports/reportBoarding/ReportBoardingFilter";
import ReportBoardingContent from "../../components/reports/reportBoarding/ReportBoardingContent";
import toast from "react-hot-toast";

const todayInput = () => new Date().toISOString().split("T")[0];

export default function ReportBoarding() {
  // VIEW & INTERESTS
  const [viewType, setViewType] = useState("chart");
  const [interest, setInterest] = useState("Tổng hợp bán trú");
  const interests = [
    "Tổng hợp bán trú",
    "Chi tiết món ăn",
    "Thực phẩm & Nguyên liệu"
  ];

  // BRANCH
  const [branch, setBranch] = useState(getBranchNameFromToken() || "");
  const [branchId, setBranchId] = useState(getBranchIdFromToken() || "");

  useEffect(() => {
    const loadDefaultBranch = async () => {
      try {
        const data = await branchApi.getAll();
        const branches = Array.isArray(data) ? data : [];
        const savedBranchId = getBranchIdFromToken();
        const defaultBranch = branches.find((item) => item.id === savedBranchId) || branches[0];

        if (defaultBranch) {
          setBranch(defaultBranch.name || "");
          setBranchId(defaultBranch.id || "");
        }
      } catch {
        setBranch(getBranchNameFromToken() || "");
        setBranchId(getBranchIdFromToken() || "");
      }
    };

    loadDefaultBranch();
  }, []);

  // TIME PERIODS
  const [dateMode, setDateMode] = useState("preset");
  const [timeType, setTimeType] = useState("Tuần này");
  const [fromDate, setFromDate] = useState(todayInput());
  const [toDate, setToDate] = useState(todayInput());

  useEffect(() => {
    if (dateMode !== "preset") return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatDateStr = (date) => date.toISOString().split("T")[0];

    let start = new Date(today);
    let end = new Date(today);

    switch (timeType) {
      case "Hôm nay":
        start = new Date(today);
        end = new Date(today);
        break;
      case "Hôm qua":
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case "Tuần này": {
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        start.setDate(today.getDate() + diffToMonday);
        end.setDate(today.getDate() + diffToMonday + 6);
        break;
      }
      case "Tuần trước": {
        const dayOfWeek = today.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek) - 7;
        start.setDate(today.getDate() + diffToMonday);
        end.setDate(today.getDate() + diffToMonday + 6);
        break;
      }
      case "Tháng này":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Tháng trước":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Toàn thời gian":
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        end = new Date(today);
        break;
      default:
        break;
    }

    setFromDate(formatDateStr(start));
    setToDate(formatDateStr(end));
  }, [timeType, dateMode]);

  // SPECIFIC FILTERS
  const [level, setLevel] = useState("all");
  const [mealPeriod, setMealPeriod] = useState("all");

  // ZOOM & LAYOUT REF
  const [zoom, setZoom] = useState(1);
  const previewRef = useRef();

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error("Không thể mở toàn màn hình");
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownloadExcel = () => {
    toast.success("Báo cáo Excel đã được tải xuống thiết bị!");
  };

  const handlePrint = () => {
    const printContents = previewRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Báo cáo bán trú</title>
          <style>
            * {
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 20px;
              background: white;
              font-family: 'Inter', sans-serif;
            }
            .report-sidebar, button, select, input {
              display: none !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 10px;
              text-align: center;
              font-size: 13px;
            }
            th {
              background-color: #f8fafc;
              font-weight: 700;
            }
            h1 {
              text-align: center;
              font-size: 26px;
              margin-bottom: 5px;
            }
            .grid {
              display: grid;
              grid-template-cols: repeat(5, minmax(0, 1fr));
              gap: 15px;
              margin-bottom: 25px;
            }
            .rounded-2xl {
              border: 1px solid #e2e8f0;
              padding: 15px;
              border-radius: 12px;
              text-align: left;
            }
            .text-2xl {
              font-size: 20px;
              font-weight: 800;
              margin-top: 5px;
            }
            .text-xs {
              font-size: 11px;
              color: #64748b;
            }
            @media print {
              body {
                background: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                size: A4 landscape;
                margin: 8mm;
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

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-2 sm:p-4 lg:p-5">
      <div className="max-w-[1800px] mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              Báo cáo bán trú
            </h1>

            <ToolbarFilterDropdown panelClassName="sm:w-[760px]">
              <ReportBoardingFilter
                viewType={viewType}
                setViewType={setViewType}
                interest={interest}
                setInterest={setInterest}
                interests={interests}
                branch={branch}
                setBranch={setBranch}
                dateMode={dateMode}
                setDateMode={setDateMode}
                timeType={timeType}
                setTimeType={setTimeType}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                formatDate={formatDate}
                level={level}
                setLevel={setLevel}
                mealPeriod={mealPeriod}
                setMealPeriod={setMealPeriod}
              />
            </ToolbarFilterDropdown>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm">
              {interest}
            </span>
          </div>
        </div>

        {/* CONTAINER CONTENT */}
        <div className="min-w-0 overflow-x-auto scrollbar-hide">
          <ReportBoardingContent
            viewType={viewType}
            interest={interest}
            fromDate={fromDate}
            toDate={toDate}
            branch={branch}
            branchId={branchId}
            zoom={zoom}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
            handleFullscreen={handleFullscreen}
            handleDownloadExcel={handleDownloadExcel}
            handlePrint={handlePrint}
            previewRef={previewRef}
            level={level}
            mealPeriod={mealPeriod}
          />
        </div>
      </div>
    </div>
  );
}
