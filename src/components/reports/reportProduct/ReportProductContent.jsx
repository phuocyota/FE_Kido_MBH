import React, { useState } from "react";

import {
  RotateCcw,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  FileSpreadsheet,
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
  branch,
  branchId,
  productKeyword,
  category,
  foodTypes,

  // ZOOM
  zoom,

  // ACTIONS
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleFullscreen,
  handleDownloadExcel,
  handlePrint,

  // REFS
  previewRef,
}) {
  const [revision, setRevision] = useState(0);

  return (
    <div className="flex-1 min-w-0 rounded-3xl shadow-sm border border-gray-300 overflow-hidden bg-white">
      {/* TOOLBAR */}
      <div className="h-16 px-4 flex items-center gap-2 overflow-x-auto bg-gray-600 text-white">
        <button
          type="button"
          title="Làm mới báo cáo"
          aria-label="Làm mới báo cáo"
          onClick={() => {
            handleResetZoom();
            setRevision((value) => value + 1);
          }}
          className="toolbar-btn"
        >
          <RotateCcw size={24} />
        </button>
        <div className="flex-1" />

        <button onClick={handleDownloadExcel} className="toolbar-btn">
          <FileSpreadsheet size={24} />
        </button>

        <button onClick={handlePrint} className="toolbar-btn">
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
            transform: window.innerWidth < 768 ? "scale(1)" : `scale(${zoom})`,

            transformOrigin: "top left",
          }}
          className="inline-block transition-all duration-300 shadow-xl border bg-white"
        >
          {/* REPORTS */}
          {interest === "Bán hàng" &&
            (viewType === "chart" ? (
              <ProductSaleChart
                productKeyword={productKeyword}
                category={category}
                foodTypes={foodTypes}
                key={revision}
                fromDate={fromDate}
                toDate={toDate}
                branch={branch}
                branchId={branchId}
              />
            ) : (
              <ProductSaleReport
                branch={branch}
                productKeyword={productKeyword}
                category={category}
                foodTypes={foodTypes}
                key={revision}
                fromDate={fromDate}
                toDate={toDate}
                branchId={branchId}
              />
            ))}

          {interest === "Lợi nhuận" && (
            <ProductProfitReport
              fromDate={fromDate}
              toDate={toDate}
              branch={branch}
            />
          )}

          {interest === "Tồn kho hiện tại" && (
            <ProductInventoryReport
              branch={branch}
              productKeyword={productKeyword}
              category={category}
              foodTypes={foodTypes}
              key={revision}
              fromDate={fromDate}
              toDate={toDate}
              branchId={branchId}
            />
          )}

          {interest === "Xuất hủy" && (
            <ProductCancelReport
              fromDate={fromDate}
              toDate={toDate}
              branch={branch}
            />
          )}
        </div>
      </div>
    </div>
  );
}
