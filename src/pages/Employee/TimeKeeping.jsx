import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock3,
  Clock,
  Sparkles,
} from "lucide-react";

// Mock Data
const MOCK_CHECKINS = [
  {
    employeeId: "emp_1",
    name: "Nguyễn Văn Anh",
    role: "Quản lý bếp",
    avatar: "NV",
    color: "bg-blue-600",
    shifts: {
      "2026-06-29": {
        morning: { status: "ontime", checkin: "07:55", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "13:00", checkout: "17:02" },
      },
      "2026-06-30": {
        morning: { status: "ontime", checkin: "07:50", checkout: "12:00" },
        afternoon: { status: "late", checkin: "13:15", checkout: "17:00" },
      },
      "2026-07-01": {
        morning: { status: "ontime", checkin: "07:52", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "12:58", checkout: "17:00" },
      },
      "2026-07-02": {
        morning: { status: "ontime", checkin: "07:56", checkout: "12:00" },
        full: { status: "ontime", checkin: "07:56", checkout: "17:00" },
      },
      "2026-07-03": {
        morning: { status: "ontime", checkin: "07:50", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "12:55", checkout: "17:05" },
      },
    }
  },
  {
    employeeId: "emp_2",
    name: "Trần Thị Bình",
    role: "Phụ bếp chính",
    avatar: "TB",
    color: "bg-emerald-600",
    shifts: {
      "2026-06-29": {
        morning: { status: "late", checkin: "08:12", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "12:55", checkout: "17:00" },
      },
      "2026-06-30": {
        morning: { status: "ontime", checkin: "07:45", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "13:00", checkout: "17:00" },
      },
      "2026-07-01": {
        morning: { status: "absent" },
        afternoon: { status: "absent" },
      },
      "2026-07-02": {
        morning: { status: "ontime", checkin: "07:50", checkout: "12:00" },
        afternoon: { status: "missing", checkin: "13:05", checkout: "--:--" },
      },
      "2026-07-03": {
        morning: { status: "ontime", checkin: "07:55", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "12:58", checkout: "17:00" },
      },
    }
  },
  {
    employeeId: "emp_3",
    name: "Lê Hoàng Cường",
    role: "Nhân viên chia soạn",
    avatar: "HC",
    color: "bg-amber-600",
    shifts: {
      "2026-06-29": {
        morning: { status: "ontime", checkin: "07:58", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "13:00", checkout: "17:00" },
      },
      "2026-06-30": {
        morning: { status: "ontime", checkin: "07:54", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "12:58", checkout: "17:01" },
      },
      "2026-07-01": {
        morning: { status: "ontime", checkin: "07:56", checkout: "12:00" },
        afternoon: { status: "late", checkin: "13:22", checkout: "17:00" },
      },
      "2026-07-02": {
        morning: { status: "ontime", checkin: "07:52", checkout: "12:00" },
        afternoon: { status: "ontime", checkin: "13:00", checkout: "17:00" },
      },
      "2026-07-03": {
        morning: { status: "unmarked" },
        afternoon: { status: "unmarked" },
      },
    }
  },
  {
    employeeId: "emp_4",
    name: "Phạm Minh Dung",
    role: "Nhân viên tiếp phẩm",
    avatar: "MD",
    color: "bg-indigo-600",
    shifts: {
      "2026-06-29": {
        full: { status: "ontime", checkin: "07:45", checkout: "17:00" },
      },
      "2026-06-30": {
        full: { status: "ontime", checkin: "07:48", checkout: "17:02" },
      },
      "2026-07-01": {
        full: { status: "late", checkin: "08:05", checkout: "17:00" },
      },
      "2026-07-02": {
        full: { status: "absent" },
      },
      "2026-07-03": {
        full: { status: "ontime", checkin: "07:50", checkout: "17:00" },
      },
    }
  }
];

