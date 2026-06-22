import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

import { workScheduleApi } from "../../api";
import ShiftCell from "../../components/Employee/ShiftCell";
import AddScheduleModal from "../../components/Employee/AddScheduleModal";

const SHIFT_DEFINITIONS = {
  morning: {
    label: "Ca sáng",
    timeRange: "08:00 - 12:00",
    hours: 4,
    colorClass: "bg-blue-100 text-blue-700",
  },
  afternoon: {
    label: "Ca chiều",
    timeRange: "13:00 - 17:00",
    hours: 4,
    colorClass: "bg-green-100 text-green-700",
  },
  full: {
    label: "Cả ngày",
    timeRange: "08:00 - 17:00",
    hours: 8,
    colorClass: "bg-purple-100 text-purple-700",
  },
};

const TIME_RANGE_START_KEYS = [
  "startTime",
  "fromTime",
  "start",
  "from",
  "checkIn",
  "beginTime",
];

const TIME_RANGE_END_KEYS = [
  "endTime",
  "toTime",
  "end",
  "to",
  "checkOut",
  "finishTime",
];

const normalizeShiftCode = (shift) => {
  if (typeof shift === "string") {
    return shift;
  }

  if (!shift || typeof shift !== "object") {
    return "";
  }

  return (
    shift.shift ||
    shift.type ||
    shift.code ||
    shift.shiftType ||
    shift.value ||
    ""
  );
};

const parseTimeToMinutes = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const getTimeValue = (shift, keys) => {
  if (!shift || typeof shift !== "object") {
    return "";
  }

  for (const key of keys) {
    if (shift[key]) {
      return shift[key];
    }
  }

  if (shift.timeRange && typeof shift.timeRange === "object") {
    for (const key of keys) {
      if (shift.timeRange[key]) {
        return shift.timeRange[key];
      }
    }
  }

  return "";
};

const getTimeRangeFromString = (shift) => {
  if (typeof shift !== "string") {
    return null;
  }

  const match = shift.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);

  if (!match) {
    return null;
  }

  return {
    start: match[1],
    end: match[2],
  };
};

const getShiftTimeRange = (shift) => {
  const stringRange = getTimeRangeFromString(shift);

  if (stringRange) {
    return stringRange;
  }

  const start = getTimeValue(shift, TIME_RANGE_START_KEYS);
  const end = getTimeValue(shift, TIME_RANGE_END_KEYS);

  if (!start || !end) {
    return null;
  }

  return {
    start,
    end,
  };
};

const calculateRangeHours = (timeRange) => {
  if (!timeRange) {
    return 0;
  }

  const startMinutes = parseTimeToMinutes(timeRange.start);
  let endMinutes = parseTimeToMinutes(timeRange.end);

  if (startMinutes === null || endMinutes === null) {
    return 0;
  }

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return Math.max((endMinutes - startMinutes) / 60, 0);
};

const getExplicitHours = (shift) => {
  if (!shift || typeof shift !== "object") {
    return null;
  }

  const explicitHours =
    shift.totalHours ??
    shift.workHours ??
    shift.hours ??
    shift.durationHours ??
    shift.durationInHours;

  const parsedHours = Number(explicitHours);

  if (Number.isFinite(parsedHours)) {
    return parsedHours;
  }

  const explicitMinutes =
    shift.totalMinutes ??
    shift.workMinutes ??
    shift.durationMinutes ??
    shift.durationInMinutes;
  const parsedMinutes = Number(explicitMinutes);

  return Number.isFinite(parsedMinutes) ? parsedMinutes / 60 : null;
};

const getShiftHours = (shift) => {
  if (Array.isArray(shift)) {
    return shift.reduce((total, item) => total + getShiftHours(item), 0);
  }

  if (!shift) {
    return 0;
  }

  const code = normalizeShiftCode(shift);

  if (SHIFT_DEFINITIONS[code]) {
    return SHIFT_DEFINITIONS[code].hours;
  }

  const explicitHours = getExplicitHours(shift);

  if (explicitHours !== null) {
    return explicitHours;
  }

  return calculateRangeHours(getShiftTimeRange(shift));
};

