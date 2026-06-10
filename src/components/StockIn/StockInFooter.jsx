import React from "react";

export default function StockInFooter() {
  return (
    <div className="border-t border-gray-300 bg-gray-50 p-3 md:p-4">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* File đính kèm */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">
            File đính kèm
          </label>

          <input
            type="file"
            className="w-full md:w-auto text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

          <button className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
            Hủy
          </button>

          <button className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Lưu
          </button>

        </div>

      </div>

    </div>
  );
}