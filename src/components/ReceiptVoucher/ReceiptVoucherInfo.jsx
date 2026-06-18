import React, { useState } from "react";
import { Plus } from "lucide-react";
import receiptSourceData from "../../datas/receiptSourceData";
import AddSupplierModal from "../Suppliers/AddSupplierModal";

export default function ReceiptVoucherInfo() {

const [openSupplierModal, setOpenSupplierModal] = useState(false);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="xl:col-span-9 space-y-4">
        {/* Phương thức TT */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Phương thức TT <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                defaultChecked
                name="payment"
              />
              Tiền mặt
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
              />
              Tiền gửi
            </label>
          </div>
        </div>

        {/* Thu từ */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Thu từ
          </label>

          <div className="flex">
            <select className="flex-1 h-10 border border-gray-300 rounded-l-lg px-3">
  <option value="">
    Chọn đối tượng thu
  </option>

  {receiptSourceData.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.name} - {item.type}
    </option>
  ))}
</select>

            <button
  onClick={() => setOpenSupplierModal(true)}
  className="w-10 border border-l-0 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-green-50"
>
  <Plus size={16} />
</button>
          </div>
        </div>

        {/* Diễn giải */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Diễn giải
          </label>

          <input
            type="text"
            className="w-full h-10 border border-gray-300 rounded-lg px-3"
          />
        </div>

        {/* Tham chiếu */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium">
            Tham chiếu
          </label>

          <input
            type="text"
            className="w-full h-10 border border-gray-300 rounded-lg px-3"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="xl:col-span-3 space-y-4">
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            value="PT000003"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Thời gian <span className="text-red-500">*</span>
          </label>

          <input
            value="16/06/2026 13:23:03"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <label className="text-sm font-medium">
            Người lập phiếu
          </label>

          <input
            value="Nguyễn Hữu Phước"
            readOnly
            className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-50"
          />
        </div>
      </div>

      <AddSupplierModal
  open={openSupplierModal}
  onClose={() => setOpenSupplierModal(false)}
/>
    </div>
  );
}