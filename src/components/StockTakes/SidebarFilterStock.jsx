import React, { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

const quickTimeGroups = [
  {
    title: "Theo ngày & tuần",
    options: ["Hôm nay", "Hôm qua", "Tuần này", "Tuần trước", "7 ngày qua"],
  },
  {
    title: "Theo tháng & quý",
    options: ["Tháng này", "Tháng trước", "30 ngày qua", "Quý này", "Quý trước"],
  },
  {
    title: "Theo năm",
    options: ["Năm nay", "Năm trước", "Toàn thời gian"],
  },
];

export default function SidebarFilterStock() {
  const [openStatus, setOpenStatus] = useState(true);
  const [timeMode, setTimeMode] = useState("quick");
  const [openTimeOptions, setOpenTimeOptions] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Tháng này");
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelectQuickTime = (value) => {
    setSelectedTime(value);
    setTimeMode("quick");
    setOpenTimeOptions(false);
    setOpenDatePicker(false);
  };

  const handleOpenQuickTime = () => {
    setTimeMode("quick");
    setOpenTimeOptions((current) => !current);
    setOpenDatePicker(false);
  };

  const handleOpenDatePicker = () => {
    setTimeMode("range");
    setOpenDatePicker(true);
    setOpenTimeOptions(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
        <p className="mb-3 font-semibold">Tìm kiếm</p>

        <input
          type="text"
          placeholder="Theo mã phiếu kiểm"
          className="mb-2 w-full rounded-lg border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Theo mã, tên hàng"
          className="w-full rounded-lg border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => setOpenStatus((current) => !current)}
        >
          <p className="font-semibold">Trạng thái</p>

          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openStatus ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            openStatus ? "mt-3 max-h-40" : "max-h-0"
          }`}
        >
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-600" />
              Phiếu tạm
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Đã cân bằng kho
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Đã hủy
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
        <p className="mb-3 font-semibold">Thời gian</p>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="stock-take-time"
              checked={timeMode === "quick"}
              onChange={handleOpenQuickTime}
              className="accent-blue-600"
            />

            <button
              type="button"
              onClick={handleOpenQuickTime}
              className="relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-2 text-left"
            >
              <span>{selectedTime}</span>
              <ChevronDown
                size={16}
                className={`transition ${openTimeOptions ? "rotate-180" : ""}`}
              />
            </button>
          </label>

          {openTimeOptions && (
            <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
              {quickTimeGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-sm font-semibold">{group.title}</p>

                  <div className="space-y-2">
                    {group.options.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleSelectQuickTime(item)}
                        className={`block w-full rounded px-2 py-1 text-left text-sm transition ${
                          selectedTime === item
                            ? "bg-cyan-50 font-semibold text-cyan-700"
                            : "text-blue-600 hover:bg-gray-50 hover:underline"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="stock-take-time"
              checked={timeMode === "range"}
              onChange={handleOpenDatePicker}
              className="accent-blue-600"
            />

            <button
              type="button"
              onClick={handleOpenDatePicker}
              className="relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-2 text-left"
            >
              <span>
                {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
                {format(range[0].endDate, "dd/MM/yyyy")}
              </span>
              <CalendarDays size={16} />
            </button>
          </label>
        </div>

        {openDatePicker && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:p-4">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                setTimeMode("range");
                setRange([item.selection]);
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#2563eb"]}
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpenDatePicker(false)}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
