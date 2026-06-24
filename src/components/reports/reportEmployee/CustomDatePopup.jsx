import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomDatePopup({ onClose }) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="p-4 lg:p-5">
        <h2 className="text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
          Chọn khoảng thời gian
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {/* THÁNG TRÁI */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>

              <span className="font-semibold">Tháng 6 2026</span>

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 text-center">
              {days.map((day) => (
                <div key={day} className="text-gray-500 text-xs lg:text-sm">
                  {day}
                </div>
              ))}

              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full mx-auto text-sm ${
                    day === 2
                      ? "border border-blue-600 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* THÁNG PHẢI */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>

              <span className="font-semibold">Tháng 7 2026</span>

              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 text-center">
              {days.map((day) => (
                <div key={day} className="text-gray-500 text-xs lg:text-sm">
                  {day}
                </div>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full mx-auto text-sm hover:bg-gray-100"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-4 lg:px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button className="text-blue-600 font-medium">
          Hôm nay
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none h-10 px-5 border border-gray-300 rounded-xl"
          >
            Bỏ qua
          </button>

          <button className="flex-1 sm:flex-none h-10 px-5 bg-blue-600 text-white rounded-xl">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
