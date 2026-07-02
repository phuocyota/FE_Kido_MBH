import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ArrowDownLeft, ArrowUpRight, RefreshCcw, Coins, FileText, CheckCircle2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import banhngot from "../../assets/banhngot.jpeg";
import { normalizeParentHistory } from "../../api/parentData";
import { getParentHome, getWalletTransactions } from "../../api/parent";

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

function DatePickerField({ value, onChange, label }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    const input = inputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex w-full min-w-[164px] items-center justify-between gap-3 rounded-lg border border-gray-400 bg-white px-3 py-2 text-left text-sm text-gray-900"
        aria-label={label}
      >
        <span>{formatDateInput(value)}</span>
        <Calendar size={16} className="text-gray-700" />
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

export default function History() {
  const {
    homeData: layoutHomeData,
    loading: layoutLoading,
    error: layoutError,
  } = useOutletContext() || {};
  const [historyHomeData, setHistoryHomeData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const homeData = historyHomeData ?? layoutHomeData;
  const loading = historyLoading || (layoutLoading && !homeData);
  const error = historyError || layoutError;
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

  useEffect(() => {
    let ignore = false;

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");
        const data = await getParentHome();

        if (!ignore) {
          setHistoryHomeData(data);
        }
      } catch (err) {
        if (!ignore) {
          setHistoryError(err.message || "Không tải được lịch sử order");
        }
      } finally {
        if (!ignore) {
          setHistoryLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      ignore = true;
    };
  }, []);

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
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <DatePickerField
            label="Chọn ngày bắt đầu"
            value={fromDate}
            onChange={updateDate(setFromDate)}
          />
          <DatePickerField
            label="Chọn ngày kết thúc"
            value={toDate}
            onChange={updateDate(setToDate)}
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
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[92%] sm:w-[420px] rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative">
              <img src={banhngot} alt="" className="w-full h-44 object-cover" />

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-sm hover:bg-white"
              >
                ×
              </button>

              <div className="absolute bottom-3 left-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full shadow ${
                    selectedOrder.status === "cancel"
                      ? "bg-red-500 text-white"
                      : selectedOrder.status === "completed"
                      ? "bg-emerald-500 text-white"
                      : selectedOrder.status === "ready"
                      ? "bg-amber-500 text-white"
                      : selectedOrder.status === "payment"
                      ? "bg-indigo-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {statusText[selectedOrder.status] || "Chờ chế biến"}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center gap-3">
                <h2 className="text-lg font-bold">{selectedOrder.name}</h2>
                <p className="text-blue-600 font-semibold">
                  {formatMoney(selectedOrder.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs">Số lượng</p>
                  <p className="font-medium">x{selectedOrder.quantity}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs">Ngày</p>
                  <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs">Nhận hàng</p>
                  <p className="font-medium">{selectedOrder.pickupType || "-"}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-400 text-xs">Thanh toán</p>
                  <p className="font-medium">{selectedOrder.paymentMethod || "-"}</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-xl text-sm">
                <p className="text-gray-400 text-xs mb-1">Ghi chú</p>
                <p>{selectedOrder.note || "Không có ghi chú"}</p>
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
