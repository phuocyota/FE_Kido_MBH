import React from "react";
import ReceiptVoucherHeader from "../../components/ReceiptVoucher/ReceiptVoucherHeader";
import ReceiptVoucherInfo from "../../components/ReceiptVoucher/ReceiptVoucherInfo";
import ReceiptVoucherTable from "../../components/ReceiptVoucher/ReceiptVoucherTable";
import ReceiptVoucherFooter from "../../components/ReceiptVoucher/ReceiptVoucherFooter";
import { ArrowLeft } from "lucide-react";

export default function ReceiptVoucher({
  onBack,
}) {
  return (
    <div className="bg-gray-100 min-h-screen p-4">

      <button
  onClick={onBack}
  className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 mb-4 mt-2"
>
  <ArrowLeft size={18} />
  Quay lại
</button>
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <ReceiptVoucherHeader />

        <div className="p-4 space-y-4">
          <ReceiptVoucherInfo />

          <ReceiptVoucherTable />
        </div>

        <ReceiptVoucherFooter />
      </div>
    </div>
  );
}