import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  
} from "lucide-react";
import toast from "react-hot-toast";

import { supplierApi } from "../../api";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import SuppliersSidebar from "../../components/Suppliers/SuppliersSidebar";
import SuppliersContent from "../../components/Suppliers/SuppliersContent";

export default function Suppliers() {
  const [status, setStatus] = useState("active");
  const [suppliers, setSuppliers] = useState([]);
const [openAddSupplier, setOpenAddSupplier] =
  useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!window.confirm(`Xoa nha cung cap "${supplier.name}"?`)) return;

    try {
      await supplierApi.delete(supplier.id);
      toast.success("Xoa nha cung cap thanh cong");
      loadSuppliers();
    } catch (err) {
      toast.error("Khong the xoa nha cung cap");
    }
  };

  // phân trang 
  const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;
const totalPages = Math.ceil(
  suppliers.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const currentSuppliers =
  suppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // end
  

  // menu slidebar
  const [showTimeFilter, setShowTimeFilter] = useState(false);

const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [showCustomDate, setShowCustomDate] = useState(false);



  

  return (
    <div className="w-full h-full bg-[#f3f5f7] p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-4 border-b border-gray-400">

          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
            Nhà cung cấp
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-1 lg:justify-end">

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
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
<button
  onClick={() => {
    setSelectedSupplier(null);
    setOpenAddSupplier(true);
  }}
  className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium cursor-pointer"
>
  <Plus size={18} />
  Nhà cung cấp
</button>

<button className="h-11 px-4 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
  <Upload size={18} />
  Import
</button>

<button className="h-11 px-4 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
  <Download size={18} />
  Xuất file
</button>

             
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 p-3 bg-[#f3f5f7]">

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
/>

{loading ? (
  <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[650px] flex items-center justify-center text-gray-500">
    Đang tải danh sách nhà cung cấp...
  </div>
) : error ? (
  <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[650px] flex items-center justify-center text-red-500">
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
  <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">

    <div className="h-full min-h-[650px] flex flex-col items-center justify-center">

      <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <span className="text-5xl">📦</span>
      </div>

      <h3 className="text-3xl font-semibold text-gray-900 mb-3">
        Chưa có nhà cung cấp nào
      </h3>

      <p className="text-gray-500 text-center max-w-md mb-6">
        Hệ thống sẽ giúp bạn quản lý và ghi nhớ thông tin
        nhà cung cấp một cách hiệu quả
      </p>

      <button
        onClick={() => {
          setSelectedSupplier(null);
          setOpenAddSupplier(true);
        }}
        className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 cursor-pointer "
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
