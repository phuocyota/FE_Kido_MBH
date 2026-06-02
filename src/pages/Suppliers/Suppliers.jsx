import React, { useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  Calendar,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";

import suppliersData from "../../datas/suppliersData";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import SuppliersSidebar from "../../components/Suppliers/SuppliersSidebar";
import SuppliersContent from "../../components/Suppliers/SuppliersContent";

export default function Suppliers() {
  const [status, setStatus] = useState("active");
  const [suppliers, setSuppliers] = useState(suppliersData);
const [openAddSupplier, setOpenAddSupplier] =
  useState(false);

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

          <div className="flex items-center gap-3 flex-1 justify-end">

            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Theo mã, tên, số điện thoại"
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
  onClick={() => setOpenAddSupplier(true)}
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

            {/* <button className="h-11 w-11 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
              <LayoutGrid size={18} />
            </button>

            <button className="h-11 w-11 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
              <HelpCircle size={18} />
            </button> */}
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

{suppliers.length > 0 ? (
  <SuppliersContent
    suppliers={suppliers}
    currentSuppliers={currentSuppliers}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    totalPages={totalPages}
    startIndex={startIndex}
    itemsPerPage={itemsPerPage}
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
        onClick={() => setOpenAddSupplier(true)}
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
  onClose={() =>
    setOpenAddSupplier(false)
  }
/>
    </div>
  );
}
 