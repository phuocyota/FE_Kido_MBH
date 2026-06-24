import React from "react";
import SidebarFilterStock from "../../components/StockTakes/SidebarFilterStock";
import TableStock from "../../components/StockTakes/TableStock";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

export default function StockTakes() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[1800px] p-4">
        <div className="mb-4 grid gap-3 border-b border-cyan-200 bg-slate-50 px-3 py-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
            <SidebarFilterStock />
          </ToolbarFilterDropdown>

          <span className="text-sm font-medium text-slate-700 sm:px-3">
            Tháng này
          </span>
        </div>

        <TableStock />
      </div>
    </div>
  );
}
