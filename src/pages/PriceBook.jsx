import React from "react";
import SidebarPrice from "../components/PriceBook/SidebarPrice";
import TablePrice from "../components/PriceBook/TablePrice";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown";

export default function PriceBook() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[1800px] p-4">
        <div className="mb-4 grid gap-3 border-b border-cyan-200 bg-slate-50 px-3 py-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <ToolbarFilterDropdown panelClassName="sm:w-[640px]">
            <SidebarPrice />
          </ToolbarFilterDropdown>

          <span className="text-sm font-medium text-slate-700 sm:px-3">
            Bảng giá chung
          </span>
        </div>

        <TablePrice />
      </div>
    </div>
  );
}
