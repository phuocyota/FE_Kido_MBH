import React from "react";
import {
  Calendar,
  Plus,
} from "lucide-react";

import { useState } from "react";
import AddSupplierModal from "../Suppliers/AddSupplierModal";

export default function PaymentVoucherPurchaseInfo() {


  const [openAddSupplier, setOpenAddSupplier] = useState(false);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
      {/* LEFT */}
      <div className="lg:col-span-9 space-y-3">

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

    <div className="flex flex-col xl:flex-row gap-3">
      <div className="flex flex-1 min-w-0">
        <select className="flex-1 min-w-0 border border-gray-300 rounded-l-md px-3 h-10">
          <option />
        </select>

        <button
  onClick={() => setOpenAddSupplier(true)}
  className="w-10 h-10 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center hover:bg-gray-50"
>
  <Plus size={16} />
</button>
      </div>

      <div className="flex items-center text-gray-600 italic whitespace-nowrap">
        Tiền nợ NCC: 0
      </div>
    </div>
  </div>

  {/* Số tiền chi */}
  <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
    <label className="text-sm">
      Số tiền chi
    </label>

    <div className="flex flex-col xl:flex-row gap-3">
      <input
        type="number"
        defaultValue={0}
        className="w-full xl:max-w-[500px] border border-gray-300 rounded-md px-3 h-10 text-right"
      />

      <button className="h-10 border border-gray-300 rounded-md px-4 bg-white whitespace-nowrap">
        Chọn chứng từ mua hàng
      </button>
    </div>
  </div>

  {/* Diễn giải */}
  <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] items-center gap-3">
    <label className="text-sm">
      Diễn giải
    </label>

    <input
      className="w-full border border-gray-300 rounded-md px-3 h-10"
    />
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
<div className="lg:col-span-3 space-y-3">

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
        className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50 pr-10"
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