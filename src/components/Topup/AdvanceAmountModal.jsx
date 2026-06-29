import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AdvanceAmountModal({
  open,
  value,
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState(value);

  useEffect(() => {
    setAmount(value);
  }, [value]);

  if (!open) return null;

  const quickAmounts = [
    50000,
    100000,
    200000,
    300000,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold">
            Thiết lập số tiền ứng trước
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Số tiền ứng trước
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((item) => (
              <button
                key={item}
                onClick={() => setAmount(item)}
                className={`py-3 rounded-xl border transition ${
                  amount === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {item.toLocaleString()}đ
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-gray-600">
              Khi số dư nhỏ hơn mức này, phụ huynh sẽ
              nhận được thông báo để nạp thêm tiền.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-300"
          >
            Hủy
          </button>

          <button
            onClick={() => {
              onSave(amount);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}