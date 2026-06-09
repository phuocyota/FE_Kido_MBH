import React from "react";

import {
  RotateCcw,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  FileSpreadsheet,
  FileText,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import ProductSaleReport from "./ProductSaleReport";
import ProductProfitReport from "./ProductProfitReport";
import ProductInventoryReport from "./ProductInventoryReport";
import ProductCancelReport from "./ProductCancelReport";
import ProductSaleChart from "./ProductSaleChart";

export default function ReportProductContent({

  // VIEW
  viewType,

  // INTEREST
  interest,

  // TIME
  fromDate,
  toDate,

  // ZOOM
  zoom,

  // ACTIONS
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleFullscreen,
  handleDownloadPDF,
  handleDownloadExcel,
  handlePrint,

  // REFS
  previewRef,
  exportRef,

}) {

  return (

    <div className="flex-1 min-w-0 rounded-3xl shadow-sm border border-gray-300 overflow-hidden bg-white">

      {/* TOOLBAR */}
      <div className="h-16 px-4 flex items-center gap-2 overflow-x-auto bg-gray-600 text-white">

       

        <div className="flex-1" />

         

        <button onClick={handleDownloadExcel} className="toolbar-btn">
          <FileSpreadsheet size={24} />
        </button>


        <button
          onClick={handlePrint}
          className="toolbar-btn"
        >
          <Printer size={24} />
        </button>

        

        <button onClick={handleZoomIn} className="toolbar-btn">
          <ZoomIn size={24} />
        </button>

        <button onClick={handleZoomOut} className="toolbar-btn">
          <ZoomOut size={24} />
        </button>

        <button onClick={handleFullscreen} className="toolbar-btn">
          <Maximize size={24} />
        </button>

      </div>

      {/* PREVIEW */}
      <div className="h-[75vh] overflow-auto p-5 bg-gray-200">

        <div
          ref={previewRef}
          style={{
            transform:
              window.innerWidth < 768
                ? "scale(1)"
                : `scale(${zoom})`,

            transformOrigin: "top left",
          }}
          className="inline-block transition-all duration-300 shadow-xl border bg-white"
        >

          {/* REPORTS */}
          {interest === "Bán hàng" && (

            viewType === "chart"

              ? <ProductSaleChart />

              : <ProductSaleReport fromDate={fromDate} toDate={toDate} />

          )}

          {interest === "Lợi nhuận" && (
            <ProductProfitReport />
          )}

          {interest === "Xuất nhập tồn" && (
            <ProductInventoryReport />
          )}

          {interest === "Xuất hủy" && (
            <ProductCancelReport />
          )}

        </div>

        {/* EXPORT */}
        <div className="fixed left-[-99999px] top-0">

          <div
            ref={exportRef}
            className="bg-white"
          >

            {interest === "Bán hàng" && (

              viewType === "chart"

                ? <ProductSaleChart />

                : <ProductSaleReport fromDate={fromDate} toDate={toDate} />

            )}

            {interest === "Lợi nhuận" && (
              <ProductProfitReport />
            )}

            {interest === "Xuất nhập tồn" && (
              <ProductInventoryReport />
            )}

            {interest === "Xuất hủy" && (
              <ProductCancelReport />
            )}

          </div>

        </div>

      </div>

    </div>

  );

}