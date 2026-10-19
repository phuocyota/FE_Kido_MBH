import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function StockFilterSelect({
  label,
  value,
  options,
  onChange,
  sidebar = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-0">
      <label
        className={
          sidebar
            ? "mb-2 block font-medium text-slate-900"
            : "mb-1 block text-xs font-bold text-slate-900"
        }
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between border bg-white text-left text-sm text-slate-900 outline-none ${
          sidebar ? "h-10 rounded-lg px-3" : "h-7 px-2"
        } ${
          isOpen ? "border-indigo-600" : "border-slate-300"
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-700 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-full z-[70] mt-1 max-h-44 w-full overflow-y-auto border border-slate-300 bg-white shadow-lg ${
            sidebar ? "rounded-lg" : ""
          }`}
        >
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                type="button"
                key={option}
                onClick={() => {
                  // Chọn giá trị rồi đóng danh sách để thao tác giống combobox kế toán.
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-indigo-600 font-semibold text-white"
                    : "bg-white text-slate-800 hover:bg-indigo-50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
