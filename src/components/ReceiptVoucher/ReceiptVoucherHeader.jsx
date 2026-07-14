import React from "react";
import { X } from "lucide-react";

export default function ReceiptVoucherHeader({ receiptType, onChangeReceiptType }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 bg-gray-50">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold">
          Thêm mới phiếu thu
        </h1>

        <select
          value={receiptType}
          onChange={(e) => onChangeReceiptType(e.target.value)}
          className="h-10 px-3 border border-gray-300 rounded-lg"
        >
          <option value="Thu khác">Thu khác</option>
          <option value="Thu khách hàng">Thu khách hàng</option>
          <option value="Thu hoàn ứng">Thu hoàn ứng</option>
        </select>
      </div>

      
    </div>
  );
}