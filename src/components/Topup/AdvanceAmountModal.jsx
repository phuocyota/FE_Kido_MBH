import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AdvanceAmountModal({
  open,
  value,
  saving = false,
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState(value);

  useEffect(() => {
    setAmount(value);
  }, [value]);

  if (!open) return null;

  const quickAmounts = [
    0,
    10000,
    20000,
    50000,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold">
            Thiết lập giới hạn tổng nợ
          </h2>

          <button onClick={onClose} disabled={saving}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Giới hạn tổng nợ
            </label>

            <input
              type="number"
              min="0"
              max="50000"
              step="1"
              value={amount}
              disabled={saving}
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
                disabled={saving}
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
              Tổng nợ không được vượt quá giới hạn này, tối đa 50.000đ.
              Chọn 0đ để không cho mua nợ.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 rounded-xl border border-gray-300"
          >
            Hủy
          </button>

          <button
            onClick={() => onSave(amount)}
            disabled={saving || !Number.isFinite(amount) || amount < 0 || amount > 50000}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
