import React from "react";
import SidebarFilter from "../components/Products/SidebarFilter.jsx";
import TableProduct from "../components/Products/TableProduct.jsx";
import ToolbarFilterDropdown from "../components/layout/ToolbarFilterDropdown.jsx";

export default function Products() {
  const [categoryRevision, setCategoryRevision] = React.useState(0);
  const handleCategoriesChanged = () => setCategoryRevision(value => value + 1);
  const [isWideView, setIsWideView] = React.useState(false);
  const [filters, setFilters] = React.useState({
    search: "",
    categoryId: null,
    stockStatus: "all",
    displayStatus: "active",
  });

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <div
        className={`mx-auto w-full px-3 py-4 sm:px-4 lg:px-5 ${
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
              Danh mục hàng hóa
            </h1>
            <SidebarFilter filters={filters} setFilters={setFilters} onCategoriesChanged={handleCategoriesChanged} />
            </aside>
          )}

          <main className="min-w-0">
            <TableProduct
              categoryRevision={categoryRevision}
              filters={filters}
              setFilters={setFilters}
              isWideView={isWideView}
              onToggleWideView={() => setIsWideView((current) => !current)}
              filterControl={
                isWideView ? (
                  <ToolbarFilterDropdown panelClassName="sm:w-[720px]">
                    <SidebarFilter filters={filters} setFilters={setFilters} onCategoriesChanged={handleCategoriesChanged} />
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