const formatHours = (hours) => {
  const totalMinutes = Math.max(Math.round((Number(hours) || 0) * 60), 0);
  const fullHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${fullHours} giờ`;
  }

  if (fullHours === 0) {
    return `${minutes} phút`;
  }

  return `${fullHours} giờ ${minutes} phút`;
};

const getShiftInfo = (shift) => {
  if (Array.isArray(shift)) {
    const items = shift.map(getShiftInfo);

    return {
      label: items.map((item) => item.label).filter(Boolean).join(", "),
      timeRange: items
        .map((item) => item.timeRange)
        .filter(Boolean)
        .join(", "),
      hours: getShiftHours(shift),
      colorClass: "bg-indigo-100 text-indigo-700",
    };
  }

  const code = normalizeShiftCode(shift);
  const fixedShift = SHIFT_DEFINITIONS[code];
  const timeRange = getShiftTimeRange(shift);
  const hours = getShiftHours(shift);

  if (fixedShift) {
    return {
      ...fixedShift,
      hours,
    };
  }

  if (timeRange) {
    return {
      label: "Khung giờ",
      timeRange: `${timeRange.start} - ${timeRange.end}`,
      hours,
      colorClass: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "",
    timeRange: "",
    hours,
    colorClass: "bg-gray-100 text-gray-700",
  };
};

const getEmployeeWeekHours = (employee, weekDays) => {
  return weekDays.reduce((total, date) => {
    const shift = employee.shifts?.[date.getDate()];

    return total + getShiftHours(shift);
  }, 0);
};

const formatDateISO = (date) => {
  return date.toISOString().split("T")[0];
};

const getWeekDays = (date) => {
  const current = new Date(date);

  const day =
    current.getDay() === 0
      ? 7
      : current.getDay();

  const monday = new Date(current);

  monday.setDate(
    current.getDate() - day + 1
  );

  return Array.from(
    { length: 7 },
    (_, index) => {
      const d = new Date(monday);

      d.setDate(
        monday.getDate() + index
      );

      return d;
    }
  );
};

export default function TimeSheet() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [openSchedule, setOpenSchedule] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const [selectedShift, setSelectedShift] = useState("");

  // API data state
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeSheet = useCallback(async () => {
    const weekDays = getWeekDays(currentDate);
    const from = formatDateISO(weekDays[0]);
    const to = formatDateISO(weekDays[6]);
    
    setLoading(true);
    try {
      const data = await workScheduleApi.getTimeSheet(from, to);
      if (!Array.isArray(data)) {
        throw new Error("Invalid timesheet data");
      }
      // Map BE fields to FE format
      const mappedData = data.map(emp => ({
        id: emp.id,
        code: emp.code,
        name: emp.name,
        debt: emp.debt || 0,
        shifts: emp.shifts || {},
      }));
      setTimeSheetData(mappedData);
    } catch {
      toast.error("Không thể tải bảng chấm công");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  const handleDeleteSchedule = async () => {
    if (!deleteInfo) return;

    try {
      const scheduleData = await workScheduleApi.getMonthly(
        deleteInfo.year,
        deleteInfo.month,
        deleteInfo.employeeId
      );
      const schedule = (Array.isArray(scheduleData) ? scheduleData : []).find(
        (item) => item.workDate?.slice(0, 10) === deleteInfo.workDate
      );

      if (!schedule?.id) {
        throw new Error("Schedule not found");
      }

      await workScheduleApi.delete(schedule.id);
      toast.success("Xoa lich lam viec thanh cong");
      setOpenDelete(false);
      setDeleteInfo(null);
      fetchTimeSheet();
    } catch {
      toast.error("Khong the xoa lich lam viec");
    }
  };

  // Fetch timesheet when week changes

  useEffect(() => {
    fetchTimeSheet();
  }, [fetchTimeSheet]);

  const weekDays =
    getWeekDays(currentDate);

  const month =
    weekDays[0].getMonth() + 1;

  const year =
    weekDays[0].getFullYear();

  const weekNumber =
    Math.ceil(
      weekDays[0].getDate() / 7
    );

  const dayNames = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const dailyTotalHours = weekDays.map((date) =>
    timeSheetData.reduce((total, employee) => {
      const shift = employee.shifts?.[date.getDate()];

      return total + getShiftHours(shift);
    }, 0)
  );

  const weeklyTotalHours = dailyTotalHours.reduce(
    (total, hours) => total + hours,
    0
  );

  return (
    <div className="p-5 bg-[#f5f6f8] min-h-screen">

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">
            Lịch làm việc
          </h2>
        </div>

        <div className="p-4 flex flex-wrap items-center justify-between gap-3">

          <div className="flex flex-wrap items-center gap-3">

            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                placeholder="Tìm kiếm nhân viên"
                className="w-[280px] h-[42px] pl-10 pr-4 rounded-xl border border-gray-300"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">

              <button
                onClick={() => {
                  const prev =
                    new Date(currentDate);

                  prev.setDate(
                    prev.getDate() - 7
                  );

                  setCurrentDate(prev);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="px-4 font-medium whitespace-nowrap">
                Tuần {weekNumber} - Th. {month} {year}
              </div>

              <button
                onClick={() => {
                  const next =
                    new Date(currentDate);

                  next.setDate(
                    next.getDate() + 7
                  );

                  setCurrentDate(next);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>

            </div>

            <button
              onClick={() =>
                setCurrentDate(
                  new Date()
                )
              }
              className="h-[42px] px-4 border border-gray-300 rounded-xl bg-white"
            >
              Tuần này
            </button>

          </div>

          <div className="flex gap-2">

            <button className="h-[42px] px-4 border border-gray-300 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <Upload size={16} />
              Import
            </button>

            <button className="h-[42px] px-4 border border-gray-300 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <Download size={16} />
              Xuất file
            </button>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[1400px] w-full border-collapse border border-gray-00">

            <thead>

              <tr className="bg-gray-50">

                <th className="w-[250px] text-left px-4 py-4 border border-gray-300">
                  Nhân viên
                </th>

                {weekDays.map((date) => (

                  <th
                    key={date.toISOString()}
                    className="min-w-[160px] px-4 py-4 border border-gray-300"
                  >

                    <div className="flex flex-col items-center">

                      <span className="text-gray-600 text-sm">
                        {dayNames[date.getDay()]}
                      </span>

                      <span className="font-semibold mt-1">
                        {date.getDate()}
                      </span>

                    </div>

                  </th>

                ))}

                <th className="w-[180px] border px-4 py-4 border-gray-300 ">
                  Tổng giờ làm
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-14 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : timeSheetData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-14 text-gray-400">
                    Không có dữ liệu chấm công
                  </td>
                </tr>
              ) : (
                <>
                {timeSheetData.map((employee) => (

                <tr
                  key={employee.id}
                  className="hover:bg-gray-50"
                >

                  <td className="border border-gray-300 px-4 py-4">

                    <div className="font-semibold">
                      {employee.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {employee.code}
                    </div>

                  </td>

                  {weekDays.map((date) => {
                    const shift = employee.shifts?.[date.getDate()];
                    const shiftInfo = getShiftInfo(shift);

                    return (

                    <td
                      key={date.toISOString()}
                      className="border border-gray-300 px-2 py-3 align-top"
                    >

                      <ShiftCell
                        shift={shift}
                        shiftInfo={{
                          ...shiftInfo,
                          formattedHours: formatHours(shiftInfo.hours),
                        }}

                        onAdd={() => {
                        setSelectedEmployee(employee);

                        setSelectedDate(
                              `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                        );

                        setOpenSchedule(true);
                        }}

                        onDelete={() => {

                        setSelectedShift(
                              getShiftInfo(shift).label || "ca làm"
                        );

                        setDeleteInfo({
                              employeeId: employee.id,
                              day: date.getDate(),
                              month: date.getMonth() + 1,
                              year: date.getFullYear(),
                              workDate: formatDateISO(date),
                        });

                        setOpenDelete(true);
                        }}
                        />

                    </td>

                    );
                  })}

                  <td className="border border-gray-300 px-4 py-4 text-right">

                    <div className="font-semibold">
                      {formatHours(getEmployeeWeekHours(employee, weekDays))}
                    </div>

                  </td>

                </tr>

              ))}

                <tr className="bg-blue-50 font-semibold text-blue-900">

                  <td className="border border-gray-300 px-4 py-4">
                    Tổng theo ngày
                  </td>

                  {dailyTotalHours.map((hours, index) => (

                    <td
                      key={weekDays[index].toISOString()}
                      className="border border-gray-300 px-4 py-4 text-center"
                    >
                      {formatHours(hours)}
                    </td>

                  ))}

                  <td className="border border-gray-300 px-4 py-4 text-right">
                    {formatHours(weeklyTotalHours)}
                  </td>

                </tr>
                </>
              )}

            </tbody>

          </table>

        </div>

      </div>


      <AddScheduleModal
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        employee={selectedEmployee}
        date={selectedDate}
        onSuccess={() => {
          fetchTimeSheet();
          setOpenSchedule(false);
        }}
      />


            {/* Xác nhận xóa ca làm việc */}
            {openDelete && (

  <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">

    <div className="w-full max-w-[650px] bg-white rounded-2xl overflow-hidden shadow-xl">

      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

        <h2 className="text-[20px] font-semibold">
          Xóa lịch làm việc
        </h2>

        <button
          onClick={() =>
            setOpenDelete(false)
          }
        >
          ✕
        </button>

      </div>

      <div className="px-6 py-10 text-lg">

        Bạn có chắc chắn xóa lịch ca

        <span className="font-semibold">
          {" "}
          {selectedShift}
          {" "}
        </span>

        này?

      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

        <button
          onClick={handleDeleteSchedule}
          className="h-[40px] px-6 bg-blue-600 text-white rounded-xl"
        >
          Đồng ý
        </button>

        <button
          onClick={() =>
            setOpenDelete(false)
          }
          className="h-[40px] px-6 border border-gray-300 rounded-xl"
        >
          Bỏ qua
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}
