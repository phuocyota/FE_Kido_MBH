import React from "react";
import SidebarFilterStock from "../../components/StockTakes/SidebarFilterStock";
import TableStock from "../../components/StockTakes/TableStock";

export default function StockTakes() {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
              
              {/* CONTAINER */}
              <div className="max-w-7xl mx-auto flex gap-4">
                
                {/* SIDEBAR */}
                <div className="w-72">
                  <SidebarFilterStock />
                </div>
        
                {/* CONTENT */}
                <div className="flex-1">
                  <TableStock />
                </div>
        
              </div>
            </div>
  );
}