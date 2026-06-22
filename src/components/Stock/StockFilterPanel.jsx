import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import StockFilterSelect from "./StockFilterSelect";

const postingStatusOptions = ["Tất cả", "Đã ghi sổ", "Chưa ghi sổ"];

const reportPeriodOptions = [
  "Đầu năm đến hiện tại",
  "Sáu tháng đầu năm",
  "Sáu tháng cuối năm",
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const stockInTypeOptions = [
  "Tất cả",
  "Mua hàng trong nước nhập kho",
  "Nhập khẩu",
  "Nhập kho khác",
  "Nhập kho thành phẩm",
  "Nhập kho điều chuyển",
];

const stockOutTypeOptions = [
  "Tất cả",
  "Xuất kho bán hàng",
  "Xuất hàng cho chi nhánh khác",
  "Xuất kho khác",
  "Xuất kho sản xuất",
  "Xuất kho lắp ráp",
];

const paymentStatusOptions = ["Tất cả", "Đã thanh toán", "Chưa thanh toán"];
const salesDocumentStatusOptions = ["Tất cả", "Đã lập", "Chưa lập"];

const formatDate = (date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const parseDate = (value) => {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return undefined;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return undefined;
  }

  return date;
};

function DateBox({ label, value, onChange, align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseDate(value);

  return (
    <div className="relative min-w-0">
      <label className="mb-1 block text-xs font-bold text-slate-900">
        {label}
      </label>

      <div
        className={`flex h-7 w-full items-center border bg-white px-2 ${
          isOpen ? "border-cyan-600" : "border-slate-300"
        }`}
      >
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center text-slate-500 hover:text-cyan-700"
          title={`Chọn ${label.toLowerCase()}`}
        >
          <CalendarDays size={15} />
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute top-[calc(100%+4px)] z-[80] rounded border border-slate-300 bg-white p-2 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Lịch chọn ngày thật; chọn xong sẽ tự đóng để thao tác nhanh. */}
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(formatDate(date));
              setIsOpen(false);
            }}
            defaultMonth={selectedDate}
            weekStartsOn={1}
            className="text-sm"
            classNames={{
              month_caption: "flex h-8 items-center justify-center font-semibold",
              nav: "flex items-center justify-between",
              button_previous:
                "absolute left-3 top-3 rounded p-1 hover:bg-slate-100",
              button_next:
                "absolute right-3 top-3 rounded p-1 hover:bg-slate-100",
              weekday: "h-8 w-8 text-xs font-semibold text-slate-500",
              day: "h-8 w-8 p-0 text-center text-sm",
              day_button:
                "h-8 w-8 rounded text-sm transition hover:bg-cyan-50",
              selected:
                "rounded bg-teal-600 font-bold text-white hover:bg-teal-600",
              today: "font-bold text-cyan-700",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function StockFilterPanel({
  type,
  values,
  onChange,
  onReset,
  onApply,
}) {
  const isStockOut = type === "out";
  const typeLabel = isStockOut ? "Loại xuất" : "Loại nhập";
  const statusLabel = isStockOut
    ? "Trạng thái lập chứng từ bán hàng"
    : "Trạng thái thanh toán";
  const typeOptions = isStockOut ? stockOutTypeOptions : stockInTypeOptions;
  const statusOptions = isStockOut
    ? salesDocumentStatusOptions
    : paymentStatusOptions;

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[60] w-[calc(100vw-1.5rem)] border border-slate-300 bg-white p-4 shadow-xl sm:w-[560px]">
      <div className="grid gap-3">
        <StockFilterSelect
          label="Trạng thái ghi sổ"
          value={values.postingStatus}
          options={postingStatusOptions}
          onChange={(value) => onChange("postingStatus", value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <StockFilterSelect
            label={typeLabel}
            value={values.documentType}
            options={typeOptions}
            onChange={(value) => onChange("documentType", value)}
          />

          <StockFilterSelect
            label={statusLabel}
            value={values.secondaryStatus}
            options={statusOptions}
            onChange={(value) => onChange("secondaryStatus", value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_128px_128px]">
          <StockFilterSelect
            label="Kỳ báo cáo"
            value={values.reportPeriod}
            options={reportPeriodOptions}
            onChange={(value) => onChange("reportPeriod", value)}
          />

          <DateBox
            label="Từ ngày"
            value={values.fromDate}
            onChange={(value) => onChange("fromDate", value)}
          />

          <DateBox
            label="Đến ngày"
            value={values.toDate}
            onChange={(value) => onChange("toDate", value)}
            align="right"
          />
        </div>

        <button
          type="button"
          className="w-fit text-sm font-medium text-sky-700 hover:underline"
        >
          Lọc nâng cao
        </button>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="h-8 rounded border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={onApply}
            className="h-8 rounded bg-cyan-600 px-6 text-sm font-bold text-white transition hover:bg-cyan-700"
          >
            Lọc
          </button>
        </div>
      </div>
    </div>
  );
}
