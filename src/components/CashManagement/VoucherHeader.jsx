import React from "react";
import FormPageHeader from "../Management/FormPageHeader";

export default function VoucherHeader({
  value,
  onChange,
  title,
  kind,
  reasonLabel,
  description,
  paymentMethod,
  onChangePaymentMethod,
  onBack,
}) {
  return (
    <FormPageHeader bare eyebrow={`Tài chính / ${kind}`} title={title} onBack={onBack} note={description}>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <select
          aria-label={`Lý do ${kind === "Phiếu thu" ? "thu" : "chi"}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-500/15 sm:w-56"
        >
          <option value={value}>{reasonLabel}</option>
        </select>
        <fieldset className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm">
          <legend className="sr-only">Phương thức thanh toán</legend>
          {[
            ["CASH", "Tiền mặt"],
            ["BANK", "Chuyển khoản"],
          ].map(([method, label]) => (
            <label
              key={method}
              className={`flex h-full cursor-pointer items-center whitespace-nowrap rounded-lg px-3 font-medium transition ${
                paymentMethod === method ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <input
                type="radio"
                name={`voucher-payment-${kind}`}
                value={method}
                checked={paymentMethod === method}
                onChange={() => onChangePaymentMethod(method)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
    </FormPageHeader>
  );
}
