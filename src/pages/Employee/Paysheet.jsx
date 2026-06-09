import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  List,
} from "lucide-react";
import AddPaySheetModal from "../../components/Employee/AddPaySheetModal";
import { payrollApi } from "../../api";

const statusLabels = {
  DRAFT: "Đang tạo",
  ESTIMATED: "Tạm tính",
  FINALIZED: "Đã chốt lương",
  CANCELLED: "Đã hủy",
};

const cycleLabels = {
  monthly: "Hàng tháng",
  custom: "Tùy chọn",
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN");

const toDateString = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const getPayrollPeriod = (workPeriod) => {
  if (typeof workPeriod === "string") {
    const [periodStart, periodEnd] = workPeriod.split(" - ");
    return { periodStart, periodEnd };
  }

  return {
    periodStart: toDateString(workPeriod?.fromDate),
    periodEnd: toDateString(workPeriod?.toDate),
  };
};

export default function PaySheet() {
  const [selectedStatus, setSelectedStatus] =
    useState([
      "Đang tạo",
      "Tạm tính",
      "Đã chốt lương",
    ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await payrollApi.getAll();
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (err) {
      setPayrolls([]);
      setError("Không thể tải danh sách bảng lương");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const handleSavePayroll = async (data) => {
    const { periodStart, periodEnd } = getPayrollPeriod(data.workPeriod);

    await payrollApi.create({
      name: `Bảng lương ${periodStart} - ${periodEnd}`,
      cycle: data.salaryCycle === "Hàng tháng" ? "monthly" : "custom",
      periodStart,
      periodEnd,
      status: "DRAFT",
    });

    setOpenAddModal(false);
    loadPayrolls();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-3 sm:p-4 md:p-5">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

        <h1 className="text-3xl font-bold">
          Bảng lương
        </h1>

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={() =>
              setOpenAddModal(true)
            }
            className="h-10 px-4 border border-blue-500 text-blue-600 rounded-lg flex items-center gap-2 cursor-pointer "
          >
            <Plus size={16} />
            Bảng tính lương
          </button>

          <button className="h-10 px-4 border border-gray-400 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer " >
            <Download size={16} />
            Xuất file
          </button>

          {/* <button className="w-10 h-10 border rounded-lg flex items-center justify-center">
            <List size={18} />
          </button> */}

        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4">

        {/* Sidebar */}

        <div className="bg-white rounded-xl p-4 md:p-5">

          <h3 className="font-semibold mb-4">
            Kỳ hạn trả lương
          </h3>

          <select className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-6">
            <option>
              Chọn kỳ hạn trả lương
            </option>
            <option>
              Hàng tháng
            </option>
            <option>
              Tùy chọn
            </option>
          </select>

          <h3 className="font-semibold mb-4">
            Trạng thái
          </h3>

          <div className="space-y-3">

            {[
              "Đang tạo",
              "Tạm tính",
              "Đã chốt lương",
              "Đã hủy",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  defaultChecked={
                    item !== "Đã hủy"
                  }
                />
                {item}
              </label>
            ))}

          </div>

        </div>

        {/* Content */}

        <div>

          <div className="bg-white rounded-xl p-4 mb-3">

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  placeholder="Theo mã, tên bảng lương"
                  className="w-full h-10 border border-gray-400 rounded-lg pl-10 pr-4"
                />

              </div>

              {/* <button className="w-10 h-10 border rounded-lg flex items-center justify-center">
                <Filter size={18} />
              </button> */}

            </div>

          </div>

          <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead className="bg-[#eef5ff]">

                  <tr>

                    <th className="p-3">
                      <input type="checkbox" />
                    </th>

                    <th className="text-left p-3">
                      Mã
                    </th>

                    <th className="text-left p-3">
                      Tên
                    </th>

                    <th className="text-left p-3">
                      Kỳ hạn trả
                    </th>

                    <th className="text-left p-3">
                      Kỳ làm việc
                    </th>

                    <th className="text-right p-3">
                      Tổng lương
                    </th>

                    <th className="text-right p-3">
                      Đã trả nhân viên
                    </th>

                    <th className="text-right p-3">
                      Còn cần trả
                    </th>

                    <th className="text-left p-3">
                      Trạng thái
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading && (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center p-6 text-gray-500"
                      >
                        Đang tải danh sách bảng lương...
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center p-6 text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && payrolls.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t"
                    >
                      <td className="p-3">
                        <input type="checkbox" />
                      </td>

                      <td className="p-3">
                        {item.code}
                      </td>

                      <td className="p-3">
                        {item.name}
                      </td>

                      <td className="p-3">
                        {cycleLabels[item.cycle] || item.cycle}
                      </td>

                      <td className="p-3">
                        {item.periodStart} - {item.periodEnd}
                      </td>

                      <td className="text-right p-3">
                        {formatMoney(item.totalSalary)}
                      </td>

                      <td className="text-right p-3">
                        {formatMoney(item.paid)}
                      </td>

                      <td className="text-right p-3">
                        {formatMoney(item.remaining)}
                      </td>

                      <td className="p-3">
                        {statusLabels[item.status] || item.status}
                      </td>

                    </tr>
                  ))}

                  {!loading && !error && payrolls.length === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center p-6 text-gray-500"
                      >
                        Chưa có bảng lương nào
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">

            <span>Hiển thị</span>

            <select className="border border-gray-300 rounded-lg px-3 py-1">
              <option>15 bản ghi</option>
              <option>25 bản ghi</option>
              <option>50 bản ghi</option>
            </select>

          </div>

        </div>

      </div>


      <AddPaySheetModal
  open={openAddModal}
  onClose={() =>
    setOpenAddModal(false)
  }
  onSave={handleSavePayroll}
/>

    </div>
  );
}