import React from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CustomDatePopup({
  onClose,
}) {
  const days = [
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "CN",
  ];

  return (
    <div className="w-[860px] bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">

      <div className="p-5">

        <h2 className="text-2xl font-semibold mb-6">
          Chọn khoảng thời gian
        </h2>

        <div className="grid grid-cols-2 gap-10">

          {/* Tháng trái */}
          <div>

            <div className="flex items-center justify-between mb-5">

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>

              <span className="font-semibold">
                Tháng 6 2026
              </span>

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronRight size={16} />
              </button>

            </div>

            <div className="grid grid-cols-7 gap-4 text-center">

              {days.map((day) => (
                <div
                  key={day}
                  className="text-gray-500 text-sm"
                >
                  {day}
                </div>
              ))}

              {Array.from(
                { length: 30 },
                (_, i) => i + 1
              ).map((day) => (
                <button
                  key={day}
                  className={`w-9 h-9 rounded-full mx-auto
                  ${
                    day === 2
                      ? "border border-blue-600 text-blue-600"
                      : ""
                  }`}
                >
                  {day}
                </button>
              ))}

            </div>

          </div>

          {/* Tháng phải */}
          <div>

            <div className="flex items-center justify-between mb-5">

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>

              <span className="font-semibold">
                Tháng 7 2026
              </span>

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronRight size={16} />
              </button>

            </div>

            <div className="grid grid-cols-7 gap-4 text-center">

              {days.map((day) => (
                <div
                  key={day}
                  className="text-gray-500 text-sm"
                >
                  {day}
                </div>
              ))}

              {Array.from(
                { length: 31 },
                (_, i) => i + 1
              ).map((day) => (
                <button
                  key={day}
                  className="w-9 h-9 rounded-full mx-auto"
                >
                  {day}
                </button>
              ))}

            </div>

          </div>

        </div>

      </div>

      <div className="border-t px-5 py-4 flex items-center justify-between">

        <button className="text-blue-600 font-medium">
          Hôm nay
        </button>

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="h-10 px-5 border border-gray-300 rounded-xl"
          >
            Bỏ qua
          </button>

          <button className="h-10 px-5 bg-blue-600 text-white rounded-xl">
            Áp dụng
          </button>

        </div>

      </div>

    </div>
  );
}