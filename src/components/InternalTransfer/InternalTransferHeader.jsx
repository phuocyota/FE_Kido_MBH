import React from "react";

export default function InternalTransferHeader({
  transferType,
  setTransferType,
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4">
      <div className="flex items-center gap-4">

        <h1 className="text-3xl font-semibold text-gray-800 whitespace-nowrap">
          Thêm mới chuyển tiền nội bộ
        </h1>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">
            Loại chuyển tiền
            <span className="text-red-500 ml-1">*</span>
          </label>

          <select
  value={transferType}
  onChange={(e) =>
    setTransferType(e.target.value)
  }
  className="h-10 border border-gray-300 rounded-lg px-3"
>
  <option value="deposit">
    Nộp tiền vào tài khoản ngân hàng
  </option>

  <option value="bankTransfer">
    Chuyển tiền cho tài khoản ngân hàng khác
  </option>

  <option value="withdraw">
    Rút tiền ngân hàng nhập quỹ
  </option>
</select>
        </div>

      </div>
    </div>
  );
}