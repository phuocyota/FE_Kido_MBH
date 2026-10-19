import React from "react";
import { useNavigate } from "react-router-dom";

export default function StockOutFooter({ onSave, onCancel, loading }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 border-t border-gray-300 bg-gray-50 p-3 md:p-4">
      <div>
        <label className="block mb-1 text-sm font-medium">
          Địa điểm giao hàng
        </label>

        <select className="w-full sm:w-96 h-10 border border-gray-300 px-3 rounded bg-white">
          <option>Chọn địa điểm</option>
          <option>Kho tổng</option>
          <option>Cửa hàng chính</option>
        </select>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-auto">
          <label className="mb-1 block text-sm font-medium">
            File đính kèm
          </label>
          <input type="file" className="w-full text-sm md:w-auto" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <button
            type="button"
            onClick={onCancel || (() => navigate("/stock-out"))}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
