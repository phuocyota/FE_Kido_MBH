import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { workScheduleApi } from "../../api";

export default function AddScheduleModal({
  open,
  onClose,
  employee,
  date,
  existingShift,
  onSuccess,
}) {
  const [morning, setMorning] = useState(false);

  const [afternoon, setAfternoon] = useState(false);

  const [fullDay, setFullDay] = useState(false);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

const [repeatWeeks, setRepeatWeeks] = useState(4);
const [selectedDays, setSelectedDays] = useState([]);

// ca làm theo khung giờ 
const [customShift, setCustomShift] = useState(false);

const [startTime, setStartTime] = useState("08:00");
const [endTime, setEndTime] = useState("17:00");
const [saving, setSaving] = useState(false);
const [note, setNote] = useState("");

const parseDate = (value) => {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

useEffect(() => {
  if (open) {
    if (existingShift) {
      const currentShift = existingShift.shift;
      setMorning(currentShift === "morning");
      setAfternoon(currentShift === "afternoon");
      setFullDay(currentShift === "full");
      setCustomShift(currentShift === "custom");
      
      const formatTime = (t) => {
        if (!t) return "";
        const parts = t.split(":");
        return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
      };

      setStartTime(formatTime(existingShift.startTime) || "08:00");
      setEndTime(formatTime(existingShift.endTime) || "17:00");
      setNote(existingShift.note || "");
      setRepeatWeekly(false);
      setRepeatWeeks(4);
      
      if (date) {
        const parsedWorkDate = parseDate(date);
        const startDate = new Date(parsedWorkDate);
        setSelectedDays([startDate.getUTCDay()]);
      } else {
        setSelectedDays([]);
      }
    } else {
      setMorning(false);
      setAfternoon(false);
      setFullDay(false);
      setCustomShift(false);
      setStartTime("08:00");
      setEndTime("17:00");
      setNote("");
      setRepeatWeekly(false);
      setRepeatWeeks(4);
      
      if (date) {
        const parsedWorkDate = parseDate(date);
        const startDate = new Date(parsedWorkDate);
        setSelectedDays([startDate.getUTCDay()]);
      } else {
        setSelectedDays([]);
      }
    }
  }
}, [open, existingShift, date]);

const getSelectedShift = () => {
  if (fullDay) return "full";
  if (morning && afternoon) return "full";
  if (morning) return "morning";
  if (afternoon) return "afternoon";
  return "";
};

const handleSave = async () => {
  const shift = customShift ? "custom" : getSelectedShift();

  if (!employee?.id || !date || !shift) {
    toast.error("Vui lòng chọn ca làm việc");
    return;
  }

  setSaving(true);
  try {
    const parsedWorkDate = parseDate(date);

    if (repeatWeekly) {
      if (selectedDays.length === 0) {
        toast.error("Vui lòng chọn ít nhất một ngày trong tuần");
        return;
      }

      const startDate = new Date(parsedWorkDate);
      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 7 * (repeatWeeks - 1));

      const formatDate = (d) => {
        return d.toISOString().split("T")[0];
      };

      const weeklyShiftItem = {
        shift,
        note: note,
      };

      if (selectedDays.length > 1) {
        weeklyShiftItem.dayOfWeeks = selectedDays;
      } else {
        weeklyShiftItem.dayOfWeek = selectedDays[0];
      }

      if (customShift) {
        weeklyShiftItem.startTime = startTime;
        weeklyShiftItem.endTime = endTime;
      }

      const repeatPayload = {
        employeeId: employee.id,
        fromDate: parsedWorkDate,
        toDate: formatDate(endDate),
        replaceExisting: true,
        weeklyShifts: [weeklyShiftItem],
      };

      await workScheduleApi.createWeeklyRepeat(repeatPayload);
      toast.success("Thêm lịch lặp lại hàng tuần thành công");
    } else {
      const payload = {
        employeeId: employee.id,
        workDate: parsedWorkDate,
        shift,
        note: note,
      };

      if (customShift) {
        payload.startTime = startTime;
        payload.endTime = endTime;
      }

      if (existingShift) {
        let scheduleId = existingShift.id;
        if (!scheduleId) {
          const [year, month, day] = parsedWorkDate.split("-");
          const scheduleData = await workScheduleApi.getMonthly(
            Number(year),
            Number(month),
            employee.id
          );
          const schedule = (Array.isArray(scheduleData) ? scheduleData : []).find(
            (item) => item.workDate?.slice(0, 10) === parsedWorkDate
          );
          scheduleId = schedule?.id;
        }

        if (!scheduleId) {
          throw new Error("Không tìm thấy ID lịch làm việc cần cập nhật");
        }

        await workScheduleApi.update(scheduleId, payload);
        toast.success("Cập nhật lịch làm việc thành công");
      } else {
        await workScheduleApi.create(payload);
        toast.success("Thêm lịch làm việc thành công");
      }
    }
    onSuccess?.();
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Không thể lưu lịch làm việc");
  } finally {
    setSaving(false);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">

      <div className="w-full max-w-[680px] bg-white rounded-2xl overflow-hidden shadow-xl">

        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

          <div>

            <h2 className="text-[30px] font-semibold">
              {existingShift ? "Cập nhật lịch làm việc" : "Thêm lịch làm việc"}
            </h2>

            <div className="mt-2 text-gray-500 text-sm flex gap-3">

              <span>
                {employee?.name}
              </span>

              <span>
                {date}
              </span>

            </div>

          </div>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            <X size={22} />
          </button>

        </div>

        <div className="p-6">

          <h3 className="font-semibold text-lg mb-4">
            Chọn ca làm việc
          </h3>

          {/* Ca làm việc */}

          <div className="bg-gray-50 rounded-2xl p-5">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* CA SÁNG */}
    <label className="flex items-start gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={morning}
        onChange={() => {

          const value = !morning;

          setMorning(value);

          if (value) {
            setFullDay(false);
            setCustomShift(false);
          }
        }}
        className="mt-1"
      />

      <div>

        <div className="font-medium text-[16px] text-gray-800">
          Ca sáng
        </div>

        <div className="text-sm text-gray-500">
          08:00 - 12:00
        </div>

      </div>

    </label>

    {/* CA CHIỀU */}
    <label className="flex items-start gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={afternoon}
        onChange={() => {

          const value = !afternoon;

          setAfternoon(value);

          if (value) {
            setFullDay(false);
            setCustomShift(false);
          }
        }}
        className="mt-1"
      />

      <div>

        <div className="font-medium text-[16px] text-gray-800">
          Ca chiều
        </div>

        <div className="text-sm text-gray-500">
          13:00 - 17:00
        </div>

      </div>

    </label>

    {/* CẢ NGÀY */}
    <label className="flex items-start gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={fullDay}
        onChange={() => {

          const value = !fullDay;

          setFullDay(value);

          if (value) {
            setMorning(false);
            setAfternoon(false);
            setCustomShift(false);
          }
        }}
        className="mt-1"
      />

      <div>

        <div className="font-medium text-[16px] text-gray-800">
          Cả ngày
        </div>

        <div className="text-sm text-gray-500">
          08:00 - 17:00
        </div>

      </div>

    </label>

  </div>

</div>

{/* CA THEO KHUNG GIỜ */}
<div className="mt-5 bg-gray-50 rounded-2xl p-5">

  <label className="flex items-center gap-3 cursor-pointer">

    <input
      type="checkbox"
      checked={customShift}
      onChange={() => {
        const value = !customShift;

        setCustomShift(value);

        if (value) {
          setMorning(false);
          setAfternoon(false);
          setFullDay(false);
        }
      }}
    />

    <span className="font-medium text-[16px]">
      Ca làm theo khung giờ
    </span>

  </label>

  {customShift && (

    <div className="mt-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* GIỜ BẮT ĐẦU */}
        <div>

          <label className="block text-sm text-gray-600 mb-2">
            Từ giờ
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        {/* GIỜ KẾT THÚC */}
        <div>

          <label className="block text-sm text-gray-600 mb-2">
            Đến giờ
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) =>
              setEndTime(e.target.value)
            }
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      <div className="mt-4 text-sm text-blue-600 bg-blue-50 rounded-xl p-3">

        Thời gian làm việc:
        <span className="font-semibold ml-2">
          {startTime} - {endTime}
        </span>

      </div>

    </div>

  )}

