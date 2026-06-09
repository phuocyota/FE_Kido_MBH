import React, { useState, useRef, useEffect } from "react";
 import { CalendarDays, ChevronDown } from "lucide-react";
 import TimeFilterPopup from "./TimeFilterPopup";
import CustomDatePopup from "./CustomDatePopup";

export default function EmployeeReportSidebar({
  viewType,
  setViewType,
  focusType,
  setFocusType,
  period,
  setPeriod,
  employee,
  setEmployee,
  employees = [],
}) {

      const [showTimePopup, setShowTimePopup] = useState(false);
const [showCustomDate, setShowCustomDate] = useState(false);

const [selectedTime, setSelectedTime] = useState("Tuần trước");

const timePopupRef = useRef(null);
const customPopupRef = useRef(null);

useEffect(() => {
  if (focusType === "time") {
    setViewType("chart");
  }

  if (
    focusType === "cashier" ||
    focusType === "profit"
  ) {
    setViewType("vertical");
  }
}, [focusType]);

// Đóng popup khi click ra ngoài
useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      timePopupRef.current &&
      !timePopupRef.current.contains(e.target)
    ) {
      setShowTimePopup(false);
    }

    if (
      customPopupRef.current &&
      !customPopupRef.current.contains(e.target)
    ) {
      setShowCustomDate(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);



  return (
    <div className="w-full lg:w-[320px] flex flex-col gap-4">

      {/* Nhân viên */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-5">Nhân viên</h3>

        <div className="relative">
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 appearance-none bg-white"
          >
            <option value="all">Tất cả nhân viên</option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>


      {/* Kiểu hiển thị */}
<div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
  <h3 className="text-lg font-semibold mb-5">
    Kiểu hiển thị
  </h3>

  <div className="space-y-4">
    {/* THỜI GIAN */}
    {focusType === "time" && (
      <>
        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="radio"
            name="viewType"
            checked={viewType === "chart"}
            onChange={() => setViewType("chart")}
            className="w-6 h-6 accent-purple-600"
          />
          <span className="text-lg">Biểu đồ</span>
        </label>

        <label className="flex items-center gap-4 cursor-pointer">
        <input
          type="radio"
          name="viewType"
          checked={viewType === "report"}
          onChange={() => setViewType("report")}
          className="w-6 h-6 accent-purple-600"
        />
        <span className="text-lg">
          Báo cáo
        </span>
      </label>
      </>
    )}

    {/* THU NGÂN + LỢI NHUẬN */}
    {(focusType === "cashier" ||
      focusType === "profit") && (
      <>
        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="radio"
            name="viewType"
            checked={viewType === "vertical"}
            onChange={() => setViewType("vertical")}
            className="w-6 h-6 accent-purple-600"
          />
          <span className="text-lg">
            Báo cáo dọc
          </span>
        </label>

        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="radio"
            name="viewType"
            checked={viewType === "horizontal"}
            onChange={() => setViewType("horizontal")}
            className="w-6 h-6 accent-purple-600"
          />
          <span className="text-lg">
            Báo cáo ngang
          </span>
        </label>
      </>
    )}
  </div>
</div>

     {/* Mối quan tâm */}
<div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
  <h3 className="text-lg font-semibold mb-5">Mối quan tâm</h3>

  <div className="space-y-5">
    <label className="flex items-center gap-4 cursor-pointer">
      <input
        type="radio"
        name="focusType"
        checked={focusType === "cashier"}
        onChange={() => setFocusType("cashier")}
                        className="w-6 h-6 accent-purple-600"

      />
      <span className="text-lg text-gray-800">Thu ngân</span>
    </label>

    <label className="flex items-center gap-4 cursor-pointer">
      <input
        type="radio"
        name="focusType"
        checked={focusType === "time"}
        onChange={() => setFocusType("time")}
              className="w-6 h-6 accent-purple-600"
      />
      <span className="text-lg text-gray-800">Thời gian</span>
    </label>

    <label className="flex items-center gap-4 cursor-pointer">
      <input
        type="radio"
        name="focusType"
        checked={focusType === "profit"}
        onChange={() => setFocusType("profit")}
              className="w-6 h-6 accent-purple-600"
      />
      <span className="text-lg text-gray-800">Lợi nhuận</span>
    </label>
  </div>
</div>

      {/* Thời gian */}
<div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
  <h3 className="text-lg font-semibold mb-5">
    Thời gian
  </h3>

  <div className="space-y-4">
    {/* Chọn nhanh */}
    <div className="relative" ref={timePopupRef}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          checked={!showCustomDate}
          readOnly
          className="w-5 h-5 accent-purple-600"
        />

        <button
          type="button"
          onClick={() =>
            setShowTimePopup(!showTimePopup)
          }
          className="flex-1 h-12 border border-gray-300 rounded-xl px-4 flex items-center justify-between bg-white"
        >
          <span>{selectedTime}</span>

          <ChevronDown size={18} />
        </button>
      </label>

      {showTimePopup && (
  <div className="absolute top-1/2 left-[calc(100%+20px)] -translate-y-1/2 z-[999]">
    <TimeFilterPopup
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onClose={() => setShowTimePopup(false)}
    />
  </div>
)}
    </div>

    {/* Chọn khoảng thời gian */}
    <div className="relative" ref={customPopupRef}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          checked={showCustomDate}
          onChange={() =>
            setShowCustomDate(true)
          }
          className="w-5 h-5 accent-purple-600"
        />

        <button
          type="button"
          onClick={() =>
            setShowCustomDate(true)
          }
          className="flex-1 h-12 border border-gray-300 rounded-xl px-4 flex items-center justify-between bg-white"
        >
          <span>Lựa chọn khác</span>

          <CalendarDays size={18} />
        </button>
      </label>

     {showCustomDate && (
  <div className="absolute top-1/2 left-[calc(100%+20px)] -translate-y-1/2 z-[999]">
    <CustomDatePopup
      onClose={() =>
        setShowCustomDate(false)
      }
    />
  </div>
)}
    </div>
  </div>
</div>

      
    </div>
  );
}