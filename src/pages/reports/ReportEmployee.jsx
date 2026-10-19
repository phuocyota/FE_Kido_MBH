import { exportReportExcel, printReport } from "../../components/reports/reportActions";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { reportApi } from "../../api";
import { getProductReportRange } from "../../components/reports/reportProduct/productReportData";

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
    useState("Hôm nay");

  // =========================
  // EMPLOYEE
  // =========================
  const [employee, setEmployee] =
    useState("all");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customRange, setCustomRange] = useState(null);

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await reportApi.getEmployeeReport({
          ...(customRange || getProductReportRange(period)),
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
  }, [employee, period, customRange]);

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
  const handleDownloadExcel = () => exportReportExcel(exportRef.current, "Bao_cao_nhan_vien.xlsx");
  const handlePrint = () => printReport(exportRef.current, viewType === "horizontal");

  return (
    <div className="erp-page bg-[#F3F4F6]">

      <div className="erp-content">

        {/* HEADER */}
        <div className="erp-page-header">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0"><h1 className="font-bold text-gray-800 text-2xl sm:text-3xl lg:text-4xl">
              Báo cáo nhân viên
            </h1><p className="mt-1 text-xs leading-5 text-slate-500">Xem thống kê thời gian làm việc và kết quả bán hàng của nhân viên theo kỳ.</p></div>

            <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
              <EmployeeReportSidebar
                viewType={viewType}
                setViewType={setViewType}
                focusType={focusType}
                setFocusType={setFocusType}
                period={period}
                setPeriod={(value) => { setPeriod(value); setCustomRange(null); }}
                onChangeCustomRange={setCustomRange}
                customRange={customRange}
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
