import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Check,
  ChevronDown,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateFilterDropdown({ onApply }) {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] =
    useState("Tháng này");

  const [range, setRange] = useState(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from,
      to: today,
    };
  });

  const dropdownRef = useRef(null);

  const periods = [
    "7 ngày qua",
    "30 ngày qua",
    "Tuần này",
    "Tuần trước",
    "Tháng này",
    "Tháng trước",
    "Năm nay",
    "Năm trước",
    "Tùy chọn",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
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
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("vi-VN");
  };

  const handleSelectPeriod = (period) => {
    setSelected(period);

    const today = new Date();

    let from;
    let to;

    switch (period) {
      case "7 ngày qua":
        from = new Date();
        from.setDate(today.getDate() - 6);
        to = today;
        break;

      case "30 ngày qua":
        from = new Date();
        from.setDate(today.getDate() - 29);
        to = today;
        break;

      case "Tuần này": {
        const day =
          today.getDay() === 0
            ? 6
            : today.getDay() - 1;

        from = new Date(today);
        from.setDate(today.getDate() - day);

        to = today;
        break;
      }

      case "Tuần trước": {
        const day =
          today.getDay() === 0
            ? 6
            : today.getDay() - 1;

        from = new Date(today);
        from.setDate(
          today.getDate() - day - 7
        );

        to = new Date(from);
        to.setDate(from.getDate() + 6);

        break;
      }

      case "Tháng này":
        from = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

        to = today;
        break;

      case "Tháng trước":
        from = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        to = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        break;

      case "Năm nay":
        from = new Date(
          today.getFullYear(),
          0,
          1
        );

        to = today;
        break;

      case "Năm trước":
        from = new Date(
          today.getFullYear() - 1,
          0,
          1
        );

        to = new Date(
          today.getFullYear() - 1,
          11,
          31
        );
        break;

      default:
        return;
    }

    setRange({
      from,
      to,
    });
  };


  const buttonRef = useRef(null);
const [position, setPosition] = useState({
  top: 0,
  left: 0,
});

const handleToggle = () => {
  if (!open && buttonRef.current) {
    const rect =
      buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }

  setOpen(!open);
};

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
          ref={buttonRef}
  onClick={handleToggle}
        className="h-11 min-w-[160px] rounded-xl border border-gray-300 bg-white px-4 flex items-center justify-between gap-3 text-sm font-medium hover:bg-gray-50"
      >
        <span>{selected}</span>

        <ChevronDown size={16} />
      </button>

      {open && (
  <div
    className="fixed z-[9999] bg-white border border-gray-300 rounded-2xl shadow-2xl"
    style={{
      top: position.top,
      left: position.left,
      width: 900,
    }}
  >
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-[190px] border-b md:border-b-0 md:border-r border-gray-300 py-2">
              {periods.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    handleSelectPeriod(
                      item
                    )
                  }
                  className={`w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 ${
                    selected === item
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {item}

                  {selected === item && (
                    <Check size={16} />
                  )}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="flex-1 overflow-x-auto">
  <div className="min-w-[620px] p-4">
    <DayPicker
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      pagedNavigation
      weekStartsOn={1}
      classNames={{
        months: "flex flex-row gap-10",
      }}
    />
  </div>
</div>



          </div>

          <div className="border-t border-gray-300 px-5 py-3 flex items-center justify-between">
  <div className="flex items-center gap-2 ml-45">
    <input
      readOnly
      value={formatDate(range?.from)}
      className="h-10 w-[120px] border border-gray-300 rounded-lg px-3"
    />

    <span>-</span>

    <input
      readOnly
      value={formatDate(range?.to)}
      className="h-10 w-[120px] border border-gray-300 rounded-lg px-3"
    />
  </div>

  <div className="flex gap-2">
    <button
      className="h-10 px-5 rounded-lg border border-gray-300"
      onClick={() => setOpen(false)}
    >
      Hủy
    </button>

    <button
      className="h-10 px-5 rounded-lg bg-indigo-600 text-white"
      onClick={() => {
        if (range?.from && range?.to) {
          onApply?.({
            from: range.from,
            to: range.to
          }, selected);
        }
        setOpen(false);
      }}
    >
      Áp dụng
    </button>
  </div>
</div>
        </div>
      )}

      
    </div>
  );
}