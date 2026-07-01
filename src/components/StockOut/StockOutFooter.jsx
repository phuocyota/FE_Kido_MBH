import React from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";

export default function StockOutFooter({ onSave, onCancel, loading }) {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block mb-2 font-medium">
          Địa điểm giao hàng
        </label>

        <select className="w-full lg:w-96 h-10 border border-gray-300 px-3 rounded-lg bg-white">
          <option>Chọn địa điểm</option>
          <option>Kho tổng</option>
          <option>Cửa hàng chính</option>
        </select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={18} />
          <span className="font-medium">
            Đính kèm
          </span>
          <span className="text-gray-500 text-sm">
            Dung lượng tối đa 5MB
          </span>
        </div>

        <div className="w-full lg:w-96 h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500">
          Kéo thả tệp hoặc bấm để tải lên
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-25">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel || (() => navigate("/stock-out"))}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="rounded-lg bg-cyan-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}