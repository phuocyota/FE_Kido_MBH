import React from "react";
import { CalendarRange, GraduationCap } from "lucide-react";

export default function BoardingOrderFilter({
  level,
  setLevel,
  week,
  setWeek,
}) {
  return (
    <div className="grid gap-4 border-b border-slate-200 bg-white/95 p-4 sm:grid-cols-2 sm:p-5 lg:flex lg:flex-wrap lg:items-end">
      <div className="min-w-0">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <GraduationCap size={17} className="text-emerald-600" />
          Khối
        </label>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="h-11 w-full rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 lg:w-56"
        >
          <option value="preschool">Mầm non</option>
          <option value="primary">Tiểu học</option>
        </select>
      </div>

      <div className="min-w-0">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CalendarRange size={17} className="text-sky-600" />
          Thời gian
        </label>

        <select
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="h-11 w-full rounded-lg border border-sky-200 bg-sky-50/70 px-3 font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 lg:w-56"
        >
          <option value="this">Tuần này</option>
          <option value="next">Tuần tới</option>
        </select>
      </div>
    </div>
  );
}
