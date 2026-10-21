import React, { useId } from "react";
import { authApi } from "../../api/authApi";

const inputClass =
  "w-full min-w-0 h-10 border border-gray-300 rounded-lg px-3 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const rowClass =
  "grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2 sm:gap-4";

export default function VoucherInfoLayout({
  sourceLabel,
  sourceControl,
  sourceHint,
  note,
  onChangeNote,
  reference,
  onChangeReference,
  voucherNumber,
  voucherDate,
}) {
  const id = useId();
  const date = voucherDate ? new Date(voucherDate) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      : "";
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-9 space-y-4">
        <div className={rowClass}>
          <p className="text-sm font-medium">
            {sourceLabel} <span className="text-red-500">*</span>
          </p>
          <div className="min-w-0">
            {sourceControl}
            {sourceHint && (
              <p className="mt-2 text-xs text-slate-500">{sourceHint}</p>
            )}
          </div>
        </div>
        <div className={rowClass}>
          <label htmlFor={`${id}-note`} className="text-sm font-medium">
            Diễn giải
          </label>
          <input
            id={`${id}-note`}
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            className={inputClass}
            placeholder="Nhập diễn giải..."
          />
        </div>
        <div className={rowClass}>
          <label htmlFor={`${id}-reference`} className="text-sm font-medium">
            Tham chiếu
          </label>
          <input
            id={`${id}-reference`}
            value={reference}
            onChange={(e) => onChangeReference(e.target.value)}
            className={inputClass}
            placeholder="Nhập tham chiếu..."
          />
        </div>
      </div>
      <div className="xl:col-span-3 space-y-4">
        {[
          ["number", "Số phiếu", voucherNumber, "Tự động khi lưu"],
          ["date", "Thời gian", formattedDate, ""],
          ["creator", "Người lập phiếu", authApi.getUserInfo().fullName, ""],
        ].map(([key, label, value, placeholder]) => (
          <div
            key={key}
            className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-2 sm:gap-3"
          >
            <label htmlFor={`${id}-${key}`} className="text-sm font-medium">
              {label}
            </label>
            <input
              id={`${id}-${key}`}
              value={value || ""}
              readOnly
              placeholder={placeholder}
              className={`${inputClass} !bg-gray-50`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
