import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ArrowDownLeft, ArrowUpRight, RefreshCcw, Coins, FileText, CheckCircle2, Clock, User, CreditCard, ShoppingBag, ClipboardList, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import banhngot from "../../assets/banhngot.jpeg";
import { normalizeParentHistory, ORDER_STATUS } from "../../api/parentData";
import { getParentHome, getWalletTransactions } from "../../api/parent";
import { getOrderStatusLogs } from "../../api/orderApi";
import { Calendar as DateRangeCalendar } from "react-date-range";
import { vi } from "date-fns/locale";

const ITEMS_PER_PAGE = 8;

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("vi-VN");
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateInput = (value) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  return [day, month, year].filter(Boolean).join("/");
};

const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: toDateInputValue(monday),
    to: toDateInputValue(sunday),
  };
};

const formatMoney = (value = 0) =>
  `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const statusText = {
  completed: "Hoàn thành",
  ready: "Chờ lấy món",
  pending: "Chờ chế biến",
  payment: "Chờ thanh toán",
  cancel: "Đã hủy",
};

const statusClass = {
  completed: "bg-emerald-100 text-emerald-600",
  ready: "bg-amber-100 text-amber-600",
  pending: "bg-blue-100 text-blue-600",
  payment: "bg-indigo-100 text-indigo-600",
  cancel: "bg-rose-100 text-rose-500",
};

function DatePickerField({ value, onChange, label, align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parsedDate = value ? new Date(value) : new Date();

  const alignClass = align === "right"
    ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
    : "left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0";

  return (
    <div className="relative z-30" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full min-w-[164px] items-center justify-between gap-3 rounded-lg border border-gray-400 bg-white px-3 py-2 text-left text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:bg-slate-50"
        aria-label={label}
      >
        <span>{formatDateInput(value)}</span>
        <Calendar size={16} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className={`absolute top-full ${alignClass} mt-2 bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 scale-[0.85] min-[375px]:scale-[0.9] sm:scale-100 origin-top`}>
          <DateRangeCalendar
            date={parsedDate}
            onChange={(date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              onChange(`${year}-${month}-${day}`);
              setIsOpen(false);
            }}
            color="#2563eb"
            locale={vi}
          />
        </div>
      )}
    </div>
  );
}

export default function History() {
  const {
    homeData,
    loading,
    error,
    refreshHome,
  } = useOutletContext() || {};
  const customerId = homeData?.user?.id;

  const ordersData = useMemo(() => normalizeParentHistory(homeData), [homeData]);
  const [fromDate, setFromDate] = useState(() => getCurrentWeekRange().from);
  const [toDate, setToDate] = useState(() => getCurrentWeekRange().to);
  const [status, setStatus] = useState("all");
  
  // Tab state: "orders" | "advances"
  const [activeTab, setActiveTab] = useState("orders");
  
  // Wallet Transactions / Advance limit usage states
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState(null);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const observerTarget = useRef(null);

  const [statusLogs, setStatusLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  const hasInitialData = useRef(!!homeData);

  useEffect(() => {
    if (hasInitialData.current && refreshHome) {
      refreshHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedOrder?.orderId) {
      setStatusLogs([]);
      return;
    }

    let ignore = false;
    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        setLogsError("");
        const data = await getOrderStatusLogs(selectedOrder.orderId);
        if (!ignore) {
          setStatusLogs(data || []);
        }
      } catch (err) {
        if (!ignore) {
          setLogsError(err.message || "Không tải được lịch sử thay đổi");
        }
      } finally {
        if (!ignore) {
          setLogsLoading(false);
        }
      }
    };

    fetchLogs();

    const handleStatusChanged = (e) => {
      const updatedOrder = e.detail?.order || e.detail;
      if (updatedOrder && String(updatedOrder.id) === String(selectedOrder.orderId)) {
        fetchLogs();
      }
    };
    window.addEventListener("order:status-changed", handleStatusChanged);

    return () => {
      ignore = true;
      window.removeEventListener("order:status-changed", handleStatusChanged);
    };
  }, [selectedOrder]);

  // Fetch wallet transactions for advance history
  useEffect(() => {
    let ignore = false;
    if (activeTab === "advances" && customerId) {
      const fetchTx = async () => {
        try {
          setTxLoading(true);
          setTxError("");
          const res = await getWalletTransactions(customerId, 1, 100);
          if (!ignore) {
            setTransactions(res?.data || []);
          }
        } catch (err) {
          if (!ignore) {
            setTxError(err.message || "Không tải được lịch sử tạm ứng");
          }
        } finally {
          if (!ignore) {
            setTxLoading(false);
          }
        }
      };
      fetchTx();
    }
    return () => {
      ignore = true;
    };
  }, [activeTab, customerId]);

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const orderDate = order.date ? new Date(order.date) : null;
      const afterFrom = fromDate
        ? orderDate >= new Date(`${fromDate}T00:00:00`)
        : true;
      const beforeTo = toDate
        ? orderDate <= new Date(`${toDate}T23:59:59`)
        : true;
      const matchStatus = status === "all" || order.status === status;

      return afterFrom && beforeTo && matchStatus;
    });
  }, [ordersData, fromDate, toDate, status]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const afterFrom = fromDate
        ? txDate >= new Date(`${fromDate}T00:00:00`)
        : true;
      const beforeTo = toDate
        ? txDate <= new Date(`${toDate}T23:59:59`)
        : true;
      const matchType = txTypeFilter === "all" || tx.type === txTypeFilter;

      return afterFrom && beforeTo && matchType;
    });
  }, [transactions, fromDate, toDate, txTypeFilter]);

  const filteredItems = activeTab === "orders" ? filteredOrders : filteredTransactions;
  const currentItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  const updateStatus = (nextStatus) => {
    setStatus(nextStatus);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const updateTxType = (nextType) => {
    setTxTypeFilter(nextType);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const updateDate = (setDate) => (value) => {
    setDate(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const showLoading = loading || (activeTab === "advances" && txLoading);
  const showErrorMessage = error || (activeTab === "advances" && txError ? txError : "");

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-bold text-gray-800">Lịch sử</h1>

      {/* Tabs Selector */}
      <div className="flex bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] w-full sm:w-fit">
        <button
          type="button"
          onClick={() => handleTabChange("orders")}
          className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lịch sử đặt món
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("advances")}
          className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === "advances"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lịch sử tạm ứng
        </button>
      </div>

      {showLoading && <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>}
      {showErrorMessage && <p className="text-sm text-red-500">{showErrorMessage}</p>}

      {/* Filters Box */}
      <div className="relative z-40 flex flex-col lg:flex-row justify-between gap-4 bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <DatePickerField
            label="Chọn ngày bắt đầu"
            value={fromDate}
            onChange={updateDate(setFromDate)}
            align="left"
          />
          <DatePickerField
            label="Chọn ngày kết thúc"
            value={toDate}
            onChange={updateDate(setToDate)}
            align="right"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {activeTab === "orders" ? (
            [
              ["all", "Tất cả"],
              ["payment", "Chờ thanh toán"],
              ["pending", "Chờ chế biến"],
              ["ready", "Chờ lấy món"],
              ["completed", "Hoàn thành"],
              ["cancel", "Đã hủy"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateStatus(key)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  status === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))
          ) : (
            [
              ["all", "Tất cả"],
              ["PAYMENT", "Thanh toán"],
              ["TOPUP", "Nạp tiền"],
              ["REFUND", "Hoàn tiền"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateTxType(key)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  txTypeFilter === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-4">
        {activeTab === "orders" ? (
          currentItems.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="w-full bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white/80 transition-all cursor-pointer flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={banhngot}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-base line-clamp-1">{order.name}</p>
                  <p className="text-blue-600 font-bold text-sm mt-0.5">
                    {formatMoney(order.price)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Số lượng: {order.quantity}</p>
                <span
                  className={`inline-block text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide border ${
                    order.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
                    order.status === "ready" ? "bg-amber-50 text-amber-600 border-amber-100/50" :
                    order.status === "payment" ? "bg-indigo-50 text-indigo-600 border-indigo-100/50" :
                    order.status === "cancel" ? "bg-rose-50 text-rose-600 border-rose-100/50" :
                    "bg-blue-50 text-blue-600 border-blue-100/50"
                  }`}
                >
                  {statusText[order.status] || "Chờ chế biến"}
                </span>
              </div>
            </button>
          ))
        ) : (
          currentItems.map((tx) => {
            const isNegative = tx.type === "PAYMENT";
            const amountText = `${isNegative ? "-" : "+"}${formatMoney(tx.amount)}`;
            const amountColor = isNegative ? "text-rose-600" : "text-emerald-600 font-bold";
            const dateStr = formatDate(tx.createdAt) + " " + new Date(tx.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
            
            let Icon = Coins;
            let iconBg = "bg-blue-50 text-blue-500 border-blue-100";
            let typeLabel = "Giao dịch";
            
            if (tx.type === "PAYMENT") {
              Icon = ArrowDownLeft;
              iconBg = "bg-rose-50 text-rose-500 border-rose-100";
              typeLabel = "Thanh toán đơn hàng";
            } else if (tx.type === "TOPUP") {
              Icon = ArrowUpRight;
              iconBg = "bg-emerald-50 text-emerald-500 border-emerald-100";
              typeLabel = "Nạp tiền hoàn trả tạm ứng";
            } else if (tx.type === "REFUND") {
              Icon = RefreshCcw;
              iconBg = "bg-indigo-50 text-indigo-500 border-indigo-100";
              typeLabel = "Hoàn tiền đơn hàng";
            }
            
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTx(tx)}
                className="w-full bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white/80 transition-all cursor-pointer flex items-center justify-between gap-3 text-left group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${iconBg} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-base line-clamp-1">{typeLabel}</p>
                    <p className="text-gray-400 text-xs mt-1 font-medium">{dateStr}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`font-bold text-base ${amountColor}`}>{amountText}</p>
                  <p className="text-[11px] font-medium text-gray-500 mt-1">
                    Số dư sau: {formatMoney(tx.balanceAfter)}
                  </p>
                </div>
              </button>
            );
          })
        )}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 bg-white/40 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              {activeTab === "orders" ? "Không có đơn hàng nào" : "Không có lịch sử tạm ứng nào"}
            </p>
          </div>
        )}

        {/* Intersection Observer Target for Infinite Scroll */}
        {hasMore && (
          <div ref={observerTarget} className="py-6 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-md w-[92%] sm:w-[440px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col scale-100 transform transition-transform duration-300"
          >
            {/* Header Image section */}
            <div className="relative group shrink-0">
              <img src={banhngot} alt="" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/35 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 text-lg font-bold"
              >
                ×
              </button>

              <div className="absolute bottom-4 left-4">
                <span
                  className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow border border-white/10 ${
                    selectedOrder.status === "cancel" ? "bg-rose-500 text-white" :
                    selectedOrder.status === "completed" ? "bg-emerald-500 text-white" :
                    selectedOrder.status === "ready" ? "bg-amber-500 text-white" :
                    selectedOrder.status === "payment" ? "bg-indigo-500 text-white" :
                    "bg-blue-500 text-white"
                  }`}
                >
                  {statusText[selectedOrder.status] || "Chờ chế biến"}
                </span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 space-y-5 text-left flex-1">
              
              {/* Product title and cost */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase bg-blue-50/80 px-2 py-1 rounded-md border border-blue-100/50">
                    Chi tiết đơn hàng
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-2 leading-snug">{selectedOrder.name}</h2>
                </div>
                <div className="text-right shrink-0 bg-blue-50 px-3.5 py-2 rounded-2xl border border-blue-100/50">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Tổng tiền</p>
                  <p className="text-blue-600 font-black text-lg mt-0.5 whitespace-nowrap">
                    {formatMoney(selectedOrder.price * selectedOrder.quantity)}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-[9px] uppercase tracking-wider">Số lượng</p>
                    <p className="font-extrabold text-slate-700 mt-0.5">x{selectedOrder.quantity}</p>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-[9px] uppercase tracking-wider">Ngày đặt</p>
                    <p className="font-extrabold text-slate-700 mt-0.5">{formatDate(selectedOrder.date)}</p>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-[9px] uppercase tracking-wider">Nhận hàng</p>
                    <p className="font-extrabold text-slate-700 mt-0.5">{selectedOrder.pickupType || "Tại quầy"}</p>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-[9px] uppercase tracking-wider">Thanh toán</p>
                    <p className="font-extrabold text-slate-700 mt-0.5">{selectedOrder.paymentMethod || "Ví"}</p>
                  </div>
                </div>
              </div>

              {/* Note section */}
              <div className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-2xl flex gap-3 text-xs text-amber-800">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 h-fit">
                  <ClipboardList size={16} />
                </div>
                <div>
                  <p className="font-bold text-amber-900 mb-0.5">Ghi chú từ bạn</p>
                  <p className="leading-relaxed text-amber-800/80 font-medium">{selectedOrder.note || "Không có ghi chú nào được thêm."}</p>
                </div>
              </div>

              {/* Status Change Timeline */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={14} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Lịch sử trạng thái</h3>
                </div>

                {logsLoading && (
                  <div className="flex justify-center items-center py-6">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {logsError && (
                  <div className="bg-rose-50 border border-rose-100 text-xs text-rose-600 text-center py-3 px-4 rounded-xl">{logsError}</div>
                )}

                {!logsLoading && !logsError && statusLogs.length === 0 && (
                  <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">Chưa có lịch sử trạng thái</p>
                  </div>
                )}

                {!logsLoading && !logsError && statusLogs.length > 0 && (
                  <div className="relative pl-6 space-y-4">
                    {/* Vertical connector line */}
                    <div className="absolute left-[9px] top-2.5 bottom-2.5 w-[2px] bg-slate-100"></div>

                    {[...statusLogs]
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .map((log, idx, arr) => {
                        const isLatest = idx === arr.length - 1;
                        const formattedTime = new Date(log.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit"
                        }) + " - " + new Date(log.createdAt).toLocaleDateString("vi-VN");

                        // Status helpers
                        const mapStatusNumToText = (status) => {
                          const code = Number(status);
                          switch (code) {
                            case ORDER_STATUS.CANCELLED: return "Đã hủy";
                            case ORDER_STATUS.PREPARING: return "Đang chế biến";
                            case ORDER_STATUS.PENDING: return "Chờ chế biến";
                            case ORDER_STATUS.PENDING_PAYMENT: return "Chờ thanh toán";
                            case ORDER_STATUS.READY_TO_PICKUP: return "Chờ lấy món";
                            case ORDER_STATUS.DONE: return "Hoàn thành chế biến";
                            case ORDER_STATUS.REFUNDED: return "Đã hoàn tiền";
                            case ORDER_STATUS.DRAFT: return "Bản nháp";
                            case ORDER_STATUS.WAITING: return "Chờ xử lý";
                            case ORDER_STATUS.READY: return "Chờ lấy món";
                            case ORDER_STATUS.RECEIVED: return "Đã nhận món";
                            case ORDER_STATUS.COMPLETED: return "Hoàn thành";
                            default: return `Trạng thái ${status}`;
                          }
                        };

                        const mapReasonText = (reason) => {
                          const map = {
                            MANUAL: "Thao tác thủ công",
                            PAYMENT: "Thanh toán hệ thống",
                            INITIAL_PAYMENT: "Khởi tạo thanh toán",
                            CASH_PAYMENT: "Thanh toán tiền mặt",
                            MOMO_PAYMENT: "Thanh toán MoMo",
                            COMPLETE: "Hoàn thành đơn hàng",
                            CANCEL: "Hủy đơn hàng",
                            REFUND: "Hoàn tiền",
                          };
                          return map[reason] || reason || "Không có lý do";
                        };

                        // Dot and text styling helpers
                        const getStatusClasses = (status) => {
                          const code = Number(status);
                          if (code === ORDER_STATUS.RECEIVED || code === ORDER_STATUS.COMPLETED) {
                            return {
                              dot: "bg-emerald-500 border-emerald-100 ring-emerald-500/20",
                              badge: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
                            };
                          }
                          if (code === ORDER_STATUS.READY || code === ORDER_STATUS.READY_TO_PICKUP || code === ORDER_STATUS.DONE) {
                            return {
                              dot: "bg-amber-500 border-amber-100 ring-amber-500/20",
                              badge: "bg-amber-50 text-amber-700 border-amber-100/50",
                            };
                          }
                          if (code === ORDER_STATUS.PENDING_PAYMENT || code === ORDER_STATUS.DRAFT) {
                            return {
                              dot: "bg-indigo-500 border-indigo-100 ring-indigo-500/20",
                              badge: "bg-indigo-50 text-indigo-700 border-indigo-100/50",
                            };
                          }
                          if (code === ORDER_STATUS.CANCELLED || code === ORDER_STATUS.REFUNDED) {
                            return {
                              dot: "bg-rose-500 border-rose-100 ring-rose-500/20",
                              badge: "bg-rose-50 text-rose-700 border-rose-100/50",
                            };
                          }
                          return {
                            dot: "bg-blue-500 border-blue-100 ring-blue-500/20",
                            badge: "bg-blue-50 text-blue-700 border-blue-100/50",
                          };
                        };

                        const oldStyle = log.oldStatus !== null && log.oldStatus !== undefined ? getStatusClasses(log.oldStatus) : null;
                        const newStyle = getStatusClasses(log.newStatus);

                        return (
                          <div key={log.id || idx} className="relative flex flex-col gap-1.5 text-xs text-left group/item">
                            
                            {/* Bullet indicator */}
                            <div className={`absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                              isLatest ? `${newStyle.dot} ring-4 scale-110` : `${newStyle.dot} scale-90`
                            }`}></div>

                            {/* Status transition chips */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {log.oldStatus !== null && log.oldStatus !== undefined && (
                                <>
                                  <span className={`inline-block px-2 py-0.5 rounded-md border font-semibold text-[10px] uppercase ${oldStyle.badge}`}>
                                    {mapStatusNumToText(log.oldStatus)}
                                  </span>
                                  <ChevronRight size={12} className="text-slate-300" />
                                </>
                              )}
                              <span className={`inline-block px-2 py-0.5 rounded-md border font-bold text-[10px] uppercase ${newStyle.badge} ${isLatest ? 'ring-2 ring-blue-500/10' : ''}`}>
                                {mapStatusNumToText(log.newStatus)}
                              </span>
                            </div>

                            {/* Actor & Reason info box */}
                            <div className="flex flex-col gap-0.5 pl-0.5">
                              <div className="text-[10px] text-slate-400 font-medium">
                                {formattedTime}
                              </div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap mt-0.5">
                                <span className="font-semibold text-slate-700">
                                  {log.changedByUser?.fullName 
                                    ? `${log.changedByUser.fullName} (${log.changedByUser.role})` 
                                    : log.changedBy === "system" ? "Hệ thống" : log.changedBy || "Hệ thống"}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 font-medium italic">
                                  Lý do: {mapReasonText(log.reason)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50"
          onClick={() => setSelectedTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[92%] sm:w-[420px] rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className={`p-6 text-white ${
              selectedTx.type === "PAYMENT" ? "bg-gradient-to-r from-rose-500 to-red-500" :
              selectedTx.type === "TOPUP" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
              "bg-gradient-to-r from-indigo-500 to-blue-500"
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/80 font-medium uppercase tracking-wider">
                    {selectedTx.type === "PAYMENT" ? "Giao dịch chi tiêu" :
                     selectedTx.type === "TOPUP" ? "Giao dịch nạp tiền" :
                     selectedTx.type === "REFUND" ? "Giao dịch hoàn tiền" : "Điều chỉnh số dư"}
                  </p>
                  <h2 className="text-xl font-bold mt-1">Chi tiết giao dịch</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="bg-white/25 hover:bg-white/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center py-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 font-medium">Số tiền giao dịch</p>
                <p className={`text-3xl font-extrabold mt-1.5 ${
                  selectedTx.type === "PAYMENT" ? "text-rose-600" : "text-emerald-600"
                }`}>
                  {selectedTx.type === "PAYMENT" ? "-" : "+"}{formatMoney(selectedTx.amount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-gray-400 text-xs font-medium">Số dư trước</p>
                  <p className="font-bold text-gray-700 mt-1">{formatMoney(selectedTx.balanceBefore)}</p>
                </div>

                <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-gray-400 text-xs font-medium">Số dư sau</p>
                  <p className="font-bold text-blue-600 mt-1">{formatMoney(selectedTx.balanceAfter)}</p>
                </div>

                <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 col-span-2">
                  <p className="text-gray-400 text-xs font-medium">Thời gian giao dịch</p>
                  <p className="font-bold text-gray-700 mt-1">
                    {formatDate(selectedTx.createdAt)} {new Date(selectedTx.createdAt).toLocaleTimeString("vi-VN")}
                  </p>
                </div>

                {selectedTx.refType && (
                  <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 col-span-2">
                    <p className="text-gray-400 text-xs font-medium">Tham chiếu giao dịch</p>
                    <p className="font-bold text-gray-700 mt-1 uppercase">
                      {selectedTx.refType}: {selectedTx.refId || "Hệ thống"}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl text-sm border border-blue-100/50">
                <p className="text-blue-500 font-bold text-xs mb-1">Ghi chú / Mô tả</p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {selectedTx.note || (
                    selectedTx.type === "PAYMENT" ? "Thanh toán cho đơn hàng phát sinh ăn uống/bán trú tại trường." :
                    selectedTx.type === "TOPUP" ? "Nạp tiền vào tài khoản để hoàn trả hạn mức tạm ứng qua MoMo." :
                    selectedTx.type === "REFUND" ? "Hoàn tiền trả lại ví do hủy đơn hoặc điều chỉnh dịch vụ." :
                    "Không có ghi chú thêm."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
