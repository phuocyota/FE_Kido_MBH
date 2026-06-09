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

export default function EmployeeReportContent({
  viewType,
  focusType,

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
      <div className="h-full overflow-auto p-5 bg-gray-200">
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
    transformOrigin: "top left",
  }}
  className="inline-block transition-all duration-300 shadow-xl border bg-white"
>
          {/* Render report sau */}

          {focusType === "time" &&
          viewType === "chart" && (
            <EmployeeReportChart />
          )}


          {
            focusType === "time" &&
            viewType === "report" && (
              <EmployeeReportTableTime />
            )
          }

          {
  focusType === "profit" && (
    <EmployeeProfitReport
      viewType={viewType}
    />
  )
}
        </div>

         
      </div>
    </div>
  );
}