import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import TimeFilterPopup from "./TimeFilterPopup";
import CustomDatePopup from "./CustomDatePopup";

export default function SuppliersSidebar({
  status,
  setStatus,
  selectedTime,
  setSelectedTime,
  showTimeFilter,
  setShowTimeFilter,
  showCustomDate,
  setShowCustomDate,
  selectedGroup,
  setSelectedGroup,
  purchaseFrom,
  setPurchaseFrom,
  purchaseTo,
  setPurchaseTo,
  debtFrom,
  setDebtFrom,
  debtTo,
  setDebtTo,
  groups = ["Tất cả các nhóm"],
}) {
  const [customDateLabel, setCustomDateLabel] = useState("Tùy chỉnh");

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowTimeFilter(false);
        setShowCustomDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowTimeFilter, setShowCustomDate]);

  return (
    <div className="relative w-full overflow-visible rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      {/* Nhóm NCC */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-gray-900 flex items-center">
            Nhóm nhà cung cấp
            {selectedGroup !== "Tất cả các nhóm" && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5"></span>
            )}
          </h3>

          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition">
            Tạo mới
          </button>
        </div>

        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 outline-none focus:border-blue-500 transition cursor-pointer text-sm"
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      {/* Tổng mua */}
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3 flex items-center">
          Tổng mua
          {(purchaseFrom !== "" || purchaseTo !== "" || selectedTime !== "Toàn thời gian") && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5"></span>
          )}
        </h3>

        <p className="text-xs font-medium text-gray-500 mb-2">Giá trị</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center h-10 border border-gray-300 rounded-xl px-3 bg-white focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500 text-sm min-w-[24px]">Từ</span>
            <div className="h-5 w-[1px] bg-gray-200 mx-2" />
            <input
              type="number"
              placeholder="Nhập giá trị"
              value={purchaseFrom}
              onChange={(e) => setPurchaseFrom(e.target.value)}
              className="flex-1 h-full text-sm outline-none placeholder:text-gray-400 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex items-center h-10 border border-gray-300 rounded-xl px-3 bg-white focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500 text-sm min-w-[24px]">Tới</span>
            <div className="h-5 w-[1px] bg-gray-200 mx-2" />
            <input
              type="number"
              placeholder="Nhập giá trị"
              value={purchaseTo}
              onChange={(e) => setPurchaseTo(e.target.value)}
              className="flex-1 h-full text-sm outline-none placeholder:text-gray-400 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <p className="text-xs font-medium text-gray-500 mb-2">Thời gian</p>
        <div ref={popupRef} className="space-y-3 relative">
          {/* Toàn thời gian */}
          <div className="relative">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="stime_supplierPurchaseTimeFilter"
                checked={!showCustomDate}
                onChange={() => {
                  setShowCustomDate(false);
                  setShowTimeFilter(true);
                }}
                className="h-5 w-5 shrink-0 accent-blue-600"
              />

              <button
                type="button"
                onClick={() => {
                  setShowCustomDate(false);
                  setShowTimeFilter(!showTimeFilter);
                }}
                className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
                  !showCustomDate ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
                }`}
              >
                <span className="truncate">{selectedTime}</span>
                <ChevronRight
                  size={16}
                  className={`transition ${showTimeFilter ? "rotate-90" : ""}`}
                />
              </button>
            </label>

            {showTimeFilter && (
  <div className="mt-3 w-full">
    <TimeFilterPopup
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onClose={() => setShowTimeFilter(false)}
    />
  </div>
)}
          </div>

          {/* Tùy chỉnh */}
          <div className="relative">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="stime_supplierPurchaseTimeFilter"
                checked={showCustomDate}
                onChange={() => {
                  setShowTimeFilter(false);
                  setShowCustomDate(true);
                }}
                className="h-5 w-5 shrink-0 accent-blue-600"
              />

              <button
                type="button"
                onClick={() => {
                  setShowTimeFilter(false);
                  setShowCustomDate(!showCustomDate);
                }}
                className={`flex-1 h-10 px-4 rounded-xl flex items-center justify-between bg-white border transition text-sm ${
                  showCustomDate ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"
                }`}
              >
                <span className="truncate">{customDateLabel}</span>
                <Calendar size={16} className="text-gray-500" />
              </button>
            </label>

            {showCustomDate && (
  <div className="mt-3 w-full">
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

            {showCustomDate && (
              <div className="fixed inset-x-2 top-24 z-[9999] lg:absolute lg:inset-auto lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:ml-4">
                <CustomDatePopup
                  onClose={() => setShowCustomDate(false)}
                  onApply={(range) => {
                    setCustomDateLabel(
                      `Từ ${formatDate(range.startDate)} đến ${formatDate(range.endDate)}`
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
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3 flex items-center">
          Nợ hiện tại
          {(debtFrom !== "" || debtTo !== "") && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5"></span>
          )}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center h-10 border border-gray-300 rounded-xl px-3 bg-white focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500 text-sm min-w-[24px]">Từ</span>
            <div className="h-5 w-[1px] bg-gray-200 mx-2" />
            <input
              type="number"
              placeholder="Nhập giá trị"
              value={debtFrom}
              onChange={(e) => setDebtFrom(e.target.value)}
              className="flex-1 h-full text-sm outline-none placeholder:text-gray-400 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex items-center h-10 border border-gray-300 rounded-xl px-3 bg-white focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500 text-sm min-w-[24px]">Tới</span>
            <div className="h-5 w-[1px] bg-gray-200 mx-2" />
            <input
              type="number"
              placeholder="Nhập giá trị"
              value={debtTo}
              onChange={(e) => setDebtTo(e.target.value)}
              className="flex-1 h-full text-sm outline-none placeholder:text-gray-400 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Trạng thái */}
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3 flex items-center">
          Trạng thái
          {status !== "all" && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5"></span>
          )}
        </h3>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatus("all")}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              status === "all"
                ? "bg-[#0f62fe] text-white border-[#0f62fe] shadow-sm"
                : "bg-white text-[#161616] border-[#e0e0e0] hover:border-gray-400"
            }`}
          >
            Tất cả
          </button>

          <button
            type="button"
            onClick={() => setStatus("active")}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              status === "active"
                ? "bg-[#0f62fe] text-white border-[#0f62fe] shadow-sm"
                : "bg-white text-[#161616] border-[#e0e0e0] hover:border-gray-400"
            }`}
          >
            Đang hoạt động
          </button>

          <button
            type="button"
            onClick={() => setStatus("inactive")}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              status === "inactive"
                ? "bg-[#0f62fe] text-white border-[#0f62fe] shadow-sm"
                : "bg-white text-[#161616] border-[#e0e0e0] hover:border-gray-400"
            }`}
          >
            Ngừng hoạt động
          </button>
        </div>
      </div>
    </div>
  );
}
