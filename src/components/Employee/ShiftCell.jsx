import React, { useState } from "react";
import { X } from "lucide-react";

export default function ShiftCell({
  shift,
  onAdd,
  onDelete,
}) {
  const [hover, setHover] =
    useState(false);

  const getLabel = () => {
    switch (shift) {
      case "morning":
        return "Ca sáng";

      case "afternoon":
        return "Ca chiều";

      case "full":
        return "Cả ngày";

      default:
        return "";
    }
  };

  const getColor = () => {
    switch (shift) {
      case "morning":
        return "bg-blue-100 text-blue-700";

      case "afternoon":
        return "bg-green-100 text-green-700";

      case "full":
        return "bg-purple-100 text-purple-700";

      default:
        return "";
    }
  };

  return (
    <div
      className="relative min-h-[72px] group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >

      {shift && (
        <>
          {hover && (
            <div className="absolute -top-14 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 whitespace-nowrap">
              {getLabel()}
            </div>
          )}

          <div className={`rounded-md px-3 py-2 text-sm font-medium flex items-center justify-between ${getColor()}`}>

            <span>
              {getLabel()}
            </span>

            {hover && (
              <button
                onClick={onDelete}
                className="ml-2"
              >
                <X size={14} />
              </button>
            )}

          </div>
        </>
      )}

      <button
        onClick={onAdd}
        className="mt-2 text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition"
      >
        + Thêm lịch
      </button>

    </div>
  );
}