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

const categoryOptions = ["Tất cả", "Đồ ăn", "Đồ uống", "Khác"];
const foodTypeOptions = ["Đồ ăn", "Đồ uống", "Khác"];

export default function ReportProductFilter({
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
  productKeyword,
  setProductKeyword,
  category,
  setCategory,
  foodTypes,
  setFoodTypes,
}) {
  const [openInterest, setOpenInterest] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const toggleFoodType = (item) => {
    setFoodTypes(
      foodTypes.includes(item)
        ? foodTypes.filter((value) => value !== item)
        : [...foodTypes, item]
    );
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-8">
        <h2 className="mb-5 text-xl font-semibold">Kiểu hiển thị</h2>

        <div className="space-y-4">
          {interest === "Bán hàng" && (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4"
              style={{
                borderColor: viewType === "chart" ? "#2563eb" : "#e5e7eb",
                background: viewType === "chart" ? "#eff6ff" : "#ffffff",
              }}
            >
              <input
                type="radio"
                checked={viewType === "chart"}
                onChange={() => setViewType("chart")}
                className="h-5 w-5"
              />
              <span className="text-lg font-medium">Biểu đồ</span>
            </label>
          )}

          <label
            className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4"
            style={{
              borderColor: viewType === "report" ? "#2563eb" : "#e5e7eb",
              background: viewType === "report" ? "#eff6ff" : "#ffffff",
            }}
          >
            <input
              type="radio"
              checked={viewType === "report"}
              onChange={() => setViewType("report")}
              className="h-5 w-5"
            />
            <span className="text-lg font-medium">Báo cáo</span>
          </label>
        </div>
      </div>

      <div className="relative mb-8">
        <h2 className="mb-4 text-xl font-semibold">Mối quan tâm</h2>

        <button
          type="button"
          onClick={() => setOpenInterest((current) => !current)}
          className="flex h-14 w-full items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 text-lg"
        >
          <span>{interest}</span>
          <ChevronDown size={22} />
        </button>

        {openInterest && (
          <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-[0_15px_50px_rgba(0,0,0,0.12)]">
            <div className="max-h-[320px] overflow-y-auto">
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
                    className={`mb-1 flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition ${
                      active ? "bg-[#EAF7EE]" : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-[16px] font-medium ${
                        active ? "text-[#16A34A]" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </span>

                    {active && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] text-sm font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Chi nhánh</h2>

        <input
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          placeholder="Tất cả chi nhánh"
          className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4"
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-5 text-xl font-semibold">Thời gian</h2>

        <div className="space-y-5">
          <label className="flex items-start gap-3">
            <input
              type="radio"
              checked={dateMode === "preset"}
              onChange={() => setDateMode("preset")}
              className="mt-5 h-5 w-5 shrink-0 accent-blue-600"
            />

            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setDateMode("preset");
                  setOpenTime((current) => !current);
                }}
                className="flex h-14 w-full items-center justify-between rounded-2xl border-2 border-gray-300 bg-white px-4 text-lg"
              >
                <span className="text-[17px] font-medium text-gray-800">
                  {timeType || "Hôm nay"}
                </span>
                <ChevronDown
                  size={22}
                  className={`transition-all duration-200 ${
                    openTime ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openTime && (
                <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                  {timeOptions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setTimeType(item);
                        setDateMode("preset");
                        setOpenTime(false);
                      }}
                      className={`mb-1 block w-full rounded-xl px-4 py-3 text-left transition ${
                        timeType === item
                          ? "bg-[#EAF7EE] font-semibold text-[#16A34A]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="radio"
              checked={dateMode === "custom"}
              onChange={() => setDateMode("custom")}
              className="mt-5 h-5 w-5 shrink-0 accent-blue-600"
            />

            <div className="flex-1 rounded-3xl border-2 border-gray-300 bg-white p-4">
              <div className="mb-5 font-semibold">
                Từ {formatDate(fromDate)}
                <span className="mx-3">-</span>
                Đến {formatDate(toDate)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setDateMode("custom");
                    setFromDate(event.target.value);
                  }}
                  className="h-14 rounded-2xl border border-gray-300 px-4 text-[18px]"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setDateMode("custom");
                    setToDate(event.target.value);
                  }}
                  className="h-14 rounded-2xl border border-gray-300 px-4 text-[18px]"
                />
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="radio"
              checked={dateMode === "hour"}
              onChange={() => setDateMode("hour")}
              className="mt-5 h-5 w-5 shrink-0 accent-blue-600"
            />

            <div className="flex-1 rounded-3xl border-2 border-gray-300 bg-white p-4">
              <div className="mb-5 font-semibold">Theo giờ</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm text-gray-500">Từ giờ</div>
                  <input
                    type="time"
                    className="h-14 w-full rounded-2xl border border-gray-300 px-4"
                  />
                </div>

                <div>
                  <div className="mb-2 text-sm text-gray-500">Đến giờ</div>
                  <input
                    type="time"
                    className="h-14 w-full rounded-2xl border border-gray-300 px-4"
                  />
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-xl font-semibold">Hàng hóa</h2>

        <div className="space-y-4">
          <input
            value={productKeyword}
            onChange={(event) => setProductKeyword(event.target.value)}
            placeholder="Theo mã, tên hàng"
            className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 w-full rounded-2xl border border-gray-300 bg-white px-4"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item === "Tất cả" ? "" : item}>
                {item}
              </option>
            ))}
          </select>

          <div className="space-y-3">
            {foodTypeOptions.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={foodTypes.includes(item)}
                  onChange={() => toggleFoodType(item)}
                  className="h-5 w-5 accent-purple-600"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
