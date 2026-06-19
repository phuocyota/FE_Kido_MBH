import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function InternalTransferDepositInfo() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4">

      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-4 mb-3">

        {/* Tài khoản nhận */}
        <div className="col-span-6">
          <label className="flex items-center gap-1 text-sm font-medium mb-1">
            Tài khoản nhận
            <span className="text-red-500">*</span>
          </label>

          <div className="flex">
            <select className="flex-1 h-10 border border-gray-300 rounded-l-md px-3 outline-none">
              <option></option>
            </select>

            <button
              onClick={() => setOpenModal(true)}
              className="w-10 border border-l-0 border-gray-300 rounded-r-md flex items-center justify-center hover:bg-green-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Người lập phiếu */}
        <div className="col-span-3">
          <label className="block text-sm font-medium mb-1">
            Người lập phiếu
          </label>

          <input
            value="Nguyễn Hữu Phước"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-md px-3 bg-gray-50"
          />
        </div>

        {/* Số phiếu */}
        <div className="col-span-3">
          <label className="flex items-center gap-1 text-sm font-medium mb-1">
            Số phiếu
            <span className="text-red-500">*</span>
          </label>

          <input
            value="CQNB000001"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-md px-3 bg-gray-50"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-4">

        {/* Diễn giải */}
        <div className="col-span-9">
          <label className="block text-sm font-medium mb-1">
            Diễn giải
          </label>

          <input
            className="w-full h-10 border border-gray-300 rounded-md px-3"
          />
        </div>

        {/* Thời gian */}
        <div className="col-span-3">
          <label className="flex items-center gap-1 text-sm font-medium mb-1">
            Thời gian
            <span className="text-red-500">*</span>
          </label>

          <input
            type="datetime-local"
            className="w-full h-10 border border-gray-300 rounded-md px-3"
          />
        </div>
      </div>

    </div>
  );
}