import React from "react";
import SidebarFilter from "../components/Products/SidebarFilter.jsx";
import TableProduct from "../components/Products/TableProduct.jsx";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown.jsx";

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[1800px] p-4">
        <div className="mb-4 grid gap-3 border-b border-cyan-200 bg-slate-50 px-3 py-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
            <SidebarFilter />
          </ToolbarFilterDropdown>

          <span className="text-sm font-medium text-slate-700 sm:px-3">
            Hàng đang kinh doanh
          </span>
        </div>

        <TableProduct />
      </div>
    </div>
  );
}
