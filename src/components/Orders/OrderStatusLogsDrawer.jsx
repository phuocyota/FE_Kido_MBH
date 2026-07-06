import React, { useState, useEffect } from "react";
import { X, Clock, ArrowRight, User, Info, Calendar, Activity, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { orderApi } from "../../api";
import { connectSocket, getSocket, joinOrders, leaveOrders, SOCKET_EVENTS } from "../../api";

const mapStatusToVN = (statusNum) => {
  switch (Number(statusNum)) {
    case 0:
      return { text: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200" };
    case 1:
      return { text: "Đang chế biến", color: "bg-orange-50 text-orange-700 border-orange-200" };
    case 2:
      return { text: "Chờ xử lý", color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    case 3:
      return { text: "Chờ thanh toán", color: "bg-purple-50 text-purple-700 border-purple-200" };
    case 4:
      return { text: "Chờ nhận hàng", color: "bg-blue-50 text-blue-700 border-blue-200" };
    case 5:
    case 11:
      return { text: "Đã hoàn thành", color: "bg-green-50 text-green-700 border-green-200" };
    case 6:
      return { text: "Đã trả hàng", color: "bg-pink-50 text-pink-700 border-pink-200" };
    case 7:
      return { text: "Phiếu tạm", color: "bg-gray-50 text-gray-700 border-gray-200" };
    case 8:
      return { text: "Đang chờ", color: "bg-slate-50 text-slate-700 border-slate-200" };
    case 9:
      return { text: "Sẵn sàng", color: "bg-teal-50 text-teal-700 border-teal-200" };
    case 10:
      return { text: "Đã nhận", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    default:
      return { text: "Khác", color: "bg-gray-50 text-gray-700 border-gray-200" };
  }
};

const mapReasonToVN = (reason) => {
  if (!reason) return "Không có lý do";
  switch (reason) {
    case "MANUAL":
      return "Cập nhật thủ công";
    case "PAYMENT":
      return "Thanh toán thành công";
    case "INITIAL_PAYMENT":
      return "Khởi tạo thanh toán";
    case "CASH_PAYMENT":
      return "Thanh toán tiền mặt";
    case "MOMO_PAYMENT":
      return "Thanh toán qua MoMo";
    case "COMPLETE":
      return "Hoàn tất đơn hàng";
    case "CANCEL":
      return "Hủy đơn hàng";
    case "REFUND":
      return "Hoàn tiền";
    default:
      return reason;
  }
};

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case "ADMIN":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "CASHIER":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "STAFF":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const mapRoleToVN = (role) => {
  switch (role) {
    case "ADMIN":
      return "Quản trị viên";
    case "CASHIER":
      return "Thu ngân";
    case "STAFF":
      return "Nhân viên";
    default:
      return role || "Người dùng";
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} - ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export default function OrderStatusLogsDrawer({ orderId, orderCode, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getStatusLogs(orderId);
      // Sort logs by newest first
      const sortedLogs = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLogs(sortedLogs);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đổi trạng thái đơn hàng:", err);
      setError("Không thể tải lịch sử thay đổi trạng thái");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger slide-in animation on mount
    const timer = setTimeout(() => setIsAnimating(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    fetchLogs();

    // Setup socket connection and join room
    connectSocket();
    joinOrders({ orderId });

    const handleStatusChanged = (payload) => {
      // If the updated order matches current orderId, refetch status logs
      if (payload && (payload.id === orderId || payload.orderId === orderId)) {
        fetchLogs();
      }
    };

    const socket = getSocket();
    socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChanged);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChanged);
      leaveOrders({ orderId });
    };
  }, [orderId]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for slide-out animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Container */}
      <div
        className={`relative w-full max-w-md bg-[#f8fafc] border-l border-slate-100 flex flex-col h-full shadow-2xl transform transition-transform duration-300 ease-out z-10 ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-md">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-base tracking-tight">Lịch sử đổi trạng thái</h3>
              {orderCode && <p className="text-xs text-slate-300 mt-0.5 font-medium">Đơn hàng: {orderCode}</p>}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Đang tải lịch sử đổi trạng thái...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-red-500 gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchLogs}
                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400 gap-3">
              <Clock className="w-10 h-10 text-slate-300" />
              <div>
                <p className="text-sm font-medium text-slate-500">Chưa có lịch sử thay đổi trạng thái</p>
                <p className="text-xs text-slate-400 mt-0.5">Mọi cập nhật trạng thái đơn sẽ được ghi nhận tại đây.</p>
              </div>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200/80 ml-3.5 pl-6 space-y-8">
              {logs.map((log) => {
                const oldStatusMap = log.oldStatus !== null ? mapStatusToVN(log.oldStatus) : null;
                const newStatusMap = mapStatusToVN(log.newStatus);
                const userObj = log.changedByUser;

                return (
                  <div key={log.id} className="relative group transition-all duration-200">
                    {/* Timeline Dot Indicator */}
                    <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-sm flex items-center justify-center z-10 group-hover:scale-125 transition-transform duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping group-hover:block hidden" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    </div>

                    {/* Timeline Node Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
                      
                      {/* Timestamp header */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar size={12} className="shrink-0" />
                        <span>{formatDateTime(log.createdAt)}</span>
                      </div>

                      {/* Status Transition Badges */}
                      <div className="flex items-center flex-wrap gap-2 py-0.5">
                        {oldStatusMap ? (
                          <>
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${oldStatusMap.color}`}>
                              {oldStatusMap.text}
                            </span>
                            <ArrowRight size={12} className="text-slate-400 shrink-0" />
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                              Mới tạo
                            </span>
                            <ArrowRight size={12} className="text-slate-400 shrink-0" />
                          </>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${newStatusMap.color}`}>
                          {newStatusMap.text}
                        </span>
                      </div>

                      <div className="h-[1px] bg-slate-50 my-0.5" />

                      {/* Details of Actor & Reason */}
                      <div className="space-y-2 text-xs">
                        
                        {/* Actor details */}
                        <div className="flex items-start gap-2">
                          <User size={13} className="text-slate-400 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <span className="text-slate-500">Thực hiện: </span>
                            {userObj ? (
                              <div className="inline">
                                <span className="font-semibold text-slate-800">{userObj.fullName}</span>
                                <span className={`inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${getRoleBadgeStyle(userObj.role)}`}>
                                  {mapRoleToVN(userObj.role)}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{userObj.email}</div>
                              </div>
                            ) : (
                              <span className="font-semibold text-slate-800">
                                {log.changedBy === "system" ? "Hệ thống" : log.changedBy || "Không rõ"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Reason / Source details */}
                        <div className="flex items-start gap-2">
                          <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <span className="text-slate-500">Lý do: </span>
                            <span className="font-semibold text-slate-700">
                              {mapReasonToVN(log.reason)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition cursor-pointer text-sm shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
