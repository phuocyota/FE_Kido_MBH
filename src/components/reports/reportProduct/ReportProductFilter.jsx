import React, { useState } from "react";

import {
  ChevronDown,
  Calendar,
} from "lucide-react";

export default function ReportProductFilter({

  // VIEW
  viewType,
  setViewType,

  // INTEREST
  interest,
  setInterest,
  interests,

  // BRANCH
  branch,
  setBranch,

  // TIME
  dateMode,
  setDateMode,

  timeType,
  setTimeType,

  fromDate,
  toDate,

  setFromDate,
  setToDate,

  formatDate,

  // FILTER
  productKeyword,
  setProductKeyword,

  category,
  setCategory,

  foodTypes,
  setFoodTypes,
}) {

  const [openInterest, setOpenInterest] =
    React.useState(false);

  const [openTime, setOpenTime] =
    React.useState(false);


  const toggleFoodType = (item) => {

    if (foodTypes.includes(item)) {
      setFoodTypes(
        foodTypes.filter(
          (x) => x !== item
        )
      );
    } else {
      setFoodTypes([
        ...foodTypes,
        item,
      ]);
    }
  };


  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        p-5
      "
    >


      {/* DISPLAY */}
<div className="mb-8">

  <h2 className="font-semibold text-xl mb-5">
    Kiểu hiển thị
  </h2>

  <div className="space-y-4">

    {/* BIỂU ĐỒ */}
    {interest === "Bán hàng" && (

      <label
        className="
          flex items-center gap-3
          cursor-pointer
          border rounded-2xl p-4
        "
        style={{
          borderColor:
            viewType === "chart"
              ? "#2563eb"
              : "#e5e7eb",

          background:
            viewType === "chart"
              ? "#eff6ff"
              : "#ffffff",
        }}
      >

        <input
          type="radio"
          checked={viewType === "chart"}
          onChange={() =>
            setViewType("chart")
          }
          className="w-5 h-5"
        />

        <span className="text-lg font-medium">
          Biểu đồ
        </span>

      </label>

    )}

    {/* DỌC */}
    <label
      className="
        flex items-center gap-3
        cursor-pointer
        border rounded-2xl p-4
      "
      style={{
        borderColor:
          viewType === "portrait"
            ? "#2563eb"
            : "#e5e7eb",

        background:
          viewType === "portrait"
            ? "#eff6ff"
            : "#ffffff",
      }}
    >

      <input
        type="radio"
        checked={viewType === "portrait"}
        onChange={() =>
          setViewType("portrait")
        }
        className="w-5 h-5"
      />

      <span className="text-lg font-medium">
        Báo cáo dọc
      </span>

    </label>

    {/* NGANG */}
    <label
      className="
        flex items-center gap-3
        cursor-pointer
        border rounded-2xl p-4
      "
      style={{
        borderColor:
          viewType === "landscape"
            ? "#2563eb"
            : "#e5e7eb",

        background:
          viewType === "landscape"
            ? "#eff6ff"
            : "#ffffff",
      }}
    >

      <input
        type="radio"
        checked={
          viewType === "landscape"
        }
        onChange={() =>
          setViewType("landscape")
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
      bg-white
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

                const active =
                  interest === item;

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

                ${active
                        ? "bg-[#EAF7EE]"
                        : "hover:bg-gray-50"
                      }
              `}
                  >

                    <span
                      className={`
                  text-[16px]
                  font-medium

                  ${active
                          ? "text-[#16A34A]"
                          : "text-gray-700"
                        }
                `}
                    >
                      {item}
                    </span>

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
      <div className="mb-8">

        <h2 className="font-semibold text-xl mb-5">
          Thời gian
        </h2>

        <div className="space-y-5">

          {/* PRESET */}
          <label className="flex gap-3 items-start">

            {/* RADIO */}
            <div
              onClick={() =>
                setDateMode("preset")
              }
              className={`
          mt-5
          w-5
          h-5
          rounded-full
          border-2
          cursor-pointer
          flex
          items-center
          justify-center

          ${dateMode === "preset"
                  ? "border-purple-500"
                  : "border-gray-400"
                }
        `}
            >

              {dateMode === "preset" && (
                <div
                  className="
              w-2.5
              h-2.5
              rounded-full
              bg-purple-500
            "
                />
              )}

            </div>


            {/* BOX */}
            <div className="flex-1 relative">

              {/* COMBOBOX */}
              <button
                onClick={() =>
                  setOpenTime(!openTime)
                }
                className="
      w-full
      h-14
      border-2
      border-gray-300
      rounded-2xl
      px-4
      flex
      items-center
      justify-between
      text-lg
      bg-white
    "
              >

                {/* VALUE */}
                <span
                  className="
        text-[17px]
        font-medium
        text-gray-800
      "
                >
                  {timeType || "Hôm nay"}
                </span>

                <ChevronDown
                  size={22}
                  className={`
        transition-all
        duration-200
        ${openTime
                      ? "rotate-180"
                      : ""
                    }
      `}
                />

              </button>

              {/* DROPDOWN */}
              {openTime && (

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

                    {[
                      "Hôm nay",
                      "Hôm qua",
                      "Tuần này",
                      "Tuần trước",
                      "Tháng này",
                      "Tháng trước",
                      "Tùy chỉnh",
                    ].map((item) => {

                      const active =
                        timeType === item;

                      return (
                        <button
                          key={item}
                          onClick={() => {

                            setTimeType(item);

                            setOpenTime(false);
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

                ${active
                              ? "bg-[#EAF7EE]"
                              : "hover:bg-gray-50"
                            }
              `}
                        >

                          <span
                            className={`
                  text-[16px]
                  font-medium

                  ${active
                                ? "text-[#16A34A]"
                                : "text-gray-700"
                              }
                `}
                          >
                            {item}
                          </span>

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
          </label>

          {/* CUSTOM */}
          <label className="flex gap-3 items-start">

            {/* RADIO */}
            <div
              onClick={() =>
                setDateMode("custom")
              }
              className={`
          mt-5
          w-5
          h-5
          rounded-full
          border-2
          cursor-pointer
          flex
          items-center
          justify-center

          ${dateMode === "custom"
                  ? "border-purple-500"
                  : "border-gray-400"
                }
        `}
            >

              {dateMode === "custom" && (
                <div
                  className="
              w-2.5
              h-2.5
              rounded-full
              bg-purple-500
            "
                />
              )}

            </div>

            {/* BOX */}
            <div
              className="
          flex-1
          border-2
          border-gray-300
          rounded-3xl
          p-4
          bg-white
        "
            >

              {/* TITLE */}
              <div
                className="
    font-semibold
    mb-5
  "
              >

                Từ {fromDate?.split("-").reverse().join("/")}

                <span className="mx-3">-</span>

                Đến {toDate?.split("-").reverse().join("/")}

              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-2 gap-4">

                {/* FROM */}
                <div
                  className="
      h-14
      border
      border-gray-300
      rounded-2xl
      px-4
      flex
      items-center
      justify-between
    "
                >

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(e.target.value)
                    }
                    className="
        outline-none
        bg-transparent
        text-[18px]
        w-full
      "
                  />

                </div>

                {/* TO */}
                <div
                  className="
      h-14
      border
      border-gray-300
      rounded-2xl
      px-4
      flex
      items-center
      justify-between
    "
                >

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(e.target.value)
                    }
                    className="
        outline-none
        bg-transparent
        text-[18px]
        w-full
      "
                  />

                </div>

              </div>

            </div>
          </label>

        </div>
      </div>



      {/* FOOD TYPE */}
      {/* <div>

        <h2 className="filter-title">
          Loại thực đơn
        </h2>

        <div className="space-y-3">

          {[
            "Đồ ăn",
            "Đồ uống",
            "Khác",
          ].map((item) => (

            <label
              key={item}
              className="
                flex
                items-center
                gap-3
                cursor-pointer
              "
            >

              <input
                type="checkbox"
                checked={foodTypes.includes(
                  item
                )}
                onChange={() =>
                  toggleFoodType(
                    item
                  )
                }
                className="w-5 h-5"
              />

              <span className="text-[17px]">
                {item}
              </span>

            </label>
          ))}

        </div>
      </div> */}
    </div>
  );
}