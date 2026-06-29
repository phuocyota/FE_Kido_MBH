 
import React, { useState } from "react";
import SidebarFilter from "../components/Products/SidebarFilter.jsx";
import TableProduct from "../components/Products/TableProduct.jsx";
import { Filter } from "lucide-react";

export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: null,
    stockStatus: "all",
    displayStatus: "active", // default to active as in the screenshot selection
  });

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* TOP BAR MOBILE */}
      <div className="lg:hidden p-4 pb-0">
        <button
          onClick={() => setOpenFilter(true)}
          className="
            flex items-center gap-2
            bg-white
            border
            border-gray-400
            px-4 py-2
            rounded-xl
            shadow-sm
          "
        >
          <Filter size={18} />
          Bộ lọc
        </button>
      </div>

      {/* CONTAINER */}
      <div className="max-w-[1800px] mx-auto p-4 flex gap-4">

        {/* SIDEBAR DESKTOP */}
        <div className="hidden lg:block w-72 shrink-0">
          <SidebarFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* CONTENT */}
        
        <div className="flex-1 min-w-0">
          <TableProduct filters={filters} />
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {openFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="flex h-full">

            {/* SIDEBAR */}
            <div
              className="
                w-[85vw]
                max-w-[340px]
                bg-white
                h-full
                shadow-2xl
                overflow-y-auto
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="font-semibold text-lg">
                  Bộ lọc
                </div>

                <button
                  onClick={() => setOpenFilter(false)}
                  className="text-xl cursor-pointer text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <SidebarFilter filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpenFilter(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}