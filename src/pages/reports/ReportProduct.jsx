import React, {
  useRef,
  useState,
} from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ReportProductFilter from "../../components/reports/reportProduct/ReportProductFilter";

import ReportProductContent from "../../components/reports/reportProduct/ReportProductContent";

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
    "Lợi nhuận",
    "Xuất nhập tồn",
    "Xuất hủy",
  ];

  // =========================
  // BRANCH
  // =========================
  const [branch, setBranch] =
    useState("Chi nhánh trung tâm");

  // =========================
  // TIME
  // =========================
  const [dateMode, setDateMode] =
    useState("preset");

  const [timeType, setTimeType] =
    useState("Hôm nay");

  const [fromDate, setFromDate] =
    useState("2026-05-07");

  const [toDate, setToDate] =
    useState("2026-05-07");

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
  // EXPORT PDF
  // =========================
  const handleDownloadPDF =
    async () => {

      const element =
        exportRef.current;

      if (!element) return;

      const canvas =
        await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor:
            "#ffffff",
        });

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf = new jsPDF({
        orientation:
          viewType ===
            "portrait"
            ? "portrait"
            : "landscape",

        unit: "mm",
        format: "a4",
      });

      const pdfWidth =
        viewType ===
          "portrait"
          ? 210
          : 297;

      const imgHeight =
        (canvas.height *
          pdfWidth) /
        canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        imgHeight
      );

      pdf.save(
        "Bao_cao_hang_hoa.pdf"
      );
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

    window.print();

  };

  return (
    <div
      className="
        min-h-screen
        bg-[#F3F4F6]

        p-2
        sm:p-4
        lg:p-5
      "
    >

      <div
        className="
          max-w-[1800px]
          mx-auto
        "
      >

        {/* HEADER */}
        <div
          className="
            mb-4
            lg:mb-5

            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          "
        >

          <h1
            className="
              font-bold
              text-gray-800

              text-2xl
              sm:text-3xl
              lg:text-4xl
            "
          >
            Báo cáo hàng hóa
          </h1>

        </div>

        {/* BODY */}
        <div
          className="
            flex
            flex-col

            2xl:flex-row
            gap-4
          "
        >

          {/* FILTER */}
          <div
            className="
              w-full

              2xl:w-[340px]
              2xl:min-w-[340px]

              shrink-0
            "
          >

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
              setProductKeyword={
                setProductKeyword
              }

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

              handleDownloadPDF={
                handleDownloadPDF
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

    </div>
  );
}