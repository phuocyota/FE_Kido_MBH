import React from "react";
import CustomSelect from "./CustomSelect";

export default function BoardingOrderFilter({
  level,
  setLevel,
  year,
  setYear,
  month,
  setMonth,
  weeks = [],
  weekIndex,
  setWeekIndex,
}) {
  const levelOptions = [
    { value: "preschool", label: "Mầm non" },
    { value: "primary", label: "Tiểu học" },
  ];

  const yearOptions = [
    { value: 2026, label: "Năm 2026" },
    { value: 2027, label: "Năm 2027" },
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  const weekOptions = weeks.map((w, idx) => ({
    value: idx,
    label: w.label,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-slate-200 bg-white/95 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Khối lớp
        </label>
        <CustomSelect
          value={level}
          onChange={setLevel}
          options={levelOptions}
          className="border-emerald-100 bg-emerald-50/20"
          activeColorClass="bg-emerald-50 text-emerald-700"
          focusColorClass="focus:border-emerald-500 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Chọn Năm
        </label>
        <CustomSelect
          value={year}
          onChange={(val) => {
            setYear(val);
            setWeekIndex(0);
          }}
          options={yearOptions}
          className="border-amber-100 bg-amber-50/20"
          activeColorClass="bg-amber-50 text-amber-700"
          focusColorClass="focus:border-amber-500 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Chọn Tháng
        </label>
        <CustomSelect
          value={month}
          onChange={(val) => {
            setMonth(val);
            setWeekIndex(0);
          }}
          options={monthOptions}
          className="border-teal-100 bg-teal-50/20"
          activeColorClass="bg-teal-50 text-teal-700"
          focusColorClass="focus:border-teal-500 focus:ring-teal-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Tuần áp dụng
        </label>
        <CustomSelect
          value={weekIndex}
          onChange={setWeekIndex}
          options={weekOptions}
          className="border-sky-100 bg-sky-50/20"
          activeColorClass="bg-sky-50 text-sky-700"
          focusColorClass="focus:border-sky-500 focus:ring-sky-100"
        />
      </div>
    </div>
  );
}