</div>

{/* GHI CHÚ */}
<div className="mt-5 bg-gray-50 rounded-2xl p-5">
  <label className="block font-medium text-[16px] text-gray-800 mb-3">
    Ghi chú
  </label>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Nhập ghi chú cho ca làm việc (ví dụ: Làm nửa buổi, trực nhật...)"
    className="
      w-full
      border
      border-gray-300
      rounded-xl
      px-4
      py-3
      outline-none
      focus:ring-2
      focus:ring-blue-500
      bg-white
      resize-none
    "
    rows={2}
  />
</div>




<div className="mt-6">

  <h3 className="font-semibold text-lg mb-4">
    Lặp lại
  </h3>

  <div className="bg-gray-50 rounded-2xl p-5">

    <label className="flex items-center gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={repeatWeekly}
        onChange={() =>
          setRepeatWeekly(!repeatWeekly)
        }
      />

      <span className="font-medium">
        Lặp lại hàng tuần
      </span>

    </label>

    {repeatWeekly && (

      <div className="mt-4 pl-7 flex flex-col gap-4">

        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Số tuần lặp lại
          </label>

          <select
            value={repeatWeeks}
            onChange={(e) =>
              setRepeatWeeks(Number(e.target.value))
            }
            className="
              w-[180px]
              border
              border-gray-300
              rounded-xl
              px-3
              py-2
              outline-none
              bg-white
            "
          >
            <option value={1}>1 tuần</option>
            <option value={2}>2 tuần</option>
            <option value={3}>3 tuần</option>
            <option value={4}>4 tuần</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Áp dụng cho các ngày trong tuần
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "T2", value: 1 },
              { label: "T3", value: 2 },
              { label: "T4", value: 3 },
              { label: "T5", value: 4 },
              { label: "T6", value: 5 },
              { label: "T7", value: 6 },
              { label: "CN", value: 0 },
            ].map((day) => {
              const isChecked = selectedDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => {
                    if (isChecked) {
                      if (selectedDays.length > 1) {
                        setSelectedDays(selectedDays.filter((d) => d !== day.value));
                      }
                    } else {
                      setSelectedDays([...selectedDays, day.value]);
                    }
                  }}
                  className={`w-10 h-10 rounded-full font-semibold text-sm transition flex items-center justify-center cursor-pointer border ${
                    isChecked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Hệ thống sẽ tự tạo lịch làm việc vào các thứ đã chọn và cùng ca trong các tuần tiếp theo.
        </p>

      </div>

    )}

  </div>

</div>



        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="h-[42px] px-5 rounded-xl border border-gray-300"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="h-[42px] px-6 rounded-xl bg-blue-600 text-white disabled:opacity-50"
          >
            {existingShift ? "Cập nhật" : "Lưu"}
          </button>

        </div>

      </div>

    </div>
  );
}
