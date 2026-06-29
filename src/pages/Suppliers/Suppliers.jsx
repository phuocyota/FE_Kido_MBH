import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  SlidersHorizontal,
  List,
  Settings,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";


import { supplierApi } from "../../api";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import SuppliersSidebar from "../../components/Suppliers/SuppliersSidebar";
import SuppliersContent from "../../components/Suppliers/SuppliersContent";

export default function Suppliers() {
  const [status, setStatus] = useState("active");
  const [suppliers, setSuppliers] = useState([]);
  const [openAddSupplier, setOpenAddSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States for new filters
  const [selectedGroup, setSelectedGroup] = useState("Tất cả các nhóm");
  const [purchaseFrom, setPurchaseFrom] = useState("");
  const [purchaseTo, setPurchaseTo] = useState("");
  const [debtFrom, setDebtFrom] = useState("");
  const [debtTo, setDebtTo] = useState("");

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await supplierApi.getAll(status, search);
      setSuppliers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setSuppliers([]);
      setError("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [status, search]);

  const handleDeleteSupplier = async (supplier) => {
    if (!window.confirm(`Xoá nhà cung cấp "${supplier.name}"?`)) return;

    try {
      await supplierApi.delete(supplier.id);
      toast.success("Xoá nhà cung cấp thành công");
      loadSuppliers();
    } catch (err) {
      toast.error("Không thể xoá nhà cung cấp");
    }
  };

  // Get unique supplier groups dynamically
  const groups = [
    "Tất cả các nhóm",
    ...new Set(suppliers.map((s) => s.group).filter(Boolean)),
  ];

  // Client-side filtering
  const filteredSuppliers = suppliers.filter((supplier) => {
    // 1. Nhóm NCC
    if (
      selectedGroup !== "Tất cả các nhóm" &&
      supplier.group !== selectedGroup
    ) {
      return false;
    }

    // 2. Tổng mua
    const purchaseVal = supplier.totalPurchase || 0;
    if (purchaseFrom !== "" && purchaseVal < Number(purchaseFrom)) {
      return false;
    }
    if (purchaseTo !== "" && purchaseVal > Number(purchaseTo)) {
      return false;
    }

    // 3. Nợ hiện tại
    const debtVal = supplier.debt || 0;
    if (debtFrom !== "" && debtVal < Number(debtFrom)) {
      return false;
    }
    if (debtTo !== "" && debtVal > Number(debtTo)) {
      return false;
    }

    return true;
  });

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when client-side filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGroup, purchaseFrom, purchaseTo, debtFrom, debtTo]);

  // Menu sidebar
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [showCustomDate, setShowCustomDate] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#f4f6f8] p-4 flex flex-col lg:flex-row gap-4">
      {/* SIDEBAR */}
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

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col gap-4">
        {/* TOOLBAR */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[400px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Theo mã, tên, số điện thoại"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <SlidersHorizontal
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedSupplier(null);
                setOpenAddSupplier(true);
              }}
              className="h-10 px-4 border border-[#0f62fe] text-[#0f62fe] bg-white hover:bg-blue-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              Nhà cung cấp
            </button>

            <button className="h-10 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap">
              <Upload size={16} className="text-gray-500" />
              Import file
            </button>

            <button className="h-10 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap">
              <Download size={16} className="text-gray-500" />
              Xuất file
            </button>

            <div className="h-5 w-[1px] bg-gray-300 mx-1 hidden sm:block" />

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <List size={18} />
            </button>

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <Settings size={18} />
            </button>

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
        {/* TABLE DATA */}
        {loading ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px] flex items-center justify-center text-gray-500">
            Đang tải danh sách nhà cung cấp...
          </div>
        ) : error ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px] flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (status === "active" && !search && suppliers.length === 0) ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-6">
              <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <span className="text-5xl">📦</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                Chưa có nhà cung cấp nào
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Hệ thống sẽ giúp bạn quản lý và ghi nhớ thông tin nhà cung cấp một cách hiệu quả
              </p>
              <button
                onClick={() => {
                  setSelectedSupplier(null);
                  setOpenAddSupplier(true);
                }}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 cursor-pointer font-medium"
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
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            onEdit={(supplier) => {
              setSelectedSupplier(supplier);
              setOpenAddSupplier(true);
            }}
            onDelete={handleDeleteSupplier}
          />
        )}
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
