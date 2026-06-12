import React from "react";
import { Paperclip } from "lucide-react";

export default function StockTransferFooter() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg">

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between p-4 border-b border-gray-300">

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Paperclip size={16} />
            <span>File đính kèm</span>
          </div>

          <input type="file" />
        </div>

        <div className="text-lg sm:text-xl font-bold self-end">
          TỔNG TIỀN: 0
        </div>

      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end p-4">

        <button className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Hủy
        </button>

        <button className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Lưu
        </button>

      </div>

    </div>
  );
}