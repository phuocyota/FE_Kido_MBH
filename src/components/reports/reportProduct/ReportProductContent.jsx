import React from "react";

import {
  BarChart3,
  TrendingUp,
  Package,
  Trash2,
} from "lucide-react";


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

 const isPortrait =
  viewType === "portrait";

  return (

  <div
    className="
      flex-1
      min-w-0
      rounded-3xl
      shadow-sm
      border
      border-gray-300
      overflow-hidden
      bg-white
    "
  >

    {/* TOOLBAR */}
    <div
      className="
        h-16
        px-4
        flex
        items-center
        gap-2
        overflow-x-auto
        bg-gray-600
        text-white
      "
    >

      <button
        onClick={handleResetZoom}
        className="toolbar-btn"
      >
        <RotateCcw size={24} />
      </button>

      <button className="toolbar-btn">
        <ChevronsLeft size={24} />
      </button>

      <button className="toolbar-btn">
        <ChevronsRight size={24} />
      </button>

      <div className="flex-1"></div>

      <button
        onClick={handleDownloadPDF}
        className="toolbar-btn"
      >
        <FileText size={24} />
      </button>

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
    <div
      className="
        h-[75vh]
        overflow-x-auto
        overflow-y-auto
        p-2
        sm:p-5
        flex
        justify-start
        lg:justify-center
        bg-gray-200
      "
    >

      <div
        ref={previewRef}
        style={{
          transform:
            window.innerWidth < 768 
              ? "scale(1)" 
              : `scale(${zoom})`, 

          transformOrigin:
            "top center",
        }}
        className={`
          min-w-max
          transition-all
          duration-300

          ${
            isPortrait
              ? `
                w-[210mm]
                min-h-[297mm]
              `
              : `
                w-[297mm]
                min-h-[210mm]
              `
          }

          shadow-xl
          border
          bg-white
        `}
      >

        {/* REPORTS */}
        {interest === "Bán hàng" && (

  viewType === "chart"

    ? <ProductSaleChart />

    : <ProductSaleReport />

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
          style={{
            width:
              viewType === "portrait"
                ? "210mm"
                : "297mm",

            minHeight:
              viewType === "portrait"
                ? "297mm"
                : "210mm",
          }}
          className="bg-white p-10"
        >

          {interest === "Bán hàng" && (

  viewType === "chart"

    ? <ProductSaleChart />

    : <ProductSaleReport />

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