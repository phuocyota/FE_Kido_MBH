import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddScheduleModal({
  open,
  onClose,
  employee,
  date,
}) {
  const [morning, setMorning] = useState(false);

  const [afternoon, setAfternoon] = useState(false);

  const [fullDay, setFullDay] = useState(false);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

const [repeatWeeks, setRepeatWeeks] = useState(4);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">

      <div className="w-full max-w-[680px] bg-white rounded-2xl overflow-hidden shadow-xl">

        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

          <div>

            <h2 className="text-[30px] font-semibold">
              Thêm lịch làm việc
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

{/* LẶP LẠI HÀNG TUẦN */}
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

      <div className="mt-4 pl-7">

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
          "
        >
          <option value={1}>1 tuần</option>
          <option value={2}>2 tuần</option>
          <option value={3}>3 tuần</option>
          <option value={4}>4 tuần</option>
          <option value={8}>8 tuần</option>
          <option value={12}>12 tuần</option>
        </select>

        <p className="text-xs text-gray-500 mt-2">
          Hệ thống sẽ tự tạo lịch làm việc vào cùng
          thứ và cùng ca trong các tuần tiếp theo.
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

          <button className="h-[42px] px-6 rounded-xl bg-blue-600 text-white"        >
            Lưu
          </button>

        </div>

      </div>

    </div>
  );
}