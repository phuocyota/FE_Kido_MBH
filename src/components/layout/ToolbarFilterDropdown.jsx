import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal } from "lucide-react";

export default function ToolbarFilterDropdown({
  children,
  label = "Lọc thêm",
  panelClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({});
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const requestedWidth =
    Number(panelClassName.match(/sm:w-\[(\d+)px\]/)?.[1]) || 560;
  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(requestedWidth, window.innerWidth - 24);
    const below = window.innerHeight - rect.bottom - 20;
    const above = below < 240 && rect.top > below;
    setPosition({
      width,
      left: Math.max(
        12,
        Math.min(rect.right - width, window.innerWidth - width - 12),
      ),
      ...(above
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
      maxHeight: Math.max(120, above ? rect.top - 20 : below),
    });
  };
  useEffect(() => {
    if (!isOpen) return;
    const outside = (event) => {
      if (
        !buttonRef.current?.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      )
        setIsOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const viewportChanged = () => setIsOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", viewportChanged);
    window.addEventListener("scroll", viewportChanged);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", viewportChanged);
      window.removeEventListener("scroll", viewportChanged);
    };
  }, [isOpen]);
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          updatePosition();
          setIsOpen((value) => !value);
        }}
        aria-expanded={isOpen}
        className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition sm:w-auto ${
          isOpen
            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal size={14} />
        {label}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            aria-label={label}
            style={position}
            className={`fixed z-[80] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl ${panelClassName}`}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}
