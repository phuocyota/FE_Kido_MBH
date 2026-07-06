import React, { useState, useEffect } from "react";
import { X, Calendar, User, DollarSign, Tag, FileText, CheckCircle2, AlertCircle, ShoppingBag, History } from "lucide-react";
import toast from "react-hot-toast";
import { orderApi } from "../../api";
import OrderStatusLogsDrawer from "./OrderStatusLogsDrawer";

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

const mapPaymentStatusToVN = (status) => {
  switch (status) {
    case "PAID":
      return { text: "Đã thanh toán", color: "bg-green-100 text-green-800" };
    case "PARTIAL":
      return { text: "Thanh toán một phần", color: "bg-yellow-100 text-yellow-800" };
    case "UNPAID":
      return { text: "Chưa thanh toán", color: "bg-red-100 text-red-800" };
    case "REFUNDED":
      return { text: "Đã hoàn tiền", color: "bg-gray-100 text-gray-800" };
    default:
      return { text: status || "Chưa xác định", color: "bg-gray-100 text-gray-800" };
  }
};

const mapPaymentMethodToVN = (method) => {
  switch (method) {
    case "CASH":
      return "Tiền mặt";
    case "WALLET":
      return "Ví điện tử";
    case "CARD":
      return "Thẻ ngân hàng";
    case "BANK_TRANSFER":
      return "Chuyển khoản";
    case "QR":
      return "Mã QR";
    case "MOMO":
      return "Ví MoMo";
    default:
      return method || "Chưa xác định";
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStatusLogs, setShowStatusLogs] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        toast.error("Không thể tải chi tiết đơn hàng");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#f8fafc] rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8 border border-white/20">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Chi tiết đơn hàng</h2>
              {order && <p className="text-xs text-blue-100 mt-0.5">Mã ID: {order.id}</p>}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/90 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : order ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[75vh]">
            
            {/* GENERAL INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Order Info */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={14} className="text-blue-500" />
                    Thông tin chung
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Mã đặt hàng:</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">{order.orderCode}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Số thứ tự:</span>
                      <span className="font-semibold text-gray-800">{order.orderNumber || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Thời gian tạo:</span>
                      <span className="font-medium text-gray-800 flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Trạng thái & Nhân viên
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Trạng thái đơn:</span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${mapStatusToVN(order.status).color}`}>
                        {mapStatusToVN(order.status).text}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Thanh toán:</span>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${mapPaymentStatusToVN(order.paymentStatus).color}`}>
                        {mapPaymentStatusToVN(order.paymentStatus).text}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Nhân viên thu ngân:</span>
                      <span className="font-semibold text-gray-800 flex items-center gap-1">
                        <User size={13} className="text-gray-400" />
                        {order.cashier?.fullName || "Hệ thống"}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowStatusLogs(true)}
                      className="mt-4 w-full py-2 px-3 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm hover:shadow"
                    >
                      <History size={13} className="text-slate-400" />
                      Lịch sử đổi trạng thái
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={14} className="text-indigo-500" />
                    Khách hàng
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Tên khách hàng:</span>
                      <span className="font-semibold text-gray-800">{order.customer?.fullName || "Khách lẻ"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Mã khách hàng:</span>
                      <span className="font-medium text-gray-800">{order.customer?.customerCode || "KL"}</span>
                    </div>
                    {order.customer?.phone && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Số điện thoại:</span>
                        <span className="font-medium text-gray-800">{order.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS TABLE */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-[#f8fafc] flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <ShoppingBag size={16} className="text-blue-500" />
                  Danh sách sản phẩm ({order.items?.length || 0})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-5 text-center w-12">#</th>
                      <th className="py-3 px-4">Tên sản phẩm</th>
                      <th className="py-3 px-4 text-right">Đơn giá</th>
                      <th className="py-3 px-4 text-center w-24">Số lượng</th>
                      <th className="py-3 px-4 text-right">Giảm giá</th>
                      <th className="py-3 px-5 text-right w-36">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-50 text-sm hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-5 text-center text-gray-400 font-medium">{index + 1}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{item.productName}</div>
                            {item.note && <div className="text-xs text-orange-500 italic mt-0.5">Ghi chú: {item.note}</div>}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-700 font-medium">
                            {Number(item.unitPrice || 0).toLocaleString("vi-VN")}đ
                          </td>
                          <td className="py-3 px-4 text-center text-gray-900 font-bold">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-red-500 font-medium">
                            {Number(item.discountAmount || 0) > 0 ? `-${Number(item.discountAmount).toLocaleString("vi-VN")}đ` : "-"}
                          </td>
                          <td className="py-3 px-5 text-right text-gray-900 font-bold">
                            {Number(item.totalAmount || 0).toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">Không có thông tin sản phẩm</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAYMENT HISTORY & TOTALS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Payment History */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-yellow-500" />
                    Lịch sử thanh toán
                  </h3>
                  <div className="space-y-3">
                    {order.payments && order.payments.length > 0 ? (
                      order.payments.map((pm, idx) => (
                        <div key={pm.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-slate-50/50 hover:bg-slate-50 transition">
                          <div>
                            <div className="font-semibold text-sm text-gray-900">
                              {mapPaymentMethodToVN(pm.method)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {formatDateTime(pm.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm text-green-600">
                              +{Number(pm.amount || 0).toLocaleString("vi-VN")}đ
                            </div>
                            <div className="text-xs font-medium text-gray-500">
                              {pm.status === "SUCCESS" ? "Thành công" : pm.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 text-sm gap-2">
                        <AlertCircle size={20} className="text-gray-300" />
                        Chưa có lịch sử giao dịch thanh toán
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Totals Summary */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={14} className="text-purple-500" />
                  Tổng cộng
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-medium text-gray-900">{Number(order.subtotal || 0).toLocaleString("vi-VN")}đ</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Chiết khấu:</span>
                    <span className="font-medium text-red-500">
                      {Number(order.discountAmount || 0) > 0 ? `-${Number(order.discountAmount).toLocaleString("vi-VN")}đ` : "0đ"}
                    </span>
                  </div>

                  {Number(order.couponDiscount || 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Mã giảm giá (Coupon):</span>
                      <span className="font-medium text-red-500">-{Number(order.couponDiscount).toLocaleString("vi-VN")}đ</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-gray-100 my-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Khách cần trả:</span>
                    <span className="text-xl font-bold text-[#0f62fe]">{Number(order.totalAmount || 0).toLocaleString("vi-VN")}đ</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Khách đã trả:</span>
                    <span className="font-semibold text-green-600">{Number(order.paidAmount || 0).toLocaleString("vi-VN")}đ</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tiền thừa trả khách:</span>
                    <span className="font-semibold text-gray-800">{Number(order.changeAmount || 0).toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note & Other */}
            {order.note && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">Ghi chú đơn hàng</h4>
                  <p className="text-amber-700 text-sm mt-0.5">{order.note}</p>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-2 bg-white">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-gray-500 font-medium text-sm">Không tìm thấy thông tin đơn hàng này.</p>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-6 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition cursor-pointer text-sm shadow-sm hover:shadow"
          >
            Đóng
          </button>
        </div>
      </div>

      {showStatusLogs && (
        <OrderStatusLogsDrawer
          orderId={orderId}
          orderCode={order?.orderCode}
          onClose={() => setShowStatusLogs(false)}
        />
      )}
    </div>
  );
}
