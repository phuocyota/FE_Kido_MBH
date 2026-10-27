import React from "react";

export default function LookupSection({ title, icon, children }) {
  const Icon = icon;
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
    <h3 className="mb-5 flex items-center gap-2.5 text-base font-bold text-slate-900">{Icon && <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Icon size={17} /></span>}{title}</h3>
    {children}
  </section>;
}
