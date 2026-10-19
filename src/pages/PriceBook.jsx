import React, { useState } from "react";
import SidebarPrice from "../components/PriceBook/SidebarPrice";
import TablePrice from "../components/PriceBook/TablePrice";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown";

export default function PriceBook() {
  const [filters, setFilters] = useState({ search: "", categoryId: null });
  const [isWideView, setIsWideView] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <div
        className={`mx-auto w-full space-y-4 px-3 py-4 sm:px-4 lg:px-5 ${
          isWideView ? "max-w-none" : "max-w-[1600px]"
        }`}
      >
        <div
          className={`grid grid-cols-1 gap-4 ${
            isWideView ? "" : "xl:grid-cols-[320px_minmax(0,1fr)]"
          }`}
        >
          {!isWideView && (
            <aside className="min-w-0">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 lg:text-3xl">
              Thiết lập giá
            </h1>
            <SidebarPrice filters={filters} setFilters={setFilters} />
            </aside>
          )}

          <main className="min-w-0">
            <TablePrice
              filters={filters}
              setFilters={setFilters}
              isWideView={isWideView}
              onToggleWideView={() => setIsWideView((current) => !current)}
              filterControl={
                isWideView ? (
                  <ToolbarFilterDropdown panelClassName="sm:w-[640px]">
                    <SidebarPrice filters={filters} setFilters={setFilters} />
                  </ToolbarFilterDropdown>
                ) : null
              }
            />
          </main>
        </div>
      </div>
    </div>
  );
}
