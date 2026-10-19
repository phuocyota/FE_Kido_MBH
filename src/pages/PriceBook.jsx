import PageHeader from "../components/Management/PageHeader";
import React, { useState } from "react";
import SidebarPrice from "../components/PriceBook/SidebarPrice";
import TablePrice from "../components/PriceBook/TablePrice";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown";

export default function PriceBook() {
  const [filters, setFilters] = useState({ search: "", categoryId: null });

  return (
    <div className="erp-page">
      <PageHeader
        title="Thiết lập giá"
        eyebrow="Hàng hóa / Giá"
        description="Theo dõi giá vốn và cập nhật giá bán cho hàng hóa."
      />
      <TablePrice
        filters={filters}
        setFilters={setFilters}
        filterControl={
          <ToolbarFilterDropdown>
            <SidebarPrice filters={filters} setFilters={setFilters} />
          </ToolbarFilterDropdown>
        }
      />
    </div>
  );
}
