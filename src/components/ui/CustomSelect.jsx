import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ value, onChange, options, themeColor = "emerald" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const colorThemes = {
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/70",
      focusBorder: "focus:border-emerald-500",
      focusRing: "focus:ring-emerald-100",
      activeBg: "bg-emerald-50 text-emerald-800",
      hoverBg: "hover:bg-emerald-50",
    },
    sky: {
      border: "border-sky-200",
      bg: "bg-sky-50/80",
      focusBorder: "focus:border-sky-500",
      focusRing: "focus:ring-sky-100",
      activeBg: "bg-sky-50 text-sky-800",
      hoverBg: "hover:bg-sky-50",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50/70",
      focusBorder: "focus:border-amber-500",
      focusRing: "focus:ring-amber-100",
      activeBg: "bg-amber-50 text-amber-800",
      hoverBg: "hover:bg-amber-50",
    },
    teal: {
      border: "border-teal-200",
      bg: "bg-teal-50/70",
      focusBorder: "focus:border-teal-500",
      focusRing: "focus:ring-teal-100",
      activeBg: "bg-teal-50 text-teal-800",
      hoverBg: "hover:bg-teal-50",
    }
  };

  const currentTheme = colorThemes[themeColor] || colorThemes.emerald;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border ${currentTheme.border} ${currentTheme.bg} px-3 font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={18} className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <ul className="max-h-80 overflow-auto py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors font-medium ${
                  value === option.value 
                    ? currentTheme.activeBg 
                    : `text-slate-700 ${currentTheme.hoverBg}`
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
