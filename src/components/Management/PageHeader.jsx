import React from "react";

export default function PageHeader({ title, eyebrow, description, actions }) {
  return (
    <header className="erp-page-header">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
