import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const timeOptions = [
  "Hôm nay",
  "Hôm qua",
  "Tuần này",
  "Tuần trước",
  "Tháng này",
  "Tháng trước",
  "Toàn thời gian",
];

const levelOptions = [
  { value: "all", label: "Tất cả khối lớp" },
  { value: "preschool", label: "Mầm non" },
  { value: "primary", label: "Tiểu học" },
];

const mealOptions = [
  { value: "all", label: "Tất cả bữa ăn" },
  { value: "BREAKFAST", label: "Ăn sáng" },
  { value: "LUNCH", label: "Ăn trưa" },
  { value: "AFTERNOON", label: "Ăn xế" },
  { value: "DINNER", label: "Ăn tối" },
];

export default function ReportBoardingFilter({
  viewType,
  setViewType,
  interest,
  setInterest,
  interests,
  branch,
  setBranch,
  dateMode,
  setDateMode,
  timeType,
  setTimeType,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  formatDate,
  level,
  setLevel,
  mealPeriod,
  setMealPeriod,
}) {
  const [openInterest, setOpenInterest] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* KIỂU HIỂN THỊ */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Kiểu hiển thị</h2>
        <div className="grid grid-cols-2 gap-3">
          <label
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 transition duration-150 hover:bg-slate-50"
            style={{
              borderColor: viewType === "chart" ? "#2563eb" : "#e5e7eb",
              background: viewType === "chart" ? "#eff6ff" : "#ffffff",
              color: viewType === "chart" ? "#1d4ed8" : "#374151",
              fontWeight: viewType === "chart" ? "600" : "500",
            }}
          >
            <input
              type="radio"
              checked={viewType === "chart"}
              onChange={() => setViewType("chart")}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm">Biểu đồ</span>
          </label>

          <label
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 transition duration-150 hover:bg-slate-50"
            style={{
              borderColor: viewType === "report" ? "#2563eb" : "#e5e7eb",
              background: viewType === "report" ? "#eff6ff" : "#ffffff",
              color: viewType === "report" ? "#1d4ed8" : "#374151",
              fontWeight: viewType === "report" ? "600" : "500",
            }}
          >
            <input
              type="radio"
              checked={viewType === "report"}
              onChange={() => setViewType("report")}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm">Báo cáo</span>
          </label>
        </div>
      </div>

      {/* MỐI QUAN TÂM */}
      <div className="relative mb-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Mối quan tâm</h2>
        <button
          type="button"
          onClick={() => setOpenInterest((current) => !current)}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700"
        >
          <span>{interest}</span>
          <ChevronDown size={18} className="text-gray-400" />
        </button>

        {openInterest && (
          <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
            <div className="max-h-[250px] overflow-y-auto">
              {interests.map((item) => {
                const active = interest === item;
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setInterest(item);
                      setOpenInterest(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition ${
                      active ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item}</span>
                    {active && <span className="text-blue-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CHI NHÁNH */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Chi nhánh</h2>
        <input
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          placeholder="Tất cả chi nhánh"
          className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* KHỐI LỚP VÀ BỮA ĂN */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Khối lớp</h2>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Bữa ăn</h2>
          <select
            value={mealPeriod}
            onChange={(event) => setMealPeriod(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {mealOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THỜI GIAN */}
      <div className="mb-2">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Thời gian</h2>
        <div className="space-y-4">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="radio"
              checked={dateMode === "preset"}
              onChange={() => setDateMode("preset")}
              className="mt-3.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setDateMode("preset");
                  setOpenTime((current) => !current);
                }}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700"
              >
                <span>{timeType || "Hôm nay"}</span>
                <ChevronDown size={18} className={`text-gray-400 transition-all duration-200 ${openTime ? "rotate-180" : ""}`} />
              </button>

              {openTime && (
                <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                  {timeOptions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setTimeType(item);
                        setDateMode("preset");
                        setOpenTime(false);
                      }}
                      className={`flex w-full rounded-lg px-4 py-2 text-left text-sm transition ${
                        timeType === item ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="radio"
              checked={dateMode === "custom"}
              onChange={() => setDateMode("custom")}
              className="mt-3.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <div className="flex-1 rounded-xl border border-gray-300 bg-white p-3 space-y-3">
              <div className="text-xs font-bold text-gray-700">
                Từ {formatDate(fromDate)} - Đến {formatDate(toDate)}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setDateMode("custom");
                    setFromDate(event.target.value);
                  }}
                  className="h-10 rounded-lg border border-gray-300 px-2 text-xs focus:outline-none"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setDateMode("custom");
                    setToDate(event.target.value);
                  }}
                  className="h-10 rounded-lg border border-gray-300 px-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
