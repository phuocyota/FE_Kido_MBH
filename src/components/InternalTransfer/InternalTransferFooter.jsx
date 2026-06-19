import React from "react";
import { Paperclip } from "lucide-react";

export default function InternalTransferFooter() {
  return (
    <div className="bg-white border-t border-gray-300 px-6 py-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Paperclip size={16} />

          <span className="text-sm">
            File đính kèm
          </span>

          <input type="file" />
        </div>

         

      </div>

      <div className="flex justify-end gap-3 mt-4">

        <button className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Hủy
        </button>

        <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Lưu
        </button>

      </div>

    </div>
  );
}