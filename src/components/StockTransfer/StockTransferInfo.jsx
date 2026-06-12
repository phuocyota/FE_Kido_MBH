import React, { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import SelectCustomer from "./SelectCustomer";

export default function StockTransferInfo() {

 const [transferDate, setTransferDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">

        <div className="xl:col-span-6">
  <label className="block mb-1 text-sm font-medium">
    Đối tượng <span className="text-red-500">*</span>
  </label>

  <SelectCustomer />
</div>

        <div className="xl:col-span-3">
          <label className="block mb-1 text-sm font-medium">
            Người lập phiếu
          </label>

          <input
            readOnly
            value="Nguyễn Hữu Phước"
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="xl:col-span-3">
          <label className="block mb-1 text-sm font-medium">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            readOnly
            value="CK000001"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="xl:col-span-9">
          <label className="block mb-1 text-sm font-medium">
            Diễn giải
          </label>

          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="xl:col-span-3">
  <label className="block mb-1 text-sm font-medium">
    Thời gian
  </label>

  <div className="relative">

    <input
      type="datetime-local"
      value={transferDate}
      onChange={(e) => setTransferDate(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
    />

  </div>
</div>

      </div>
    </div>
  );
}