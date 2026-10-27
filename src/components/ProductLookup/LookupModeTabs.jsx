import React from "react";
import { Camera, Search } from "lucide-react";

const modes = [
  { id: "id", label: "Nhập ID", icon: Search },
  { id: "camera", label: "Quét QR bằng camera", icon: Camera },
];

export default function LookupModeTabs({ mode, onChange }) {
  const keyboard = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "id" : event.key === "End" ? "camera" : mode === "id" ? "camera" : "id";
    onChange(next);
    document.getElementById(`lookup-${next}-tab`)?.focus();
  };
  return <div role="tablist" aria-label="Cách truy xuất sản phẩm" onKeyDown={keyboard} className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
    {modes.map((tab) => {
      const { id, label, icon: Icon } = tab;
      return <button key={id} id={`lookup-${id}-tab`} type="button" role="tab" aria-selected={mode === id} aria-controls={`lookup-${id}-panel`} tabIndex={mode === id ? 0 : -1} onClick={() => onChange(id)} className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold ${mode === id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
      <Icon size={17} className="shrink-0" />{label}
    </button>;
    })}
  </div>;
}
