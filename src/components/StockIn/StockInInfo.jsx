import React from "react";

import {
   Plus,
} from "lucide-react";
import { useState } from "react";
import AddSupplierModal from "../Suppliers/AddSupplierModal";

export default function StockInInfo() {
  const [openAddSupplier, setOpenAddSupplier] = useState(false);

  return (
    <div className="p-3 md:p-4 border-b border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

        {/* Nhà cung cấp */}
        <div className="md:col-span-9">
          <label className="block text-sm font-medium mb-1">
            Nhà cung cấp <span className="text-red-500">*</span>
          </label>

          <div className="flex">
            <input
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Chọn nhà cung cấp"
            />

            <button
  onClick={() => setOpenAddSupplier(true)}
  className="w-10 h-10 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center hover:bg-gray-50"
>
  <Plus size={16} />
</button>
          </div>
        </div>

        {/* Số phiếu */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            value="NK000001"
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
          />
        </div>

        {/* Diễn giải */}
        <div className="md:col-span-9">
          <label className="block text-sm font-medium mb-1">
            Diễn giải
          </label>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Nhập diễn giải"
          />
        </div>

        {/* Thời gian */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">
            Thời gian <span className="text-red-500">*</span>
          </label>

          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Ký hiệu hóa đơn */}
        <div className="md:col-span-5">
          <label className="block text-sm font-medium mb-1">
            Ký hiệu hóa đơn
          </label>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="VD: 1C24TYY"
          />
        </div>

        {/* Số hóa đơn */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium mb-1">
            Số hóa đơn
          </label>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Nhập số hóa đơn"
          />
        </div>

        {/* Người lập phiếu */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">
            Người lập phiếu
          </label>

          <input
            value="Admin"
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
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