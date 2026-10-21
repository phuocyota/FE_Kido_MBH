import React from "react";
export default function VoucherHeader({
  value,
  onChange,
  title,
  kind,
  reasonLabel,
  description,
  paymentMethod,
  onChangePaymentMethod,
}) {
  return (
    <header className="erp-page-header">
      <div className="min-w-0 w-full">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Tài chính / {kind}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <select
            aria-label={`Lý do ${kind === "Phiếu thu" ? "thu" : "chi"}`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
          >
            <option value={value}>{reasonLabel}</option>
          </select>
          <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <legend className="sr-only">Phương thức thanh toán</legend>
            {[
              ["CASH", "Tiền mặt"],
              ["BANK", "Chuyển khoản"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-900"
              >
                <input
                  type="radio"
                  name={`voucher-payment-${kind}`}
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => onChangePaymentMethod(value)}
                  className="h-4 w-4 accent-blue-600"
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </header>
  );
}
