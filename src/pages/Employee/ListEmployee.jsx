import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  UserCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { employeeApi } from "../../api";
import AddEmployeeModal from "../../components/Employee/AddEmployeeModal";
import EmployeeDetail from "../../components/Employee/EmployeeDetail";

export default function ListEmployee() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [modalTab, setModalTab] = useState("info");
  const [isEdit, setIsEdit] = useState(false);
  
  // API data state
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees on mount and when status changes
  useEffect(() => {
    fetchEmployees();
  }, [status]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const statusParam = status === "all" ? undefined : status;
      const data = await employeeApi.getAll(statusParam);
      // Map BE fields to FE fields
      const mappedData = data.map(emp => ({
        ...emp,
        name: emp.fullName, // Map fullName to name for FE compatibility
      }));
      setEmployees(mappedData);
    } catch (error) {
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmployee = (item) => {

  if (selectedEmployeeId === item.id) {
    setSelectedEmployeeId(null);
    setSelectedEmployee(null);
  } else {
    setSelectedEmployeeId(item.id);
    setSelectedEmployee(item);
  }

};

  const handleDeleteEmployee = async (employee) => {
    if (!window.confirm(`Xoa nhan vien "${employee.name || employee.fullName}"?`)) {
      return;
    }

    try {
      await employeeApi.delete(employee.id);
      toast.success("Xoa nhan vien thanh cong");
      setSelectedEmployeeId(null);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast.error("Khong the xoa nhan vien");
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!employees.length) return [];
    
    return employees.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.name?.toLowerCase().includes(keyword) ||
        item.code?.toLowerCase().includes(keyword);

      return matchSearch;
    });
  }, [search, employees]);

  return (
    <div className="w-full min-h-screen bg-[#f5f6f8] p-3 md:p-5">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* HEADER */}
        <div className="p-3 md:p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            {/* SEARCH */}
            <div className="relative w-full sm:w-[320px] md:w-[420px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Tìm theo mã, tên nhân viên"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[42px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-[42px] min-w-[180px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white"
            >
              <option value="all">
                Tất cả trạng thái
              </option>

              <option value="working">
                Đang làm việc
              </option>

              <option value="quit">
                Đã nghỉ
              </option>
            </select>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center gap-2">

            <button
            onClick={() => {
  setIsEdit(false);
  setModalTab("info");
  setOpenAddModal(true);
}}
            className="h-[42px] px-4 rounded-xl border border-blue-600 text-blue-600 font-medium text-sm flex items-center gap-2 hover:bg-blue-50 cursor-pointer"
            >
            <Plus size={18} />
            Thêm Nhân viên
            </button>

            {/* <button className="h-[42px] px-4 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50">
              Duyệt yêu cầu
            </button>

            <button className="w-[42px] h-[42px] rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <MoreHorizontal size={18} />
            </button>

            <button className="w-[42px] h-[42px] rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <LayoutGrid size={18} />
            </button> */}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse">

            <thead>
              <tr className="bg-[#eaf2ff] text-gray-700 text-sm">

                <th className="w-[50px] px-3 py-3 border-b border-gray-200">
                  <input type="checkbox" />
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Mã nhân viên
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Mã chấm công
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Tên nhân viên
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Số điện thoại
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Số CMND/CCCD
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Nợ và tạm ứng
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Ghi chú
                </th>

                <th className="text-left px-4 py-3 border-b border-gray-200">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
  {loading ? (
    <tr>
      <td colSpan={9} className="text-center py-14 text-gray-400">
        Đang tải dữ liệu...
      </td>
    </tr>
  ) : filteredEmployees.length > 0 ? (
    filteredEmployees.map((item) => (
      <React.Fragment key={item.id}>

        <tr
          onClick={() => handleToggleEmployee(item)}
          className={`bg-white hover:bg-gray-50 text-sm border-b border-gray-100 cursor-pointer ${selectedEmployeeId === item.id ? "border-blue-500" : ""}`}
        >

          <td className="px-3 py-4 text-center">
            <input type="checkbox" />
          </td>

          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <UserCircle2 size={28} className="text-blue-500" />

              <span className="font-medium">
                {item.code}
              </span>
            </div>
          </td>

          <td className="px-4 py-4">
            {item.timekeepingCode}
          </td>

          <td className="px-4 py-4">
            {item.name}
          </td>

          <td className="px-4 py-4">
            {item.phone}
          </td>

          <td className="px-4 py-4">
            {item.cccd}
          </td>

          <td className="px-4 py-4">
            {item.debt.toLocaleString()}
          </td>

          <td className="px-4 py-4">
            {item.note || "-"}
          </td>

          <td className="px-4 py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "working" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {item.status === "working"
                ? "Đang làm việc"
                : "Đã nghỉ"}
            </span>
          </td>
        </tr>

        {selectedEmployeeId === item.id && (
          <tr>
            <td colSpan={9} className="p-0 border-b border-blue-500">
              <EmployeeDetail
  employee={item}
  onUpdate={(tab) => {
    setIsEdit(true);
    setModalTab(tab);
    setOpenAddModal(true);
  }}
  onDelete={handleDeleteEmployee}
/>
            </td>
          </tr>
        )}

      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan={9} className="text-center py-14 text-gray-400">
        Không có dữ liệu nhân viên
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
{/* 
      {
  selectedEmployee && (
    <EmployeeDetail
      employee={selectedEmployee}
      onUpdate={() => setOpenAddModal(true)}
    />
  )
} */}
      </div>
     <AddEmployeeModal
  open={openAddModal}
  onClose={() => setOpenAddModal(false)}
  defaultTab={modalTab}
  isEdit={isEdit}
  employee={isEdit ? selectedEmployee : null}
  onSuccess={() => {
    fetchEmployees();
    setOpenAddModal(false);
  }}
/>
    </div>
  );
}
