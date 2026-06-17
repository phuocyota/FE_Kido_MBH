import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Search,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Landmark,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import DateFilterDropdown from "./DateFilterDropdown";
export default function CashToolbar({
  onAddPaymentVoucher,
  onAddReceiptVoucher,
}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] =

  
  useState(false);

const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpenMenu(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

const buttonRef = useRef(null);

const [menuPosition, setMenuPosition] =
  useState({   
    top: 0,
    left: 0,
  });
 
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                placeholder="Nhập số phiếu, đối tượng"
                className="h-11 w-full sm:w-[320px] lg:w-[420px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
 

<div className="flex flex-col sm:flex-row gap-2">
      <DateFilterDropdown />
    </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <RefreshCw size={17} className="text-gray-600" />
            </button>

            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <FileSpreadsheet size={17} className="text-green-600" />
            </button>

            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <Printer size={17} className="text-gray-600" />
            </button>

            <div className="relative flex-shrink-0">
  <div className="flex overflow-hidden rounded-xl border border-indigo-600 shadow-sm">
    <button
      className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap"
    >
      <Plus size={18} />
      Thêm phiếu
    </button>

    <button
      ref={buttonRef}
      onClick={() => {
        if (
          !openMenu &&
          buttonRef.current
        ) {
          const rect =
            buttonRef.current.getBoundingClientRect();

          setMenuPosition({
            top: rect.bottom + 6,
            left: rect.right - 200,
          });
        }

        setOpenMenu(!openMenu);
      }}
      className="w-10 h-10 bg-indigo-600 border-l border-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 transition"
    >
      <ChevronDown
        size={16}
        className={`transition-transform ${
          openMenu ? "rotate-180" : ""
        }`}
      />
    </button>
  </div>

  {openMenu &&
    createPortal(
      <div
        ref={menuRef}
        className="fixed z-[99999] w-[200px] bg-white rounded-xl border border-gray-300 shadow-xl overflow-hidden"
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
        }}
      >
        <button
  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
  onClick={() => {
    setOpenMenu(false);
    onAddReceiptVoucher?.();
  }}
>
  Thêm phiếu thu
</button>

        <button
  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
  onClick={() => {
    setOpenMenu(false);
    onAddPaymentVoucher?.();
  }}
>
  Thêm phiếu chi
</button>

        <button
          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
          onClick={() =>
            setOpenMenu(false)
          }
        >
          Chuyển tiền nội bộ
        </button>
      </div>,
      document.body
    )}
</div>
          </div>
        </div>

        {/* Banner */}
        <div className="mt-3">
          <div className="rounded-xl border border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex gap-2">
                <Landmark size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />

                <div className="text-sm">
                  <span className="text-gray-700">
                    Kết nối ngân hàng để tự động lập phiếu thu, phiếu chi từ biến động số dư.
                  </span>

                  <button className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">
                    Kết nối ngay →
                  </button>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}