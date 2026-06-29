import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ToolbarFilterDropdown({
  children,
  label = "Lọc",
  panelClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded border bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-cyan-600 hover:text-cyan-700 sm:w-auto ${
          isOpen ? "border-cyan-600" : "border-slate-700"
        }`}
      >
        {label}
        <ChevronDown
          size={15}
          className={`transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-[calc(100%+4px)] z-[60] max-h-[calc(100vh-10rem)] w-[calc(100vw-2rem)] overflow-y-auto border border-slate-300 bg-white p-4 shadow-xl sm:w-[560px] ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
