import React from "react";
import { RefreshCcw } from "lucide-react";
import PageHeader from "../Management/PageHeader";
export default function CashHeader({ onRefresh }) {
  return (
    <PageHeader
      eyebrow="Tài chính / Thu chi"
      title="Quản lý tiền"
      description="Theo dõi thu, chi và các phiếu giao dịch."
      actions={
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCcw size={15} />
          Làm mới
        </button>
      }
    />
  );
}
