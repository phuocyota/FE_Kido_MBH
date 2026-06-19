import React, {
  useEffect,
  useRef,
  useState,
} from "react";import { Calendar, ChevronRight } from "lucide-react";
import TimeFilterPopup from "./TimeFilterPopup";
import CustomDatePopup from "./CustomDatePopup";

export default function SuppliersSidebar({
  status,
  setStatus,
  selectedTime,
  showTimeFilter,
  setShowTimeFilter,
  showCustomDate,
  setShowCustomDate,
  setSelectedTime,
}) {

  const [customDateLabel, setCustomDateLabel] = useState(
  "Lựa chọn khác"
);

const formatDate = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("vi-VN");
};

const popupRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target)
    ) {
      setShowTimeFilter(false);
      setShowCustomDate(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, [
  setShowTimeFilter,
  setShowCustomDate,
]);

  return (
    <div className="relative overflow-visible w-full lg:w-[260px] bg-white rounded-2xl border border-gray-200 shadow-sm p-4">

      {/* Nhóm NCC */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Nhóm NCC
          </h3>

          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Tạo mới
          </button>
        </div>

        <select className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500">
          <option>Tất cả các nhóm</option>
        </select>
      </div>

      {/* Tổng mua */}
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
          Tổng mua
        </h3>

        <p className="text-sm text-gray-700 mb-3">
          Giá trị
        </p>

        <div className="space-y-3">

          <div className="flex items-center h-10 border border-gray-300 rounded-xl overflow-hidden bg-white">
            <div className="w-16 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 text-gray-700">
              Từ
            </div>

            <input
              placeholder="Nhập giá trị"
              className="flex-1 h-full px-3 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center h-10 border border-gray-300 rounded-xl overflow-hidden bg-white">
            <div className="w-16 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 text-gray-700">
              Tới
            </div>

            <input
              placeholder="Nhập giá trị"
              className="flex-1 h-full px-3 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

        </div>
      </div>

      {/* Thời gian */}
      <div
  ref={popupRef}
  className="mb-8 relative"
>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
          Thời gian
        </h3>

        <div className="space-y-4">

          {/* Toàn thời gian */}
          <div className="relative">

            <label className="flex items-center gap-3">

              <input
                type="radio"
                checked={!showCustomDate}
                readOnly
                className="w-5 h-5 accent-blue-600"
              />

              <button
                type="button"
                onClick={() => {
                  setShowCustomDate(false);
                  setShowTimeFilter(!showTimeFilter);
                }}
                className="flex-1 h-10 px-4 border border-blue-500 rounded-xl flex items-center justify-between bg-white"
              >
                <span>{selectedTime}</span>

                <ChevronRight
                  size={16}
                  className={`transition ${
                    showTimeFilter ? "rotate-90" : ""
                  }`}
                />
              </button>

            </label>

            {showTimeFilter && (
  <div className="fixed inset-x-2 top-24 z-[9999] lg:absolute lg:inset-auto lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:ml-4">
    <TimeFilterPopup
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onClose={() => setShowTimeFilter(false)}
    />
  </div>
)}
          </div>

          {/* Lựa chọn khác */}
          <div className="relative">

            <label className="flex items-center gap-3">

              <input
                type="radio"
                checked={showCustomDate}
                readOnly
                className="w-5 h-5 accent-blue-600"
              />

              <button
                type="button"
                onClick={() => {
                  setShowTimeFilter(false);
                  setShowCustomDate(!showCustomDate);
                }}
                className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white ${
                  showCustomDate
                    ? "border border-blue-500"
                    : "border border-gray-300"
                }`}
              >
                {/* <span>Lựa chọn khác</span> */}

                <span className="truncate">
  {customDateLabel}
</span>

                <Calendar size={16} />
              </button>

            </label>

            {showCustomDate && (
  <div className="fixed inset-x-2 top-24 z-[9999] lg:absolute lg:inset-auto lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:ml-4">
    <CustomDatePopup
  onClose={() => setShowCustomDate(false)}
  onApply={(range) => {
    setCustomDateLabel(
      `Từ ${formatDate(range.startDate)} đến ${formatDate(
        range.endDate
      )}`
    );

    setShowCustomDate(false);
  }}
/>
  </div>
)}

          </div>

        </div>
      </div>

      {/* Nợ hiện tại */}
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
          Nợ hiện tại
        </h3>

        <div className="space-y-3">

          <div className="flex items-center h-10 border border-gray-300 rounded-xl overflow-hidden bg-white">
            <div className="w-16 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 text-gray-700">
              Từ
            </div>

            <input
              placeholder="Nhập giá trị"
              className="flex-1 h-full px-3 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center h-10 border border-gray-300 rounded-xl overflow-hidden bg-white">
            <div className="w-16 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 text-gray-700">
              Tới
            </div>

            <input
              placeholder="Nhập giá trị"
              className="flex-1 h-full px-3 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

        </div>
      </div>

      {/* Trạng thái */}
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">
          Trạng thái
        </h3>

        <div className="space-y-3">

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={status === "all"}
              onChange={() => setStatus("all")}
              className="w-5 h-5 accent-blue-600"
            />

            <span>Tất cả</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={status === "active"}
              onChange={() => setStatus("active")}
              className="w-5 h-5 accent-blue-600"
            />

            <span>Đang hoạt động</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
              className="w-5 h-5 accent-blue-600"
            />

            <span>Ngừng hoạt động</span>
          </label>

        </div>
      </div>

    </div>
  );
}