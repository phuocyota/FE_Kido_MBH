import React, { useState } from "react";
import { X } from "lucide-react";
import { CalendarDays } from "lucide-react";

export default function AddPaySheetModal({
  open,
  onClose,
  onSave,
}) {
  const [salaryCycle, setSalaryCycle] = useState("Hàng tháng");

  const [workPeriod, setWorkPeriod] = useState(
      "01/06/2026 - 30/06/2026"
    );

  const [scope, setScope] = useState("all");

  

const [monthPeriod, setMonthPeriod] = useState("01/06/2026 - 30/06/2026");

const [fromDate, setFromDate] = useState("2026-06-02");

const [toDate, setToDate] = useState("2026-06-02");

const generateMonthPeriods = (
  year = new Date().getFullYear()
) => {
  return Array.from(
    { length: 12 },
    (_, index) => {
      const month = index + 1;

      const lastDay = new Date(
        year,
        month,
        0
      ).getDate();

      return {
        value: `${String(1).padStart(
          2,
          "0"
        )}/${String(month).padStart(
          2,
          "0"
        )}/${year} - ${String(
          lastDay
        ).padStart(2, "0")}/${String(
          month
        ).padStart(
          2,
          "0"
        )}/${year}`,

        month,
      };
    }
  ).reverse();
};

const [selectedYear, setSelectedYear] = useState(
  new Date().getFullYear()
);

  const monthPeriods = generateMonthPeriods(
    selectedYear
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-2xl font-semibold text-gray-800">
            Thêm bảng tính lương
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          {/* Kỳ hạn trả lương */}

          <div className="flex flex-col md:flex-row md:items-center gap-3">

            <label className="w-full md:w-[160px] font-medium text-gray-700">
              Kỳ hạn trả lương
            </label>

            <select
            value={salaryCycle}
            onChange={(e) =>
            setSalaryCycle(e.target.value)
            }
            className="flex-1 h-11 px-4 border border-gray-300 rounded-xl"
            >
            <option>
            Hàng tháng
            </option>

            <option>
            Tùy chọn
            </option>
            </select>

          </div>

          {/* Kỳ làm việc */}

         <div className="flex flex-col md:flex-row gap-3">

  <label className="w-full md:w-[160px] font-medium text-gray-700">
    Kỳ làm việc
  </label>

  <div className="flex-1">

    {/* Hàng tháng */}

    {salaryCycle === "Hàng tháng" && (

      <select
        value={monthPeriod}
        onChange={(e) =>
          setMonthPeriod(
            e.target.value
          )
        }
        className="w-full h-11 px-4 border border-gray-300 rounded-xl"
      >
        <option>
          01/08/2026 - 31/08/2026
        </option>

        <option>
          01/07/2026 - 31/07/2026
        </option>

        <option>
          01/06/2026 - 30/06/2026
        </option>

        <option>
          01/05/2026 - 31/05/2026
        </option>

        <option>
          01/04/2026 - 30/04/2026
        </option>

      </select>

    )}

    {/* Tùy chọn */}

    {salaryCycle === "Tùy chọn" && (

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

        <div className="relative flex-1">

      <input
      type="date"
      value={fromDate}
      onChange={(e) =>
            setFromDate(e.target.value)
      }
      className="w-full h-11 px-4 pr-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      />

      <CalendarDays
      size={18}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />

      </div>

        <span className="text-gray-500">
          Đến
        </span>

        <div className="relative flex-1">

      <input
      type="date"
      value={toDate}
      onChange={(e) =>
            setToDate(e.target.value)
      }
      className="w-full h-11 px-4 pr-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      />

      <CalendarDays
      size={18}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />

      </div>

      </div>

    )}

  </div>

</div>
          {/* Phạm vi áp dụng */}

          <div className="flex flex-col md:flex-row gap-3">

            <label className="w-full md:w-[160px] font-medium text-gray-700">
              Phạm vi áp dụng
            </label>

            <div className="flex flex-wrap items-center gap-8">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="radio"
                  checked={
                    scope === "all"
                  }
                  onChange={() =>
                    setScope("all")
                  }
                />

                <span>
                  Tất cả nhân viên
                </span>

              </label>

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="radio"
                  checked={
                    scope ===
                    "custom"
                  }
                  onChange={() =>
                    setScope(
                      "custom"
                    )
                  }
                />

                <span>
                  Tùy chọn
                </span>

              </label>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t bg-gray-50">

          <button
            onClick={onClose}
            className="h-11 px-6 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 cursor-pointer"
          >
            Bỏ qua
          </button>

          <button
            onClick={() =>
              onSave?.({
  salaryCycle,

  workPeriod:
    salaryCycle === "Hàng tháng"
      ? monthPeriod
      : {
          fromDate,
          toDate,
        },

  scope,
})
            }
            className="h-11 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 cursor-pointer"
          >
            Lưu
          </button>

        </div>

      </div>

    </div>
  );
}