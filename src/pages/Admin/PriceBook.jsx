import React from "react";
import SidebarPrice from "../../components/PriceBook/SidebarPrice";
import TablePrice from "../../components/PriceBook/TablePrice";

export default function PriceBook() {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
          
          {/* CONTAINER */}
          <div className="max-w-7xl mx-auto flex gap-4">
            
            {/* SIDEBAR */}
            <div className="w-72">
              <SidebarPrice />
            </div>
    
            {/* CONTENT */}
            <div className="flex-1">
              <TablePrice />
            </div>
    
          </div>
        </div>
  );
}