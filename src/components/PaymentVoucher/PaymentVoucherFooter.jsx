import React from "react";

export default function PaymentVoucherFooter() {
  return (
    <div className="bg-white border-t border-gray-300 px-3 lg:px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
            📎 File đính kèm

            <input
              type="file"
              className="hidden"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button className="h-10 px-5 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            Hủy
          </button>

          <button className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}