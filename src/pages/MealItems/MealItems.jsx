import React, { useState } from "react";
import TableMealItem from "../../components/MealItems/TableMealItem";
import { Plus } from "lucide-react";

export default function MealItems() {
  const [filters, setFilters] = useState({
    mealPeriod: "", // All
    status: "",
  });

  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-[1800px]">
        {/* HEADER & FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <h1 className="text-xl font-semibold text-gray-800">Thiết lập món ăn theo buổi</h1>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 w-full sm:w-auto"
                value={filters.mealPeriod}
                onChange={(e) => handleFilterChange("mealPeriod", e.target.value)}
              >
                <option value="">-- Tất cả các buổi --</option>
                <option value="BREAKFAST">Sáng</option>
                <option value="LUNCH">Trưa</option>
                <option value="AFTERNOON">Chiều</option>
                <option value="DINNER">Tối</option>
              </select>

              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 w-full sm:w-auto"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">-- Tất cả trạng thái --</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            Thêm món
          </button>
        </div>

        {/* TABLE COMPONENT */}
        <TableMealItem 
          filters={filters} 
          triggerRefresh={triggerRefresh}
          onRefresh={() => setTriggerRefresh(prev => prev + 1)}
          openAddModal={openModal}
          setOpenAddModal={setOpenModal}
        />
      </div>
    </div>
  );
}
