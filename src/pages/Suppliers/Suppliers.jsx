import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Plus, Search, Upload, RefreshCw, Users, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import { supplierApi } from "../../api";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import SuppliersSidebar from "../../components/Suppliers/SuppliersSidebar";
import SuppliersContent from "../../components/Suppliers/SuppliersContent";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";

const ALL_GROUPS = "Tất cả các nhóm";

export default function Suppliers() {
  const [status, setStatus] = useState("active");
  const [suppliers, setSuppliers] = useState([]);
  const [openAddSupplier, setOpenAddSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS);
  const [purchaseFrom, setPurchaseFrom] = useState("");
  const [purchaseTo, setPurchaseTo] = useState("");
  const [debtFrom, setDebtFrom] = useState("");
  const [debtTo, setDebtTo] = useState("");

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

  const openCreateModal = () => {
    setSelectedSupplier(null);
    setOpenAddSupplier(true);
  };

  const handleDeleteSupplier = async (supplier) => {
    if (!window.confirm(`Xoá nhà cung cấp "${supplier.name}"?`)) return;

    try {
      await supplierApi.delete(supplier.id);
      toast.success("Xoá nhà cung cấp thành công");
      loadSuppliers();
    } catch {
      toast.error("Không thể xoá nhà cung cấp");
    }
  };

  const handleDeleteSuppliers = async (selectedSuppliers) => {
    if (selectedSuppliers.length === 0) return false;

    const message =
      selectedSuppliers.length === 1
        ? `Xoá nhà cung cấp "${selectedSuppliers[0].name}"?`
        : `Xoá ${selectedSuppliers.length} nhà cung cấp đã chọn?`;

    if (!window.confirm(message)) return false;

    try {
      await Promise.all(
        selectedSuppliers.map((supplier) => supplierApi.delete(supplier.id))
      );
      toast.success("Xoá nhà cung cấp thành công");
      loadSuppliers();
      return true;
    } catch {
      toast.error("Không thể xoá nhà cung cấp");
      return false;
    }
  };

  const groups = useMemo(
    () => [
      ALL_GROUPS,
      ...new Set(suppliers.map((supplier) => supplier.group).filter(Boolean)),
    ],
    [suppliers]
  );

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((supplier) => {
        if (selectedGroup !== ALL_GROUPS && supplier.group !== selectedGroup) {
          return false;
        }

        const purchaseVal = supplier.totalPurchase || 0;
        if (purchaseFrom !== "" && purchaseVal < Number(purchaseFrom)) {
          return false;
        }
        if (purchaseTo !== "" && purchaseVal > Number(purchaseTo)) {
          return false;
        }

        const debtVal = supplier.debt || 0;
        if (debtFrom !== "" && debtVal < Number(debtFrom)) {
          return false;
        }
        if (debtTo !== "" && debtVal > Number(debtTo)) {
          return false;
        }

        return true;
      }),
    [debtFrom, debtTo, purchaseFrom, purchaseTo, selectedGroup, suppliers]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGroup, purchaseFrom, purchaseTo, debtFrom, debtTo, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / itemsPerPage)
  );
  const currentSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalDebt = useMemo(() => {
    return filteredSuppliers.reduce((sum, s) => sum + Number(s.debt || 0), 0);
  }, [filteredSuppliers]);

  return (
    <div className="min-h-screen bg-gray-100 py-3 md:py-4">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Quản lý nhà cung cấp
          </h1>
          <button
            onClick={loadSuppliers}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition self-start lg:self-auto"
          >
            <RefreshCw size={14} />
            Dữ liệu mới
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                <Users size={28} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Tổng số nhà cung cấp</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  {filteredSuppliers.length} nhà cung cấp
                </h2>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                <Wallet size={28} className="text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Tổng nợ cần trả nhà cung cấp</p>
                <h2 className="text-2xl font-bold text-rose-600 mt-1">
                  {Number(totalDebt).toLocaleString("vi-VN")} ₫
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-300 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Theo mã, tên, số điện thoại..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-11 w-full sm:w-[280px] lg:w-[320px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

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
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    purchaseFrom={purchaseFrom}
                    setPurchaseFrom={setPurchaseFrom}
                    purchaseTo={purchaseTo}
                    setPurchaseTo={setPurchaseTo}
                    debtFrom={debtFrom}
                    setDebtFrom={setDebtFrom}
                    debtTo={debtTo}
                    setDebtTo={setDebtTo}
                    groups={groups}
                  />
                </ToolbarFilterDropdown>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={loadSuppliers}
                  className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
                  title="Tải lại"
                >
                  <RefreshCw size={17} className="text-gray-600" />
                </button>

                <button
                  className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
                  title="Import"
                >
                  <Upload size={17} className="text-indigo-600" />
                </button>

                <button
                  className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
                  title="Xuất file"
                >
                  <Download size={17} className="text-green-600" />
                </button>

                <button
                  onClick={openCreateModal}
                  className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition rounded-xl whitespace-nowrap shadow-sm"
                >
                  <Plus size={18} />
                  Nhà cung cấp
                </button>
              </div>
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center bg-white text-gray-500">
                Đang tải danh sách nhà cung cấp...
              </div>
            ) : error ? (
              <div className="flex min-h-[400px] items-center justify-center bg-white text-red-500">
                {error}
              </div>
            ) : suppliers.length === 0 ? (
              <div className="bg-white">
                <div className="flex min-h-[400px] flex-col items-center justify-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <Users size={36} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    Chưa có nhà cung cấp nào
                  </h3>
                  <p className="mb-4 max-w-sm text-center text-sm text-gray-500">
                    Hệ thống sẽ giúp bạn quản lý và ghi nhớ thông tin nhà cung cấp một cách hiệu quả
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-700 transition font-medium"
                  >
                    <Plus size={18} />
                    Thêm nhà cung cấp
                  </button>
                </div>
              </div>
            ) : (
              <SuppliersContent
                suppliers={filteredSuppliers}
                currentSuppliers={currentSuppliers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                onEdit={(supplier) => {
                  setSelectedSupplier(supplier);
                  setOpenAddSupplier(true);
                }}
                onDelete={handleDeleteSupplier}
                onBulkDelete={handleDeleteSuppliers}
              />
            )}
          </div>
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
