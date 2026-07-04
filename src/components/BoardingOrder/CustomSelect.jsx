import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Chọn...",
  className = "",
  activeColorClass = "bg-emerald-50 text-emerald-700",
  focusColorClass = "focus:border-emerald-500 focus:ring-emerald-100",
  icon: Icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 ${focusColorClass} ${className}`}
      >
        <span className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="shrink-0 text-slate-400" />}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-full min-w-[200px] overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-xs font-medium text-slate-400">Không có dữ liệu</p>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                      isSelected
                        ? activeColorClass
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={15} className="shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
