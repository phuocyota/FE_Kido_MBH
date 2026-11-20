import React from "react";
import { ArrowLeft } from "lucide-react";

/* Header for create/edit form screens: back button + eyebrow + title, optional controls and note.
   `bare` renders it as the top section of an existing .erp-panel instead of a standalone card. */
export default function FormPageHeader({ title, eyebrow, onBack, backDisabled = false, children, note, bare = false }) {
  return (
    <header
      className={
        bare
          ? "border-b border-slate-100 px-4 py-4 md:px-5"
          : "erp-page-header !block"
      }
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              aria-label="Quay lại"
              title="Quay lại"
              disabled={backDisabled}
              onClick={onBack}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{eyebrow}</p>
            )}
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 md:text-xl">{title}</h1>
          </div>
        </div>
        {children && <div className="flex min-w-0 flex-1 lg:justify-end">{children}</div>}
      </div>
      {note && <p className="mt-3 text-[13px] leading-6 text-slate-500">{note}</p>}
    </header>
  );
}
