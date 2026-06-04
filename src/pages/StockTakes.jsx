import React, { useState } from "react";
import SidebarFilterStock from "../components/StockTakes/SidebarFilterStock";
import TableStock from "../components/StockTakes/TableStock";
import { Filter } from "lucide-react";

export default function StockTakes() {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* MOBILE TOP BAR */}
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
          <SidebarFilterStock />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <TableStock />
        </div>

      </div>

      {/* MOBILE FILTER DRAWER */}
      {openFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="flex h-full">

            {/* SIDEBAR */}
            <div className="w-[85vw] max-w-[340px] bg-white h-full shadow-2xl overflow-visible">
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="font-semibold text-lg ">
                  Bộ lọc
                </div>

                <button
                  onClick={() => setOpenFilter(false)}
                  className="text-xl"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 h-[calc(100vh-70px)] overflow-y-auto">
  <SidebarFilterStock />
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