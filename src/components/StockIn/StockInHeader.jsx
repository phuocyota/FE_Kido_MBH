import React from "react";
import { ChevronDown } from "lucide-react";
import { stockInPurposes, getStockInPurpose } from "./stockInPurposes";
import { useNavigate } from "react-router-dom";
import FormPageHeader from "../Management/FormPageHeader";

const fieldClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

export default function StockInHeader({ reasonCode, onChangeReasonCode, paymentStatus, onChangePaymentStatus, reference, onChangeReference, onBack, disabled = false }) {
  const navigate = useNavigate();
  const purpose = getStockInPurpose(reasonCode);

  return (
    <FormPageHeader
      bare
      eyebrow="Kho / Nhập kho"
      title="Thêm mới phiếu nhập kho"
      onBack={onBack || (() => navigate("/stock-in"))}
      backDisabled={disabled}
      note={`${purpose.description} ${purpose.example}`}
    >
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        {/* Loại nhập */}
        <div className="relative w-full sm:w-[240px]">
          <select
            aria-label="Lý do nhập kho"
            value={reasonCode}
            onChange={(event) => onChangeReasonCode(event.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none pr-10`}
          >
            {stockInPurposes.map((p) => <option key={p.code} value={p.code}>{p.optionLabel}</option>)}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Trạng thái thanh toán */}
        <div className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm">
          {[["DEBT", "Chưa thanh toán"], ["PAID", "Đã thanh toán"]].map(([value, label]) => (
            <label
              key={value}
              className={`flex h-full cursor-pointer items-center whitespace-nowrap rounded-lg px-3 font-medium transition ${
                paymentStatus === value ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={paymentStatus === value}
                onChange={() => onChangePaymentStatus(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Hóa đơn */}
        <input
          type="text"
          aria-label="Chọn HĐ mua hàng"
          value={reference}
          onChange={(e) => onChangeReference(e.target.value)}
          placeholder="Số hóa đơn mua hàng"
          className={`${fieldClass} sm:w-[220px]`}
        />
      </div>
    </FormPageHeader>
  );
}
