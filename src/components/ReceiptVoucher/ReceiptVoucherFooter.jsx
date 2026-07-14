import React from "react";

export default function ReceiptVoucherFooter({ onCancel, onSave, onChangeFile, isSaving }) {
  return (
    <div className="border-t border-gray-300 bg-gray-50 px-4 py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <label className="text-sm">
            📎 File đính kèm
          </label>

          <input
            type="file"
            onChange={onChangeFile}
            className="block mt-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}