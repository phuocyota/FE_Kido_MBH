import React, { useState, useEffect } from "react";
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

export default function TimeSheet() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [openSchedule, setOpenSchedule] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedShift, setSelectedShift] = useState("");

  const [deleteInfo, setDeleteInfo] = useState(null);
  
  // API data state
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch timesheet when week changes
  useEffect(() => {
    fetchTimeSheet();
  }, [currentDate]);

  const fetchTimeSheet = async () => {
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
    } catch (error) {
      toast.error("Không thể tải bảng chấm công");
    } finally {
      setLoading(false);
    }
  };

  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
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

  const renderShift = (shift) => {
    switch (shift) {
      case "morning":
        return (
          <div className="bg-blue-100 text-blue-700 rounded-md px-2 py-1 text-sm font-medium">
            Ca sáng
          </div>
        );

      case "afternoon":
        return (
          <div className="bg-green-100 text-green-700 rounded-md px-2 py-1 text-sm font-medium">
            Ca chiều
          </div>
        );

      case "full":
        return (
          <div className="bg-purple-100 text-purple-700 rounded-md px-2 py-1 text-sm font-medium">
            Cả ngày
          </div>
        );

      default:
        return null;
    }
  };

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
                  Lương dự kiến
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
                timeSheetData.map((employee) => (

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

                  {weekDays.map((date) => (

                    <td
                      key={date.toISOString()}
                      className="border border-gray-300 px-2 py-3 align-top"
                    >

                      <ShiftCell
                        shift={employee.shifts?.[date.getDate()]}

                        onAdd={() => {
                        setSelectedEmployee(employee);

                        setSelectedDate(
                              `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                        );

                        setOpenSchedule(true);
                        }}

                        onDelete={() => {

                        const shift =
                              employee.shifts?.[
                              date.getDate()
                              ];

                        setSelectedShift(
                              shift === "morning"
                              ? "Ca sáng"
                              : shift === "afternoon"
                              ? "Ca chiều"
                              : "Cả ngày"
                        );

                        setDeleteInfo({
                              employeeId: employee.id,
                              day: date.getDate(),
                        });

                        setOpenDelete(true);
                        }}
                        />

                    </td>

                  ))}

                  <td className="border border-gray-300 px-4 py-4 text-right">

                    <div className="font-semibold">
                      {(employee.salary || 0).toLocaleString()}
                    </div>

                  </td>

                </tr>

              ))
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
          onClick={() => {
            setOpenDelete(false);
          }}
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



