import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { stockInPurposes } from "../StockIn/stockInPurposes";
import StockFilterSelect from "./StockFilterSelect";

const stockInTypeOptions = ["Tất cả", ...stockInPurposes.map((purpose) => purpose.title)];

const stockOutTypeOptions = [
  "Tất cả",
  "Xuất kho bán hàng",
  "Xuất hàng cho chi nhánh khác",
  "Xuất kho khác",
  "Xuất kho sản xuất",
  "Xuất kho lắp ráp",
];

const stockTransferTypeOptions = [
  "Tất cả",
  "Chuyển kho nội bộ",
  "Chuyển kho điều chuyển",
];

const paymentStatusOptions = ["Tất cả", "Đã thanh toán", "Chưa thanh toán"];
const salesDocumentStatusOptions = ["Tất cả", "Đã lập", "Chưa lập"];
const transferStatusOptions = ["Tất cả", "Phiếu tạm", "Đã chuyển", "Đã hủy"];

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

function DateBox({
  label,
  value,
  onChange,
  align = "left",
  sidebar = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseDate(value);

  return (
    <div className="relative min-w-0">
      <label
        className={
          sidebar
            ? "mb-2 block font-medium text-slate-900"
            : "mb-1 block text-xs font-bold text-slate-900"
        }
      >
        {label}
      </label>

      <div
        className={`flex w-full items-center border bg-white ${
          sidebar ? "h-10 rounded-lg px-3" : "h-7 px-2"
        } ${
          isOpen ? "border-indigo-600" : "border-slate-300"
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
          className="ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center text-slate-500 hover:text-indigo-700"
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
                "h-8 w-8 rounded text-sm transition hover:bg-indigo-50",
              selected:
                "rounded bg-indigo-600 font-bold text-white hover:bg-indigo-600",
              today: "font-bold text-indigo-700",
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
  embedded = false,
}) {
  const isStockOut = type === "out";
  const isStockTransfer = type === "transfer";
  const typeLabel = isStockTransfer
    ? "Loại chứng từ"
    : isStockOut
    ? "Loại xuất"
    : "Loại nhập";
  const statusLabel = isStockTransfer
    ? "Trạng thái"
    : isStockOut
    ? "Trạng thái lập chứng từ bán hàng"
    : "Trạng thái thanh toán";
  const typeOptions = isStockTransfer
    ? stockTransferTypeOptions
    : isStockOut
    ? stockOutTypeOptions
    : stockInTypeOptions;
  const statusOptions = isStockTransfer
    ? transferStatusOptions
    : isStockOut
    ? salesDocumentStatusOptions
    : paymentStatusOptions;

  if (embedded) {
    return (
      <div className="w-full space-y-4">
        <div className="space-y-4 rounded-xl bg-white p-4 shadow">
          <StockFilterSelect
            label={typeLabel}
            value={values.documentType}
            options={typeOptions}
            onChange={(value) => onChange("documentType", value)}
            sidebar
          />

          <StockFilterSelect
            label={statusLabel}
            value={values.secondaryStatus}
            options={statusOptions}
            onChange={(value) => onChange("secondaryStatus", value)}
            sidebar
          />
        </div>

        <div className="space-y-4 rounded-xl bg-white p-4 shadow">

          <DateBox
            label="Từ ngày"
            value={values.fromDate}
            onChange={(value) => onChange("fromDate", value)}
            sidebar
          />

          <DateBox
            label="Đến ngày"
            value={values.toDate}
            onChange={(value) => onChange("toDate", value)}
            sidebar
          />

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onReset}
              className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Đặt lại
            </button>

            <button
              type="button"
              onClick={onApply}
              className="h-9 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[60] w-[calc(100vw-1.5rem)] border border-slate-300 bg-white p-4 shadow-xl sm:w-[560px]">
      <div className="grid gap-3">
        <div className={`grid gap-3 ${embedded ? "" : "sm:grid-cols-2"}`}>
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

        <div
          className={`grid gap-3 ${
            embedded ? "" : "sm:grid-cols-2"
          }`}
        >

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

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="h-8 rounded border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-700"
          >
            Đặt lại
          </button>

          <button
            type="button"
            onClick={onApply}
            className="h-8 rounded bg-indigo-600 px-6 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Lọc
          </button>
        </div>
      </div>
    </div>
  );
}
