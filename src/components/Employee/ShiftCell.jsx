import React, { useState } from "react";
import { X } from "lucide-react";

export default function ShiftCell({
  shift,
  shiftInfo,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [hover, setHover] = useState(false);
  const hasShift = Boolean(shift);
  const info = shiftInfo || {
    label: "",
    timeRange: "",
    formattedHours: "0 giờ",
    colorClass: "bg-gray-100 text-gray-700",
  };
  const displayLabel = info.label || "Ca làm";
  const displayHours = info.formattedHours || "0 giờ";

  return (
    <div
      className="relative min-h-[104px] group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >

      {hasShift ? (
        <>
          {hover && (
            <div className="absolute -top-20 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 whitespace-nowrap">
              <div className="font-semibold text-gray-800">
                {displayLabel}
              </div>

              {info.timeRange && (
                <div className="mt-1 text-xs text-gray-500">
                  {info.timeRange}
                </div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                Tổng: {displayHours}
              </div>
            </div>
          )}

          <div 
            onClick={onEdit}
            className={`rounded-md px-3 py-2 text-sm font-medium cursor-pointer hover:brightness-95 transition ${info.colorClass}`}
          >

            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0 break-words">
                {displayLabel}
              </span>

              {hover && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="mt-0.5 shrink-0 hover:scale-110 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {info.timeRange && (
              <div className="mt-1 text-xs opacity-80">
                {info.timeRange}
              </div>
            )}

          </div>

          <div className="mt-2 text-xs font-semibold text-gray-700">
            Tổng: {displayHours}
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-400">
          Tổng: {displayHours}
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition"
      >
        + Thêm lịch
      </button>

    </div>
  );
}
