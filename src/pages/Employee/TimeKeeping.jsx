import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock3,
  MoreHorizontal,
} from "lucide-react";

export default function TimeKeeping() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDays = (date) => {
    const current = new Date(date);

    const day =
      current.getDay() === 0
        ? 7
        : current.getDay();

    const monday = new Date(current);

    monday.setDate(
      current.getDate() - day + 1
    );

    return Array.from(
      { length: 7 },
      (_, index) => {
        const d = new Date(monday);

        d.setDate(
          monday.getDate() + index
        );

        return d;
      }
    );
  };

  const weekDays =
    getWeekDays(currentDate);

  const month =
    weekDays[0].getMonth() + 1;

  const year =
    weekDays[0].getFullYear();

  const weekNumber =
    Math.ceil(
      weekDays[0].getDate() / 7
    );

  const [viewMode, setViewMode] = useState("week");

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const lastDay = new Date(
      year,
      month + 1,
      0
    ).getDate();

    return Array.from(
      { length: lastDay },
      (_, i) =>
        new Date(
          year,
          month,
          i + 1
        )
    );
  };

  const monthDays =
    getMonthDays(currentDate);

  const displayDays =
    viewMode === "day"
      ? [currentDate]
      : viewMode === "month"
        ? monthDays
        : weekDays;

  const dayNames = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];


  const shortDayNames = [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
  ];


  const shifts = [
    {
      id: "morning",
      name: "Ca sáng",
      time: "08:00 - 12:00",
    },
    {
      id: "afternoon",
      name: "Ca chiều",
      time: "13:00 - 17:00",
    },
    {
      id: "full",
      name: "Cả ngày",
      time: "08:00 - 17:00",
    },
  ];

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);

    if (viewMode === "day")
      prev.setDate(
        prev.getDate() - 1
      );

    if (viewMode === "week")
      prev.setDate(
        prev.getDate() - 7
      );

    if (viewMode === "month")
      prev.setMonth(
        prev.getMonth() - 1
      );

    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);

    if (viewMode === "day")
      next.setDate(
        next.getDate() + 1
      );

    if (viewMode === "week")
      next.setDate(
        next.getDate() + 7
      );

    if (viewMode === "month")
      next.setMonth(
        next.getMonth() + 1
      );

    setCurrentDate(next);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 sm:p-4 md:p-5">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

        <h1 className="text-2xl md:text-3xl font-bold">
          Bảng chấm công
        </h1>

      </div>

      {/* Toolbar */}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Tìm kiếm nhân viên"
              className="w-full sm:w-[250px] h-[40px] bg-white border border-gray-300 rounded-lg pl-10 pr-4"
            />

          </div>

          <select
            value={viewMode}
            onChange={(e) =>
              setViewMode(e.target.value)
            }
            className="w-full sm:w-auto h-[40px] px-4 bg-white border border-gray-300 rounded-lg font-medium"
          >
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
          </select>

          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">

            <button
              onClick={handlePrevWeek}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="px-4 font-medium whitespace-nowrap">

  {viewMode === "day" &&
    `${dayNames[currentDate.getDay()]}, Ngày ${currentDate.getDate()}/${currentDate.getMonth() + 1}`}

  {viewMode === "week" &&
    `Tuần ${weekNumber} - Th. ${month} ${year}`}

  {viewMode === "month" &&
    `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`}

</div>

            <button
              onClick={handleNextWeek}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

          <button className="h-[40px] px-4 bg-white border border-gray-300 rounded-lg">
            Chọn
          </button>

        </div>

      </div>

      {/* Grid */}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header ngày */}

          <div
            className="grid min-w-max"
            style={{
              gridTemplateColumns: `160px repeat(${displayDays.length}, minmax(90px,1fr))`,
            }}
          >

            <div className="border-r border-b p-4 flex items-center justify-between font-semibold">

              <span>Ca làm việc</span>



            </div>

            {displayDays.map((day, index) => (
              <div
                key={index}
                className="border-r border-b p-3 text-center"
              >
                <div className="text-sm font-medium">
                  {viewMode === "month"
  ? shortDayNames[day.getDay()]
  : dayNames[day.getDay()]
}
                </div>

                <div className="mt-1">
                  {String(
                    day.getDate()
                  ).padStart(2, "0")}
                </div>
              </div>
            ))}

          </div>

          {/* Ca làm việc */}

          {shifts.map((shift) => (

            <div
              key={shift.id}
              className="grid min-w-[900px]"
              style={{
                gridTemplateColumns: `160px repeat(${displayDays.length}, minmax(90px,1fr))`
              }}
            >

              <div className="border-r border-b p-3">

                <div className="font-semibold">
                  {shift.name}
                </div>

                <div className="text-sm text-gray-500">
                  {shift.time}
                </div>

              </div>

              {displayDays.map((day) => (

                <div
                  key={`${shift.id}-${day.toISOString()}`}
                  className="border-r border-b min-h-[84px] hover:bg-blue-50 cursor-pointer transition-colors"
                />

              ))}

            </div>

          ))}

          {/* Empty State */}

          <div className="py-10 md:py-16 px-4 flex flex-col items-center justify-center text-center">

            <Clock3 className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />

            <p className="mt-4 text-lg text-gray-700">
              Nhân viên của bạn chưa có lịch làm việc.
            </p>



          </div>

        </div>
      </div>

      {/* Legend */}

      <div className="mt-6 px-2">

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl md:rounded-full px-4 py-3 flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 " />
            Đúng giờ
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            Đi muộn / Về sớm
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Chấm công thiếu
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            Chưa chấm công
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            Nghỉ làm
          </div>

        </div>

      </div>

    </div>
  );
}