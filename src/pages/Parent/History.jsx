import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import banhngot from "../../assets/banhngot.jpeg";
import { normalizeParentHistory } from "../../api/parentData";
import { getParentHome } from "../../api/parent";

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
  done: "Hoàn thành",
  pending: "Đang xử lý",
  cancel: "Đã hủy",
};

const statusClass = {
  done: "bg-green-100 text-green-600",
  pending: "bg-blue-100 text-blue-600",
  cancel: "bg-red-100 text-red-500",
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
  const ordersData = useMemo(() => normalizeParentHistory(homeData), [homeData]);
  const [fromDate, setFromDate] = useState(() => getCurrentWeekRange().from);
  const [toDate, setToDate] = useState(() => getCurrentWeekRange().to);
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const totalPages = Math.max(Math.ceil(filteredOrders.length / ITEMS_PER_PAGE), 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const updateStatus = (nextStatus) => {
    setStatus(nextStatus);
    setCurrentPage(1);
  };

  const updateDate = (setDate) => (value) => {
    setDate(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lịch sử order</h1>

      {loading && <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow">
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
          {[
            ["all", "Tất cả"],
            ["done", "Hoàn thành"],
            ["pending", "Đang xử lý"],
            ["cancel", "Đã hủy"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => updateStatus(key)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                status === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {currentOrders.map((order) => (
          <button
            key={order.id}
            type="button"
            onClick={() => setSelectedOrder(order)}
            className="w-full bg-white p-4 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={banhngot}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm line-clamp-1">{order.name}</p>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatMoney(order.price)}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm text-gray-500">Số lượng: {order.quantity}</p>
              <span
                className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${
                  statusClass[order.status] || statusClass.pending
                }`}
              >
                {order.statusText || statusText[order.status] || "Đang xử lý"}
              </span>
            </div>
          </button>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-400">Không có đơn hàng</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
        <p className="text-sm text-gray-500">
          Trang {currentPage} / {totalPages}
        </p>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ←
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>

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
                      : selectedOrder.status === "done"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {selectedOrder.statusText ||
                    statusText[selectedOrder.status] ||
                    "Đang xử lý"}
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
    </div>
  );
}
