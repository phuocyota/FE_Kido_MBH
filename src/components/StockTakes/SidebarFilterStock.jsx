import React, { useState, useEffect, useRef } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

export default function SidebarFilterStock() {
  const popupRef = useRef();

  // ===== QUICK SELECT =====
  const [openTimePopup, setOpenTimePopup] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Tháng này");

  const handleSelect = (value) => {
    setSelectedTime(value);
    setOpenTimePopup(false);
  };

  // ===== DATE RANGE =====
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [openDatePopup, setOpenDatePopup] = useState(false);

  // ===== AUTO CLOSE POPUP =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!popupRef.current?.contains(e.target)) {
        setOpenTimePopup(false);
        setOpenDatePopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // đóng mở trang thái 
  const [openStatus, setOpenStatus] = useState(true);

  return (
    <div className="w-full md:w-72 space-y-4" ref={popupRef}>

      {/* ===== TÌM KIẾM ===== */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
        <p className="font-semibold mb-3">Tìm kiếm</p>

        <input
          type="text"
          placeholder="Theo mã phiếu kiểm"
          className="w-full border border-gray-300 rounded-lg p-2 mb-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Theo mã, tên hàng"
          className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

 
      {/* ===== TRẠNG THÁI ===== */}
<div className="bg-gray-50 p-4 rounded-xl border border-gray-300">

  {/* HEADER */}
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={() => setOpenStatus(!openStatus)}
  >
    <p className="font-semibold">Trạng thái</p>

    <ChevronDown
      size={16}
      className={`transition-transform duration-300 ${
        openStatus ? "rotate-180" : ""
      }`}
    />
  </div>

  {/* CONTENT */}
  <div
    className={`overflow-hidden transition-all duration-300 ${
      openStatus ? "max-h-40 mt-3" : "max-h-0"
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

      {/* ===== THỜI GIAN ===== */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 relative">
        <p className="font-semibold mb-3">Thời gian</p>

        <div className="space-y-3">

          {/* QUICK SELECT */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="time"
              checked={!openDatePopup}
              readOnly
              className="accent-blue-600"
            />

            <div className="relative w-full">
              <div
                onClick={() => {
                  setOpenTimePopup(!openTimePopup);
                  setOpenDatePopup(false);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white cursor-pointer"
              >
                {selectedTime}
              </div>

              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </label>

          {/* DATE RANGE */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="time"
              checked={openDatePopup}
              readOnly
              className="accent-blue-600"
            />

            <div className="relative w-full">
              <div
                onClick={() => {
                  setOpenDatePopup(true);
                  setOpenTimePopup(false);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white cursor-pointer"
              >
                {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
                {format(range[0].endDate, "dd/MM/yyyy")}
              </div>

              <CalendarDays
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </label>

        </div>

        {/* ===== QUICK POPUP ===== */}
        {openTimePopup && (
<div className="fixed inset-x-2 top-24 z-[9999] bg-white rounded-xl shadow-xl p-4 max-h-[80vh] overflow-auto lg:absolute lg:inset-auto lg:left-full lg:top-0 lg:ml-3 lg:w-[520px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">            <div>
              <p className="font-semibold mb-3 text-sm">Theo ngày & tuần</p>
              {["Hôm nay", "Hôm qua", "Tuần này", "Tuần trước", "7 ngày qua"].map((item) => (
                <p key={item} onClick={() => handleSelect(item)} className="text-blue-600 mt-2 cursor-pointer hover:underline">
                  {item}
                </p>
              ))}
            </div>

            <div>
              <p className="font-semibold mb-3 text-sm">Theo tháng & quý</p>
              {["Tháng này", "Tháng trước", "30 ngày qua", "Quý này", "Quý trước"].map((item) => (
                <p key={item} onClick={() => handleSelect(item)} className="text-blue-600 mt-2 cursor-pointer hover:underline">
                  {item}
                </p>
              ))}
            </div>

            <div>
              <p className="font-semibold mb-3 text-sm">Theo năm</p>
              {["Năm nay", "Năm trước", "Toàn thời gian"].map((item) => (
                <p key={item} onClick={() => handleSelect(item)} className="text-blue-600 mt-2 cursor-pointer hover:underline">
                  {item}
                </p>
              ))}
            </div>

          </div>
        )}

        {/* ===== DATE RANGE POPUP ===== */}
        {openDatePopup && (
<div className="fixed inset-x-2 top-24 z-[9999] bg-white rounded-xl shadow-xl p-2 sm:p-4 max-h-[80vh] overflow-auto lg:absolute lg:inset-auto lg:left-full lg:top-0 lg:ml-3 lg:w-[800px]">
             <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#2563eb"]}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpenDatePopup(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                🔎 Tìm kiếm
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}