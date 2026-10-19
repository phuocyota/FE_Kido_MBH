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
} from "lucide-react";
import { createPortal } from "react-dom";
export default function CashToolbar({
  onAddPaymentVoucher,
  onAddReceiptVoucher,
  filters,
  setFilters,
  onRefresh,
  filterControl,
}) {
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

const handleToggleMenu = () => {
  if (!openMenu && buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + 6,
      left: rect.right - 200,
    });
  }

  setOpenMenu((current) => !current);
};
 
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-0">
        <div className="erp-toolbar">
          {/* Filter */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">

            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                placeholder="Nhập số phiếu, đối tượng"
                className="h-9 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={filters?.search || ""}
                onChange={(e) =>
                  setFilters?.((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {filterControl}
            <button
              onClick={onRefresh}
              className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
            >
              <RefreshCw size={17} className="text-gray-600" />
            </button>


            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <FileSpreadsheet size={17} className="text-green-600" />
            </button>

            <button className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition">
              <Printer size={17} className="text-gray-600" />
            </button>

            <div className="relative flex-shrink-0">
  <div
    ref={buttonRef}
    className="flex overflow-hidden rounded-xl border border-indigo-600 shadow-sm"
  >
    <button
      type="button"
      onClick={handleToggleMenu}
      className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap"
    >
      <Plus size={18} />
      Thêm phiếu
    </button>

    <button
      type="button"
      onClick={handleToggleMenu}
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
  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
  onClick={() => {
    setOpenMenu(false);
    onAddReceiptVoucher?.();
  }}
>
  Thêm phiếu thu
</button>

        <button
  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
  onClick={() => {
    setOpenMenu(false);
    onAddPaymentVoucher?.();
  }}
>
  Thêm phiếu chi
</button>

      </div>,
      document.body
    )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
