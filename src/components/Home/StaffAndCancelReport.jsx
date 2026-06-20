import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronDown, Info } from "lucide-react";
import { dashboardApi } from "../../api/dashboardApi";

const filterOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "Hôm qua", value: "yesterday" },
  { label: "7 ngày qua", value: "7days" },
  { label: "Tháng này", value: "thisMonth" },
  { label: "Tháng trước", value: "lastMonth" },
];

const stageFallbacks = {
  afterKitchen: { name: "Hủy sau báo bếp", color: "bg-red-500" },
  afterCheckout: { name: "Hủy sau tạm tính", color: "bg-orange-500" },
  afterInspection: { name: "Hủy khi kiểm đồ", color: "bg-yellow-400" },
};

const getStage = (stages, key) => {
  const fallback = stageFallbacks[key];
  return stages.find((stage) => stage.key === key) || {
    key,
    name: fallback.name,
    itemCount: 0,
    percentage: 0,
  };
};

export default function StaffAndCancelReport() {
  const [filter, setFilter] = useState("7 ngày qua");
  const [open, setOpen] = useState(false);
  const [cancellations, setCancellations] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [employeeStats, setEmployeeStats] = useState({
    working: 0,
    absent: 0,
    pendingRequests: 0,
    late: 0,
    earlyLeave: 0,
    overtime: 0,
  });
  const [topStaffs, setTopStaffs] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  const filterValue = useMemo(
    () => filterOptions.find((item) => item.label === filter)?.value || "7days",
    [filter]
  );

  useEffect(() => {
    let active = true;

    const fetchCancellations = async () => {
      try {
        setCancelLoading(true);
        setCancelError("");
        const data = await dashboardApi.getCancellations({ filter: filterValue });
        if (active) setCancellations(data);
      } catch (err) {
        if (active) {
          setCancelError(err?.response?.data?.message || "Không thể tải dữ liệu hủy món");
          setCancellations(null);
        }
      } finally {
        if (active) setCancelLoading(false);
      }
    };

    const fetchEmployeeStats = async () => {
      try {
        setEmpLoading(true);
        const data = await dashboardApi.getEmployeeAttendance(filterValue);
        if (active) {
          setEmployeeStats({
            working: data?.summary?.working || 0,
            absent: data?.summary?.absent || 0,
            pendingRequests: data?.summary?.pendingRequests || 0,
            late: data?.summary?.late || 0,
            earlyLeave: data?.summary?.earlyLeave || 0,
            overtime: data?.summary?.overtime || 0,
          });
          setTopStaffs(Array.isArray(data?.topStaffs) ? data.topStaffs : []);
        }
      } catch {
        if (active) {
          setEmployeeStats({ working: 0, absent: 0, pendingRequests: 0, late: 0, earlyLeave: 0, overtime: 0 });
          setTopStaffs([]);
        }
      } finally {
        if (active) setEmpLoading(false);
      }
    };

    fetchCancellations();
    fetchEmployeeStats();

    return () => {
      active = false;
    };
  }, [filterValue]);

  const cancelSummary = cancellations?.summary || {};
  const cancelStages = cancellations?.stages || [];
  const stages = [
    getStage(cancelStages, "afterKitchen"),
    getStage(cancelStages, "afterCheckout"),
    getStage(cancelStages, "afterInspection"),
  ];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">Tình trạng hủy món</h2>
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="h-11 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-[15px] font-medium text-gray-700 min-w-[150px] justify-between"
              >
                {filter}
                <ChevronDown size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-[180px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
                  {filterOptions.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setFilter(item.label);
                        setOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition ${
                        filter === item.label ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-10 mb-6">
            <div>
              <div className="text-gray-700 font-medium mb-1">Món bị hủy</div>
              <div className="text-[36px] font-bold text-black">
                {cancelLoading ? "..." : cancelSummary.cancelledItems || 0}
              </div>
            </div>
            <div>
              <div className="text-gray-700 font-medium mb-1">Hóa đơn bị hủy</div>
              <div className="text-[36px] font-bold text-black">
                {cancelLoading ? "..." : cancelSummary.cancelledInvoices || 0}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const color = stageFallbacks[stage.key]?.color || "bg-blue-500";
              return (
                <div key={stage.key} className="border border-gray-200 rounded-3xl overflow-hidden">
                  <div className="w-full px-4 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="font-medium text-gray-800">{stage.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full ${color}`} style={{ width: `${stage.percentage || 0}%` }} />
                      </div>
                    </div>
                    <span className="font-semibold text-black">{stage.itemCount || 0} Món</span>
                  </div>
                </div>
              );
            })}
          </div>

          {(cancelError || (!cancelLoading && (cancelSummary.cancelledItems || 0) === 0)) && (
            <div className="mt-4 h-[160px] flex flex-col items-center justify-center px-6 text-gray-600">
              <AlertCircle size={28} className="text-blue-600 mb-3" />
              <p>{cancelError || "Chưa có món nào bị hủy"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-5">
            <h2 className="text-[22px] font-bold text-gray-900">Theo dõi nhân viên</h2>
            <div className="h-11 px-4 rounded-2xl bg-gray-100 text-gray-500 flex items-center gap-2">
              {filter}
              <ChevronDown size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 border border-gray-200 rounded-3xl overflow-hidden">
            {[
              ["Nhân viên đi làm", employeeStats.working],
              ["Nhân viên nghỉ làm", employeeStats.absent],
              ["Yêu cầu chờ duyệt", employeeStats.pendingRequests],
              ["Nhân viên đi muộn", employeeStats.late],
              ["Nhân viên về sớm", employeeStats.earlyLeave],
              ["Nhân viên làm thêm", employeeStats.overtime],
            ].map(([title, value]) => (
              <div key={title} className="h-[96px] flex flex-col items-center justify-center border-r border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-1 text-center">{title}</div>
                <div className="text-[32px] font-bold text-black">{empLoading ? "..." : value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">STT</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Top 5 nhân viên làm nhiều giờ nhất</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700">Số giờ làm</th>
                </tr>
              </thead>
              <tbody>
                {empLoading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-400">Đang tải dữ liệu...</td></tr>
                ) : topStaffs.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-400">Chưa có dữ liệu nhân viên</td></tr>
                ) : (
                  topStaffs.map((staff, index) => (
                    <tr key={staff.employeeId || index} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-4">{index + 1}</td>
                      <td className="px-4 py-4 font-medium text-gray-900">{staff.name}</td>
                      <td className="px-4 py-4 text-right font-semibold text-blue-600">{staff.hoursFormatted || `${staff.hours} giờ`}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-gray-50 flex items-center gap-3 text-gray-700">
            <Info size={18} className="text-gray-500" />
            <span>Quản lý chấm công - tính lương của cửa hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
