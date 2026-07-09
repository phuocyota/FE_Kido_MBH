import React from "react";
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  FileSpreadsheet,
} from "lucide-react";
import EmployeeReportChart from "./EmployeeReportChart";
 
import EmployeeReportTableTime from "./EmployeeReportTableTime";
import EmployeeProfitReport from "./EmployeeProfitReport";
import EmployeeCashierReport from "./EmployeeCashierReport";

export default function EmployeeReportContent({
  viewType,
  focusType,
  reportData,
  loading,
  error,

  zoom,

  handleZoomIn,
  handleZoomOut,
  handleFullscreen,
  handleDownloadExcel,
  handlePrint,

  previewRef,
  exportRef,
}) {
  return (
    <div className="flex-1 min-w-0 rounded-3xl shadow-sm border border-gray-300 overflow-hidden bg-white">
      {/* TOOLBAR */}
      <div className="h-16 px-4 flex items-center gap-2 overflow-x-auto bg-gray-600 text-white">
        <div className="flex-1" />

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
      <div className="relative h-[75vh] overflow-x-auto overflow-y-auto p-2 sm:p-5 flex justify-start lg:justify-center bg-gray-200">
        {loading && (
          <div className="absolute top-20 left-10 mb-3 rounded-lg bg-white p-3 text-sm text-gray-500 shadow-md z-10">
            Đang tải báo cáo...
          </div>
        )}
        {error && (
          <div className="absolute top-20 left-10 mb-3 rounded-lg bg-white p-3 text-sm text-red-600 shadow-md z-10">
            {error}
          </div>
        )}
        <div
          ref={(el) => {
            previewRef.current = el;
            exportRef.current = el;
          }}
          style={{
            transform:
              window.innerWidth < 768
                ? "scale(1)"
                : `scale(${zoom})`,
            transformOrigin: "top center",
          }}
          className="min-w-max transition-all duration-300 shadow-xl border bg-white"
        >
          {/* Render report sau */}

          {focusType === "time" &&
          viewType === "chart" && (
            <EmployeeReportChart rows={reportData?.chart || []} />
          )}


          {
            focusType === "time" &&
            viewType === "report" && (
              <EmployeeReportTableTime rows={reportData?.sales || []} reportData={reportData} />
            )
          }

          {
            focusType === "profit" && (
              <EmployeeProfitReport
                viewType={viewType}
                rows={reportData?.profit || []}
                reportData={reportData}
              />
            )
          }

          {
            focusType === "cashier" && (
              <EmployeeCashierReport
                viewType={viewType}
                rows={reportData?.cashier || []}
                reportData={reportData}
              />
            )
          }
        </div>

         
      </div>
    </div>
  );
}
