import PageHeader from "../components/Management/PageHeader";
import React from "react";
import SidebarFilter from "../components/Products/SidebarFilter.jsx";
import TableProduct from "../components/Products/TableProduct.jsx";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown.jsx";

export default function Products() {
  const [categoryRevision, setCategoryRevision] = React.useState(0);
  const handleCategoriesChanged = () =>
    setCategoryRevision((value) => value + 1);
  const [filters, setFilters] = React.useState({
    search: "",
    categoryId: null,
    stockStatus: "all",
    displayStatus: "active",
  });

  return (
    <div className="erp-page">
      <PageHeader
        title="Danh mục hàng hóa"
        eyebrow="Hàng hóa / Danh mục"
        description="Quản lý thông tin, phân loại và tồn kho của hàng hóa."
      />
      <TableProduct
        categoryRevision={categoryRevision}
        filters={filters}
        setFilters={setFilters}
        filterControl={
          <ToolbarFilterDropdown>
            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
              onCategoriesChanged={handleCategoriesChanged}
            />
          </ToolbarFilterDropdown>
        }
      />
    </div>
  );
}
