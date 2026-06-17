import React from "react";
import { X } from "lucide-react";

export default function PaymentVoucherHeader({
  expenseType,
  setExpenseType,
  onClose,
}) {
  return (
    <div className="bg-white border-b border-gray-300 px-3 lg:px-4 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-semibold">
            Thêm mới phiếu chi
          </h1>

          <select
            value={expenseType}
            onChange={(e) =>
              setExpenseType(e.target.value)
            }
            className="h-10 border border-gray-300 rounded-md px-3 w-full sm:w-[220px]"
          >
            <option value="purchase">
              Chi tiền mua hàng
            </option>

            <option value="other">
              Chi khác
            </option>
          </select>
        </div>


 <button
          type="button"
          onClick={onClose}
          className="self-end lg:self-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Đóng"
        >
          <X size={20} />
        </button>
       
      </div>
    </div>
  );
}