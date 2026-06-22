import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Settings,
  X,
  HelpCircle,
} from "lucide-react";

export default function StockOutHeader({
  onBack,
}) {

        const navigate = useNavigate();

  return (
    <div className="bg-cyan-50 border-b border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
  onClick={() => navigate("/stock-out")}
  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700"
>
  <ArrowLeft size={18} />
  <span>Quay lại</span>
</button>

          <h1 className="text-3xl font-bold text-gray-800">
            Phiếu xuất kho XK00362
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white hover:bg-gray-50">
            <HelpCircle size={16} />
            Hướng dẫn sử dụng
          </button>

          <button>
            <Settings size={20} />
          </button>

          <button>
            <X size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}