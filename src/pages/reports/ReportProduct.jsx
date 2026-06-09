import React, {
  useEffect,
  useRef,
  useState,
} from "react";

 

import { branchApi } from "../../api";
import { getBranchNameFromToken } from "../../api/authSession";
import ReportProductFilter from "../../components/reports/reportProduct/ReportProductFilter";

import ReportProductContent from "../../components/reports/reportProduct/ReportProductContent";

const todayInput = () => new Date().toISOString().split("T")[0];

export default function ReportProduct() {

  // =========================
  // VIEW
  // =========================
  const [viewType, setViewType] =
    useState("portrait");

  // =========================
  // INTEREST
  // =========================
  const [interest, setInterest] =
    useState("Bán hàng");

  const interests = [
    "Bán hàng",
    // "Lợi nhuận",
    "Xuất nhập tồn",
    // "Xuất hủy",
  ];

  // =========================
  // BRANCH
  // =========================
  const [branch, setBranch] =
    useState(getBranchNameFromToken() || "");

  const [branchId, setBranchId] =
    useState("");

  useEffect(() => {
    const loadDefaultBranch = async () => {
      try {
        const data = await branchApi.getAll();
        const branches = Array.isArray(data) ? data : [];
        const defaultBranch = branches[0];

        if (defaultBranch) {
          setBranch(defaultBranch.name || "");
          setBranchId(defaultBranch.id || "");
        }
      } catch {
        setBranch(getBranchNameFromToken() || "");
        setBranchId("");
      }
    };

    loadDefaultBranch();
  }, []);

  // =========================
  // TIME
  // =========================
  const [dateMode, setDateMode] =
    useState("preset");

  const [timeType, setTimeType] =
    useState("Hôm nay");

  const [fromDate, setFromDate] =
    useState(todayInput());

  const [toDate, setToDate] =
    useState(todayInput());

  // =========================
  // FILTER
  // =========================
  const [productKeyword, setProductKeyword] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [foodTypes, setFoodTypes] =
    useState([]);

  // =========================
  // UI STATE
  // =========================
  const [zoom, setZoom] =
    useState(1);

  const previewRef = useRef();
  const exportRef = useRef();

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {

    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString(
      "vi-VN"
    );
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
  const handleDownloadExcel =
    () => {

      alert(
        "Xuất Excel đang được phát triển"
      );

    };

  // =========================
  // PRINT
  // =========================
 const handlePrint = () => {

  const printContents =
    exportRef.current.innerHTML;

  const originalContents =
    document.body.innerHTML;

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

    document.body.innerHTML =
      originalContents;

    window.location.reload();

  }, 300);

};
 



  return (
  <div className="min-h-screen bg-[#F3F4F6] p-2 sm:p-4 lg:p-5">

    <div className="max-w-[1800px] mx-auto">

      {/* HEADER */}
      <div className="mb-4 lg:mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
          Báo cáo hàng hóa
        </h1>

      </div>

      {/* BODY */}
      <div className="flex flex-col 2xl:flex-row gap-4">

        {/* FILTER */}
        <div className="w-full 2xl:w-[340px] 2xl:min-w-[340px] shrink-0">

          <ReportProductFilter

            // VIEW
            viewType={viewType}
            setViewType={setViewType}

            // INTEREST
            interest={interest}
            setInterest={setInterest}
            interests={interests}

            // BRANCH
            branch={branch}
            setBranch={setBranch}

            // TIME
            dateMode={dateMode}
            setDateMode={setDateMode}

            timeType={timeType}
            setTimeType={setTimeType}

            fromDate={fromDate}
            toDate={toDate}

            setFromDate={setFromDate}
            setToDate={setToDate}

            formatDate={formatDate}

            // FILTER
            productKeyword={productKeyword}
            setProductKeyword={setProductKeyword}

            category={category}
            setCategory={setCategory}

            foodTypes={foodTypes}
            setFoodTypes={setFoodTypes}
          />

        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          <ReportProductContent

            // VIEW
            viewType={viewType}

            // INTEREST
            interest={interest}

            // TIME
            fromDate={fromDate}
            toDate={toDate}
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
            exportRef={exportRef}
          />

        </div>

      </div>

    </div>

  </div>
);
}
