import React from "react";
import SidebarFilter from "../../components/Products/SidebarFilter.jsx";
import TableProduct from "../../components/Products/TableProduct.jsx";

export default function Products() {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto flex gap-4">
        
        {/* SIDEBAR */}
        <div className="w-72">
          <SidebarFilter />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <TableProduct />
        </div>

      </div>
    </div>
  );
}