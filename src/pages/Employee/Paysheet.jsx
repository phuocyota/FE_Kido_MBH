import React, { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import AddPaySheetModal from "../../components/Employee/AddPaySheetModal";
import ToolbarFilterDropdown from "../../components/layout/ToolbarFilterDropdown";
import { payrollApi } from "../../api";

const statusLabels = {
  DRAFT: "Đang tạo",
  ESTIMATED: "Tạm tính",
  FINALIZED: "Đã chốt lương",
  CANCELLED: "Đã hủy",
};

const statusOptions = [
  "Đang tạo",
  "Tạm tính",
  "Đã chốt lương",
  "Đã hủy",
];

const cycleLabels = {
  monthly: "Hàng tháng",
  custom: "Tùy chọn",
};

const formatMoney = (value) => Number(value || 0).toLocaleString("vi-VN");

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
  const [selectedStatus, setSelectedStatus] = useState([
    "Đang tạo",
    "Tạm tính",
    "Đã chốt lương",
  ]);
  const [cycleFilter, setCycleFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
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
    } catch {
      setPayrolls([]);
      setError("Không thể tải danh sách bảng lương");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const filteredPayrolls = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return payrolls.filter((item) => {
      const statusLabel = statusLabels[item.status] || item.status;
      const cycleLabel = cycleLabels[item.cycle] || item.cycle;
      const matchesStatus = selectedStatus.includes(statusLabel);
      const matchesCycle =
        cycleFilter === "all" ||
        cycleLabel === cycleFilter ||
        item.cycle === cycleFilter;
      const matchesSearch =
        !keyword ||
        [item.code, item.name, statusLabel, cycleLabel, item.periodStart, item.periodEnd]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesCycle && matchesSearch;
    });
  }, [cycleFilter, payrolls, searchKeyword, selectedStatus]);

  const toggleStatus = (status) => {
    setSelectedStatus((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status]
    );
  };

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
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold">Bảng lương</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-blue-500 px-4 text-blue-600"
          >
            <Plus size={16} />
            Bảng tính lương
          </button>

          <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-400 px-4 text-sm md:text-base">
            <Download size={16} />
            Xuất file
          </button>
        </div>
      </div>

      <div className="mb-3 grid gap-3 rounded-xl bg-white p-4 md:grid-cols-[auto_1fr] md:items-center">
        <ToolbarFilterDropdown panelClassName="sm:w-[520px]">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold">Kỳ hạn trả lương</h3>

              <select
                value={cycleFilter}
                onChange={(event) => setCycleFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 px-3"
              >
                <option value="all">Tất cả kỳ hạn</option>
                <option value="Hàng tháng">Hàng tháng</option>
                <option value="Tùy chọn">Tùy chọn</option>
              </select>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Trạng thái</h3>

              <div className="space-y-3">
                {statusOptions.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(item)}
                      onChange={() => toggleStatus(item)}
                      className="accent-blue-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ToolbarFilterDropdown>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="Theo mã, tên bảng lương"
            className="h-10 w-full rounded-lg border border-gray-400 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-[#eef5ff]">
              <tr>
                <th className="p-3">
                  <input type="checkbox" />
                </th>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Tên</th>
                <th className="p-3 text-left">Kỳ hạn trả</th>
                <th className="p-3 text-left">Kỳ làm việc</th>
                <th className="p-3 text-right">Tổng lương</th>
                <th className="p-3 text-right">Đã trả nhân viên</th>
                <th className="p-3 text-right">Còn cần trả</th>
                <th className="p-3 text-left">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    Đang tải danh sách bảng lương...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredPayrolls.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">{item.code}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{cycleLabels[item.cycle] || item.cycle}</td>
                    <td className="p-3">
                      {item.periodStart} - {item.periodEnd}
                    </td>
                    <td className="p-3 text-right">
                      {formatMoney(item.totalSalary)}
                    </td>
                    <td className="p-3 text-right">{formatMoney(item.paid)}</td>
                    <td className="p-3 text-right">
                      {formatMoney(item.remaining)}
                    </td>
                    <td className="p-3">{statusLabels[item.status] || item.status}</td>
                  </tr>
                ))}

              {!loading && !error && filteredPayrolls.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    Chưa có bảng lương nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <span>Hiển thị</span>

        <select className="rounded-lg border border-gray-300 px-3 py-1">
          <option>15 bản ghi</option>
          <option>25 bản ghi</option>
          <option>50 bản ghi</option>
        </select>
      </div>

      <AddPaySheetModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleSavePayroll}
      />
    </div>
  );
}
