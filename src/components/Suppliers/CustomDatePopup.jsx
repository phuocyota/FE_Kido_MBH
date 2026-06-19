import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomDatePopup({
  onClose,
  onApply,
}) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSelectDate = (date) => {
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (date < startDate) {
      setEndDate(startDate);
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const isSelected = (date) => {
    return (
      (startDate &&
        date.getTime() === startDate.getTime()) ||
      (endDate &&
        date.getTime() === endDate.getTime())
    );
  };

  const isInRange = (date) => {
    if (!startDate || !endDate) return false;

    return date > startDate && date < endDate;
  };

  const formatDate = (date) => {
    if (!date) return "--";

    return `${String(date.getDate()).padStart(
      2,
      "0"
    )}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${date.getFullYear()}`;
  };

  const handleToday = () => {
    const today = new Date();

    setStartDate(today);
    setEndDate(today);
  };

  const handleApply = () => {
    if (!startDate) return;

    onApply?.({
      startDate,
      endDate: endDate || startDate,
    });

    onClose?.();
  };

  const renderCalendar = (
    month,
    year,
    totalDays,
    title
  ) => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
          <ChevronLeft size={16} />
        </button>

        <span className="font-semibold">
          {title}
        </span>

        <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div
            key={day}
            className="text-gray-500 text-sm mb-2"
          >
            {day}
          </div>
        ))}

        {Array.from(
          { length: totalDays },
          (_, i) => {
            const date = new Date(
              year,
              month,
              i + 1
            );

            return (
              <button
                key={i}
                onClick={() =>
                  handleSelectDate(date)
                }
                className={`
                  w-9 h-9 rounded-full mx-auto text-sm transition
                  ${
                    isSelected(date)
                      ? "bg-blue-600 text-white"
                      : isInRange(date)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {i + 1}
              </button>
            );
          }
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[95vw] lg:w-[860px] bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
      <div className="p-5">
        <h2 className="text-xl lg:text-2xl font-semibold mb-5">
          Chọn khoảng thời gian
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">
            Khoảng thời gian đã chọn
          </div>

          <div className="font-semibold text-lg">
            {formatDate(startDate)} →{" "}
            {formatDate(
              endDate || startDate
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {renderCalendar(
            5,
            2026,
            30,
            "Tháng 6 2026"
          )}

          {renderCalendar(
            6,
            2026,
            31,
            "Tháng 7 2026"
          )}
        </div>
      </div>

      <div className="border-t px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handleToday}
          className="text-blue-600 font-medium"
        >
          Hôm nay
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none h-10 px-5 border border-gray-300 rounded-xl"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleApply}
            className="flex-1 sm:flex-none h-10 px-5 bg-blue-600 text-white rounded-xl"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}