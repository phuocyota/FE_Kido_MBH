import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  List,
  Settings,
  HelpCircle,
  Download,
} from "lucide-react";

import { orderApi } from "../../api";
import { getBranchIdFromToken } from "../../api/authSession";
import OrdersSidebar from "../../components/Orders/OrdersSidebar";
import OrdersContent from "../../components/Orders/OrdersContent";
import OrderDetailModal from "../../components/Orders/OrderDetailModal";

const mapStatusToVN = (statusNum) => {
  switch (Number(statusNum)) {
    case 0:
      return "Đã hủy";
    case 1:
      return "Đang chế biến";
    case 2:
      return "Chờ xử lý";
    case 3:
      return "Chờ thanh toán";
    case 4:
      return "Chờ nhận hàng";
    case 5:
    case 11:
      return "Đã hoàn thành";
    case 6:
      return "Đã trả hàng";
    case 7:
      return "Phiếu tạm";
    case 8:
      return "Đang chờ";
    case 9:
      return "Sẵn sàng";
    case 10:
      return "Đã nhận";
    default:
      return "Khác";
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedTime, setSelectedTime] = useState("Tháng này");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Toàn thời gian");
  const [area, setArea] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [creator, setCreator] = useState("");
  const [recipient, setRecipient] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const branchId = getBranchIdFromToken();
      const statusFilterMap = {
        "Đã hoàn thành": "DONE",
        "Phiếu tạm": "DRAFT",
        "Đã hủy": "CANCELLED",
      };
      const resolvedStatus = statusFilterMap[statusFilter] || undefined;
      const data = await orderApi.getAll(branchId, resolvedStatus);

      const mapped = (data || []).map((order) => ({
        id: order.id,
        code: order.orderCode,
        time: formatDateTime(order.createdAt),
        rawCreatedAt: order.createdAt,
        customerCode: order.customer?.customerCode || "KL",
        customerName: order.customer?.fullName || "Khách lẻ",
        amountDue: Number(order.totalAmount || 0),
        amountPaid: Number(order.paidAmount || 0),
        status: mapStatusToVN(order.status),
        paymentMethodRaw: order.paymentMethod,
        cashierName: order.cashier?.fullName || "",
      }));

      setOrders(mapped);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setSelectedTime("Tháng này");
    setStatusFilter("");
    setDeliveryPartner("");
    setDeliveryTime("Toàn thời gian");
    setArea("");
    setPaymentMethod("");
    setCreator("");
    setRecipient("");
  };

  // Client-side filtering
  const filteredOrders = orders.filter((order) => {
    // 1. Search filter
    if (search) {
      const term = search.toLowerCase();
      const codeMatch = order.code?.toLowerCase().includes(term);
      const nameMatch = order.customerName?.toLowerCase().includes(term);
      const custCodeMatch = order.customerCode?.toLowerCase().includes(term);
      if (!codeMatch && !nameMatch && !custCodeMatch) return false;
    }

    // 2. Time filter (Tháng này)
    if (selectedTime === "Tháng này" && order.rawCreatedAt) {
      const date = new Date(order.rawCreatedAt);
      const now = new Date();
      if (
        date.getMonth() !== now.getMonth() ||
        date.getFullYear() !== now.getFullYear()
      ) {
        return false;
      }
    }

    // 3. Payment method filter
    if (paymentMethod) {
      const pmMap = {
        "Tiền mặt": "CASH",
        "Thẻ ngân hàng": "CARD",
        "Chuyển khoản": "BANK_TRANSFER",
        "Ví điện tử": "WALLET",
      };
      const targetMethod = pmMap[paymentMethod];
      if (order.paymentMethodRaw !== targetMethod) {
        return false;
      }
    }

    // 4. Creator filter
    if (creator && creator !== "Admin") {
      if (!order.cashierName?.toLowerCase().includes(creator.toLowerCase())) {
        return false;
      }
    }

    // 5. Recipient filter
    if (recipient && recipient !== "Admin") {
      if (!order.cashierName?.toLowerCase().includes(recipient.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedTime,
    statusFilter,
    deliveryPartner,
    deliveryTime,
    area,
    paymentMethod,
    creator,
    recipient,
  ]);

  return (
    <div className="w-full min-h-screen bg-[#f4f6f8] p-4 flex flex-col lg:flex-row gap-4">
      {/* SIDEBAR */}
      <OrdersSidebar
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        deliveryPartner={deliveryPartner}
        setDeliveryPartner={setDeliveryPartner}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        area={area}
        setArea={setArea}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        creator={creator}
        setCreator={setCreator}
        recipient={recipient}
        setRecipient={setRecipient}
      />

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col gap-4">
        {/* TOOLBAR */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[400px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Theo mã phiếu đặt"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <SlidersHorizontal
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="h-10 px-4 border border-[#0f62fe] text-[#0f62fe] bg-white hover:bg-blue-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap">
              <Plus size={16} />
              Đặt hàng
            </button>

            <button className="h-10 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap">
              🔗 Gộp đơn
            </button>

            <button className="h-10 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center gap-1.5 font-medium text-sm transition cursor-pointer whitespace-nowrap">
              <Download size={16} className="text-gray-500" />
              Xuất file
            </button>

            <div className="h-5 w-[1px] bg-gray-300 mx-1 hidden sm:block" />

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <List size={18} />
            </button>

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <Settings size={18} />
            </button>

            <button className="h-10 w-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer flex-shrink-0">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* TABLE GRID / EMPTY STATE */}
        {loading ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] flex items-center justify-center text-gray-500">
            Đang tải danh sách đơn hàng...
          </div>
        ) : error ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <OrdersContent
            orders={filteredOrders}
            currentOrders={currentOrders}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            onResetFilters={resetFilters}
            onOrderClick={(orderId) => setSelectedOrderId(orderId)}
          />
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}

