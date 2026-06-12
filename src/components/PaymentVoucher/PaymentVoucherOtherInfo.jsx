import React from "react";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import AddSupplierModal from "../Suppliers/AddSupplierModal";

export default function PaymentVoucherOtherInfo() {
  const [openAddSupplier, setOpenAddSupplier] = useState(false);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 py-4">

      {/* LEFT */}
      <div className="space-y-3">

        {/* Phương thức TT */}
        <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
          <label className="text-sm">
            Phương thức TT <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" defaultChecked />
              Tiền mặt
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" />
              Tiền gửi
            </label>
          </div>
        </div>

        {/* Chi cho */}
        <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
          <label className="text-sm">
            Chi cho <span className="text-red-500">*</span>
          </label>

          <div className="flex min-w-0">
            <select className="flex-1 min-w-0 h-10 px-3 border border-gray-300 rounded-l-md">
              <option />
            </select>

             <button
              onClick={() => setOpenAddSupplier(true)}
              className="w-10 h-10 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center hover:bg-gray-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Diễn giải */}
        <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
          <label className="text-sm">
            Diễn giải
          </label>

          <input className="w-full h-10 px-3 border border-gray-300 rounded-md" />
        </div>

        {/* Tham chiếu */}
        <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
          <label className="text-sm">
            Tham chiếu
          </label>

          <div />
        </div>

      </div>

      {/* RIGHT */}
      <div className="space-y-3">

        {/* Số phiếu */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-sm whitespace-nowrap">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            value="PC000002"
            readOnly
            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        {/* Thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-sm whitespace-nowrap">
            Thời gian <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              value="10/06/2026 10:00:59"
              readOnly
              className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md bg-gray-50"
            />

            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {/* Người lập phiếu */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-sm whitespace-nowrap">
            Người lập phiếu
          </label>

          <input
            value="Nguyễn Văn A"
            readOnly
            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

      </div>

      <AddSupplierModal
  open={openAddSupplier}
  onClose={() => setOpenAddSupplier(false)}
/>

    </div>
  );
}