import React from "react";
import {
  ChevronDown,
  Calendar,
} from "lucide-react";

export default function ReportFilter({
  reportType,
  setReportType,
  interest,
  interests,
  openInterest,
  setOpenInterest,
  setInterest,
  dateType,
  setDateType,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  formatDate,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderColor: "#e5e7eb",
      }}
      className="
        report-sidebar
        w-full
        xl:w-[340px]
        shrink-0
        rounded-3xl
        shadow-sm
        border
        p-5
        h-fit
      "
    >

      {/* DISPLAY */}
      <div className="mb-8">

        <h2 className="font-semibold text-xl mb-5">
          Kiểu hiển thị
        </h2>

        <div className="space-y-4">

          <label
            className="
              flex items-center gap-3
              cursor-pointer
              border rounded-2xl p-4
            "
            style={{
              borderColor:
                reportType === "portrait"
                  ? "#2563eb"
                  : "#e5e7eb",

              background:
                reportType === "portrait"
                  ? "#eff6ff"
                  : "#ffffff",
            }}
          >

            <input
              type="radio"
              checked={
                reportType === "portrait"
              }
              onChange={() =>
                setReportType("portrait")
              }
              className="w-5 h-5"
            />

            <span className="text-lg font-medium">
              Báo cáo dọc
            </span>

          </label>

          <label
            className="
              flex items-center gap-3
              cursor-pointer
              border rounded-2xl p-4
            "
            style={{
              borderColor:
                reportType === "landscape"
                  ? "#2563eb"
                  : "#e5e7eb",

              background:
                reportType === "landscape"
                  ? "#eff6ff"
                  : "#ffffff",
            }}
          >

            <input
              type="radio"
              checked={
                reportType === "landscape"
              }
              onChange={() =>
                setReportType("landscape")
              }
              className="w-5 h-5"
            />

            <span className="text-lg font-medium">
              Báo cáo ngang
            </span>

          </label>

        </div>
      </div>

      {/* INTEREST */}
      <div className="mb-8 relative">

        <h2 className="font-semibold text-xl mb-4">
          Mối quan tâm
        </h2>

        <button
          onClick={() =>
            setOpenInterest(!openInterest)
          }
          className="
            w-full
            h-14
            border
            border-gray-300
            rounded-2xl
            px-4
            flex
            items-center
            justify-between
            text-lg
          "
        >

          <span>{interest}</span>

          <ChevronDown size={22} />

        </button>

        {/* DROPDOWN */}
{openInterest && (
  <div
    className="
      absolute
      left-0
      right-0
      mt-3
      bg-white
      rounded-[28px]
      border
      border-gray-200
      shadow-[0_15px_50px_rgba(0,0,0,0.12)]
      overflow-hidden
      z-50
      p-2
    "
  >
    <div className="max-h-[320px] overflow-y-auto">
      {interests.map((item) => {
        const active = interest === item;

        return (
          <button
            key={item}
            onClick={() => {
              setInterest(item);
              setOpenInterest(false);
            }}
            className={`
              w-full
              px-5
              py-4
              rounded-2xl
              text-left
              transition-all
              duration-200
              flex
              items-center
              justify-between
              mb-1
              ${
                active
                  ? "bg-[#EAF7EE]"
                  : "hover:bg-gray-50"
              }
            `}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <span
                className={`
                  text-[16px]
                  font-medium
                  ${
                    active
                      ? "text-[#16A34A]"
                      : "text-gray-700"
                  }
                `}
              >
                {item}
              </span>
            </div>

            {/* CHECK */}
            {active && (
              <div
                className="
                  w-6
                  h-6
                  rounded-full
                  bg-[#16A34A]
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                "
              >
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
)}
      </div>

      {/* TIME */}
<div>

  <h2 className="font-semibold text-xl mb-5">
    Thời gian
  </h2>

  <div className="space-y-5">

    {/* SINGLE DATE */}
    <label className="flex gap-3 items-start">

      <input
        type="radio"
        checked={dateType === "single"}
        onChange={() => setDateType("single")}
        className="w-5 h-5 mt-4"
      />

      <div className="flex-1">

        <div className="h-14 border-2 border-gray-300 rounded-2xl px-4 flex items-center justify-between bg-white">

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="outline-none bg-transparent text-lg w-full"
          />

        </div>

      </div>
    </label>

    {/* RANGE DATE */}
    <label className="flex gap-3 items-start">

      <input
        type="radio"
        checked={dateType === "range"}
        onChange={() => setDateType("range")}
        className="w-5 h-5 mt-4"
      />

      <div className="flex-1 border-2 border-gray-300 rounded-2xl p-4 bg-white">

        <div className="flex justify-between mb-4">

          <div className="font-semibold">
            Từ {formatDate(fromDate)}
            <span className="mx-2">-</span>
            Đến {formatDate(toDate)}
          </div>

        </div>

        <div className="grid grid-cols-2 gap-3">

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-12 border border-gray-300 rounded-xl px-3"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-12 border border-gray-300 rounded-xl px-3"
          />

        </div>

      </div>

    </label>

    {/* BY HOUR */}
    <label className="flex gap-3 items-start">

      <input
        type="radio"
        checked={dateType === "hour"}
        onChange={() => setDateType("hour")}
        className="w-5 h-5 mt-4"
      />

      <div className="flex-1 border-2 border-gray-300 rounded-2xl p-4 bg-white">

        <div className="font-semibold mb-4">
          Theo giờ
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <div className="text-sm text-gray-500 mb-2">
              Từ giờ
            </div>

            <input
              type="time"
              className="h-12 w-full border border-gray-300 rounded-xl px-3"
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">
              Đến giờ
            </div>

            <input
              type="time"
              className="h-12 w-full border border-gray-300 rounded-xl px-3"
            />
          </div>

        </div>

      </div>

    </label>

  </div>

</div>
    </div>
  );
}