const statusStyles = {
  ontime: {
    card: "bg-sky-50/70 border-sky-200 text-sky-700 hover:bg-sky-50",
    dot: "bg-blue-500",
    label: "Đúng giờ"
  },
  late: {
    card: "bg-purple-50/70 border-purple-200 text-purple-700 hover:bg-purple-50",
    dot: "bg-purple-500",
    label: "Trễ / Sớm"
  },
  missing: {
    card: "bg-rose-50/70 border-rose-200 text-rose-700 hover:bg-rose-50",
    dot: "bg-red-500",
    label: "Chấm thiếu"
  },
  unmarked: {
    card: "bg-amber-50/60 border-amber-200 text-amber-700 hover:bg-amber-50",
    dot: "bg-orange-500",
    label: "Chưa chấm"
  },
  absent: {
    card: "bg-slate-50/80 border-slate-200 text-slate-500 hover:bg-slate-50",
    dot: "bg-gray-400",
    label: "Nghỉ làm"
  }
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TimeKeeping() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");

  const getWeekDays = (date) => {
    const current = new Date(date);
    const day = current.getDay() === 0 ? 7 : current.getDay();
    const monday = new Date(current);
    monday.setDate(current.getDate() - day + 1);

    return Array.from(
      { length: 7 },
      (_, index) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + index);
        return d;
      }
    );
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: lastDay },
      (_, i) => new Date(year, month, i + 1)
    );
  };

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);

  const displayDays = useMemo(() => {
    if (viewMode === "day") return [currentDate];
    if (viewMode === "month") return monthDays;
    return weekDays;
  }, [viewMode, currentDate, weekDays, monthDays]);

  const month = weekDays[0].getMonth() + 1;
  const year = weekDays[0].getFullYear();
  const weekNumber = Math.ceil(weekDays[0].getDate() / 7);

  const dayNames = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const shortDayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const shifts = [
    {
      id: "morning",
      name: "Ca sáng",
      time: "08:00 - 12:00",
    },
    {
      id: "afternoon",
      name: "Ca chiều",
      time: "13:00 - 17:00",
    },
    {
      id: "full",
      name: "Cả ngày",
      time: "08:00 - 17:00",
    },
  ];

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    if (viewMode === "day") prev.setDate(prev.getDate() - 1);
    else if (viewMode === "week") prev.setDate(prev.getDate() - 7);
    else if (viewMode === "month") prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    if (viewMode === "day") next.setDate(next.getDate() + 1);
    else if (viewMode === "week") next.setDate(next.getDate() + 7);
    else if (viewMode === "month") next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return MOCK_CHECKINS;
    return MOCK_CHECKINS.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalVisibleCheckins = useMemo(() => {
    let count = 0;
    displayDays.forEach((day) => {
      const dateKey = toDateKey(day);
      shifts.forEach((shift) => {
        filteredEmployees.forEach((emp) => {
          if (emp.shifts?.[dateKey]?.[shift.id]) {
            count++;
          }
        });
      });
    });
    return count;
  }, [displayDays, shifts, filteredEmployees]);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 sm:p-5 md:p-6 text-slate-800">
      {/* Header */}
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 border border-blue-100">
          <Sparkles size={14} />
          Nhân sự & Chấm công
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Bảng chấm công điện tử
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Theo dõi trạng thái check-in, check-out và phân ca làm việc chi tiết của nhân viên trong ngày.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhân viên..."
                className="w-full sm:w-[260px] h-11 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>

            {/* View Mode Select */}
            <div className="relative">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full sm:w-auto h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-xl font-semibold text-slate-700 text-sm outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Date Navigator */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={handlePrevWeek}
                className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-5 font-bold text-slate-700 text-sm whitespace-nowrap min-w-[180px] text-center border-l border-r border-slate-200">
                {viewMode === "day" &&
                  `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}`}
                {viewMode === "week" &&
                  `Tuần ${weekNumber} - Th. ${month}/${year}`}
                {viewMode === "month" &&
                  `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`}
              </div>
              <button
                onClick={handleNextWeek}
                className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Today Button */}
            <button
              onClick={() => setCurrentDate(new Date())}
              className="h-11 px-5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-sm font-bold text-slate-700 transition-all active:scale-95 shadow-sm"
            >
              Hôm nay
            </button>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {/* Header ngày */}
          <div
            className="grid min-w-max"
            style={{
              gridTemplateColumns: `180px repeat(${displayDays.length}, minmax(150px, 1fr))`,
            }}
          >
            <div className="border-r border-b p-4 bg-slate-50/50 flex items-center justify-between font-bold text-slate-700 text-sm">
              <span>Ca làm việc</span>
            </div>

            {displayDays.map((day, index) => {
              const activeToday = isToday(day);
              const isSunday = day.getDay() === 0;
              return (
                <div
                  key={index}
                  className={`border-r border-b p-3 text-center transition-all ${
                    activeToday
                      ? "bg-blue-50/40 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                      : "bg-slate-50/10"
                  }`}
                >
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      activeToday
                        ? "text-blue-600"
                        : isSunday
                        ? "text-rose-500"
                        : "text-slate-500"
                    }`}
                  >
                    {viewMode === "month" ? shortDayNames[day.getDay()] : dayNames[day.getDay()]}
                  </div>
                  <div className="mt-1.5 flex items-center justify-center">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        activeToday
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : isSunday
                          ? "text-rose-600 bg-rose-50"
                          : "text-slate-800"
                      }`}
                    >
                      {String(day.getDate()).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ca làm việc và check-in list */}
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="grid min-w-max"
              style={{
                gridTemplateColumns: `180px repeat(${displayDays.length}, minmax(150px, 1fr))`,
              }}
            >
              <div className="border-r border-b p-4 bg-slate-50/50 flex flex-col justify-center select-none">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                  <Clock3 size={14} className="text-blue-500" />
                  {shift.name}
                </div>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-max">
                  {shift.time}
                </div>
              </div>

              {displayDays.map((day) => {
                const dateKey = toDateKey(day);
                const employeesInShift = filteredEmployees
                  .map((emp) => {
                    const shiftRecord = emp.shifts?.[dateKey]?.[shift.id];
                    if (shiftRecord) {
                      return { ...emp, record: shiftRecord };
                    }
                    return null;
                  })
                  .filter(Boolean);

                return (
                  <div
                    key={`${shift.id}-${day.toISOString()}`}
                    className="border-r border-b p-2.5 min-h-[110px] bg-white hover:bg-slate-50/40 transition-all flex flex-col gap-2"
                  >
                    {employeesInShift.map((emp) => (
                      <div
                        key={emp.employeeId}
                        className={`p-2 rounded-xl border text-[11px] shadow-sm flex flex-col gap-1.5 transition-all hover:scale-[1.02] hover:shadow-md ${
                          statusStyles[emp.record.status].card
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${emp.color}`}
                            >
                              {emp.avatar}
                            </div>
                            <span className="truncate" title={emp.name}>
                              {emp.name}
                            </span>
                          </div>
                        </div>

                        {emp.record.checkin && (
                          <div className="flex items-center gap-1 text-slate-500 font-semibold scale-90 origin-left shrink-0">
                            <Clock size={10} className="text-slate-400" />
                            <span>
                              {emp.record.checkin} - {emp.record.checkout}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 mt-0.5 shrink-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusStyles[emp.record.status].dot
                            }`}
                          />
                          <span className="scale-90 origin-left font-bold">
                            {statusStyles[emp.record.status].label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty State */}
          {totalVisibleCheckins === 0 && (
            <div className="py-14 md:py-20 px-4 flex flex-col items-center justify-center text-center bg-white border-t border-slate-100">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
                <Clock3 className="w-8 h-8 text-slate-400/80" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy dữ liệu chấm công</h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
                Không có lịch làm việc hoặc dữ liệu chấm công nào khớp với điều kiện tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl px-6 py-4 flex flex-wrap justify-center items-center gap-y-3 gap-x-6 md:gap-x-10 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
            Đúng giờ
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100" />
            Đi muộn / Về sớm
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100" />
            Chấm công thiếu
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
            Chưa chấm công
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400 ring-4 ring-gray-100" />
            Nghỉ làm
          </div>
        </div>
      </div>
    </div>
  );
}