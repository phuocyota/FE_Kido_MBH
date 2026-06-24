import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { reportApi } from "../../api";

import EmployeeReportSidebar from "../../components/reports/reportEmployee/EmployeeReportSidebar";
import EmployeeReportContent from "../../components/reports/reportEmployee/EmployeeReportContent";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

export default function ReportEmployee() {
  // =========================
  // VIEW
  // =========================
  const [viewType, setViewType] =
    useState("chart");

  // =========================
  // INTEREST
  // =========================
  const [focusType, setFocusType] =
    useState("time");

  // =========================
  // TIME
  // =========================
  const [period, setPeriod] =
    useState("lastWeek");

  // =========================
  // EMPLOYEE
  // =========================
  const [employee, setEmployee] =
    useState("all");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await reportApi.getEmployeeReport({
          filter: "7days",
          employeeId: employee,
          limit: 10,
        });
        if (active) {
          setReportData(data);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Không thể tải báo cáo nhân viên");
          setReportData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      active = false;
    };
  }, [employee]);

  const employees =
    reportData?.employees?.map((item) => ({
      id: item.id,
      name: item.name,
    })) || [];

  // =========================
  // UI STATE
  // =========================
  const [zoom, setZoom] =
    useState(1);

  const previewRef = useRef();
  const exportRef = useRef();

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
    alert(
      "Xuất Excel đang được phát triển"
    );
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    const printContents =
      exportRef.current?.innerHTML || "";

      const pageOrientation =
  viewType === "horizontal"
    ? "landscape"
    : "portrait";

    const originalContents =
      document.body.innerHTML;

    document.body.innerHTML = `
      <html>

        <head>

          <title>Báo cáo nhân viên</title>

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
              background:white;
            }

            table{
              width:100%;
              border-collapse:collapse;
            }

            th,
            td{
              border:1px solid #94a3b8;
              padding:8px;
              font-size:12px;
            }

            @page{
  size:A4 ${pageOrientation};
  margin:10mm;
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
              Báo cáo nhân viên
            </h1>

            <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
              <EmployeeReportSidebar
                viewType={viewType}
                setViewType={setViewType}
                focusType={focusType}
                setFocusType={setFocusType}
                period={period}
                setPeriod={setPeriod}
                employee={employee}
                setEmployee={setEmployee}
                employees={employees}
              />
            </ToolbarFilterDropdown>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              {focusType === "time"
                ? "Thời gian"
                : focusType === "cashier"
                ? "Thu ngân"
                : "Lợi nhuận"}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-w-0">

            <EmployeeReportContent

              // VIEW
              viewType={viewType}

              // INTEREST
              focusType={focusType}

              reportData={reportData}
              loading={loading}
              error={error}

              // ZOOM
              zoom={zoom}

              // ACTIONS
              handleZoomIn={
                handleZoomIn
              }

              handleZoomOut={
                handleZoomOut
              }

              handleResetZoom={
                handleResetZoom
              }

              handleFullscreen={
                handleFullscreen
              }
 

              handleDownloadExcel={
                handleDownloadExcel
              }

              handlePrint={
                handlePrint
              }

              // REFS
              previewRef={previewRef}

              exportRef={exportRef}
            />

        </div>

      </div>

    </div>
  );
}
