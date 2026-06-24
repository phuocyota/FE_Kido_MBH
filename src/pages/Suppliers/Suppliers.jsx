import React, { useCallback, useEffect, useState } from "react";
import { Download, Package, Plus, Search, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { supplierApi } from "../../api";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import SuppliersSidebar from "../../components/Suppliers/SuppliersSidebar";
import SuppliersContent from "../../components/Suppliers/SuppliersContent";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

export default function Suppliers() {
  const [status, setStatus] = useState("active");
  const [suppliers, setSuppliers] = useState([]);
  const [openAddSupplier, setOpenAddSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [showCustomDate, setShowCustomDate] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = suppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await supplierApi.getAll(status, search);
      setSuppliers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch {
      setSuppliers([]);
      setError("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleDeleteSupplier = async (supplier) => {
    if (!window.confirm(`Xoa nha cung cap "${supplier.name}"?`)) return;

    try {
      await supplierApi.delete(supplier.id);
      toast.success("Xoa nha cung cap thanh cong");
      loadSuppliers();
    } catch {
      toast.error("Khong the xoa nha cung cap");
    }
  };

  const openCreateModal = () => {
    setSelectedSupplier(null);
    setOpenAddSupplier(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] p-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-400 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="whitespace-nowrap text-2xl font-bold text-gray-900">
              Nhà cung cấp
            </h1>

            <ToolbarFilterDropdown panelClassName="sm:w-[520px]">
              <SuppliersSidebar
                status={status}
                setStatus={setStatus}
                selectedTime={selectedTime}
                showTimeFilter={showTimeFilter}
                setShowTimeFilter={setShowTimeFilter}
                showCustomDate={showCustomDate}
                setShowCustomDate={setShowCustomDate}
                setSelectedTime={setSelectedTime}
              />
            </ToolbarFilterDropdown>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Theo mã, tên, số điện thoại"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </div>

            

            <button
              onClick={openCreateModal}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Nhà cung cấp
            </button>

            <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 hover:bg-gray-50">
              <Upload size={18} />
              Import
            </button>

            <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 hover:bg-gray-50">
              <Download size={18} />
              Xuất file
            </button>
          </div>
        </div>

        <div className="p-3">
          {loading ? (
            <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm">
              Đang tải danh sách nhà cung cấp...
            </div>
          ) : error ? (
            <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-gray-200 bg-white text-red-500 shadow-sm">
              {error}
            </div>
          ) : suppliers.length > 0 ? (
            <SuppliersContent
              suppliers={suppliers}
              currentSuppliers={currentSuppliers}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              onEdit={(supplier) => {
                setSelectedSupplier(supplier);
                setOpenAddSupplier(true);
              }}
              onDelete={handleDeleteSupplier}
            />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex min-h-[650px] flex-col items-center justify-center">
                <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <Package size={48} />
                </div>

                <h3 className="mb-3 text-3xl font-semibold text-gray-900">
                  Chưa có nhà cung cấp nào
                </h3>

                <p className="mb-6 max-w-md text-center text-gray-500">
                  Hệ thống sẽ giúp bạn quản lý và ghi nhớ thông tin nhà cung
                  cấp một cách hiệu quả
                </p>

                <button
                  onClick={openCreateModal}
                  className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Thêm nhà cung cấp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddSupplierModal
        open={openAddSupplier}
        onClose={() => {
          setOpenAddSupplier(false);
          setSelectedSupplier(null);
        }}
        onSaved={loadSuppliers}
        initialData={selectedSupplier}
      />
    </div>
  );
}
