import React, { useState } from "react";
import banhngot from "../../assets/banhngot.jpeg";

export default function History() {

  // 🔥 DATA MẪU
  const ordersData = [
  {
    id: 1,
    name: "Cơm gà",
    price: 30000,
    quantity: 2,
    note: "Ít cơm",
    status: "done",
    date: "2026-04-15",
    pickupType: "Lấy liền",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 2,
    name: "Bún bò",
    price: 25000,
    quantity: 1,
    note: "",
    status: "done",
    date: "2026-04-14",
    pickupType: "Ra chơi lấy",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 3,
    name: "Mì xào",
    price: 20000,
    quantity: 3,
    note: "Không hành",
    status: "pending",
    date: "2026-04-13",
    pickupType: "Ra về lấy",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 4,
    name: "Phở bò",
    price: 35000,
    quantity: 1,
    note: "",
    status: "cancel",
    date: "2026-04-12",
    pickupType: "Lấy liền",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 5,
    name: "Cơm sườn",
    price: 32000,
    quantity: 2,
    note: "Thêm trứng",
    status: "done",
    date: "2026-04-11",
    pickupType: "Ra chơi lấy",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 6,
    name: "Hủ tiếu",
    price: 28000,
    quantity: 1,
    note: "",
    status: "pending",
    date: "2026-04-10",
    pickupType: "Ra về lấy",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 7,
    name: "Bánh mì",
    price: 15000,
    quantity: 2,
    note: "Không ớt",
    status: "done",
    date: "2026-04-09",
    pickupType: "Lấy liền",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 8,
    name: "Cơm chiên",
    price: 27000,
    quantity: 1,
    note: "",
    status: "cancel",
    date: "2026-04-08",
    pickupType: "Ra chơi lấy",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 9,
    name: "Bún riêu",
    price: 26000,
    quantity: 2,
    note: "",
    status: "done",
    date: "2026-04-07",
    pickupType: "Ra về lấy",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 10,
    name: "Gỏi cuốn",
    price: 18000,
    quantity: 3,
    note: "Thêm nước chấm",
    status: "pending",
    date: "2026-04-06",
    pickupType: "Lấy liền",
    paymentMethod: "Tiền mặt",
  },

  // 🔥 THÊM 5 DATA
  {
    id: 11,
    name: "Cơm tấm",
    price: 30000,
    quantity: 1,
    note: "",
    status: "done",
    date: "2026-04-05",
    pickupType: "Ra chơi lấy",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 12,
    name: "Cháo gà",
    price: 22000,
    quantity: 2,
    note: "Ít muối",
    status: "pending",
    date: "2026-04-04",
    pickupType: "Ra về lấy",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 13,
    name: "Bún thịt nướng",
    price: 28000,
    quantity: 1,
    note: "",
    status: "done",
    date: "2026-04-03",
    pickupType: "Lấy liền",
    paymentMethod: "Quẹt thẻ",
  },
  {
    id: 14,
    name: "Mì ý",
    price: 35000,
    quantity: 2,
    note: "Thêm phô mai",
    status: "cancel",
    date: "2026-04-02",
    pickupType: "Ra chơi lấy",
    paymentMethod: "Tiền mặt",
  },
  {
    id: 15,
    name: "Trà sữa",
    price: 25000,
    quantity: 3,
    note: "Ít đá",
    status: "pending",
    date: "2026-04-01",
    pickupType: "Ra về lấy",
    paymentMethod: "Quẹt thẻ",
  },
];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8;
const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔥 FORMAT dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
  };

  // 🔥 FILTER RIÊNG
  let filteredOrders = [...ordersData];

  // lọc theo ngày
  if (fromDate && toDate) {
    filteredOrders = filteredOrders.filter(
      (o) => o.date >= fromDate && o.date <= toDate
    );
  }

  // lọc theo status
  if (status !== "all") {
    filteredOrders = filteredOrders.filter(
      (o) => o.status === status
    );
  }

  // 🎨 STATUS UI
  const getStatusUI = (status) => {
    switch (status) {
      case "done":
        return <span className="text-green-600 text-xs">Hoàn thành</span>;
      case "pending":
        return <span className="text-blue-600 text-xs">Đang chế biến</span>;
      case "cancel":
        return <span className="text-red-500 text-xs">Đã hủy</span>;
      default:
        return null;
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const currentOrders = filteredOrders.slice(
  startIndex,
  startIndex + itemsPerPage
);

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">📄 Lịch sử Order</h1>

      {/* FILTER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow">

  {/* DATE */}
  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
    <input
      type="date"
      className="border border-gray-400 px-3 py-2 rounded-lg w-full"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
    <input
      type="date"
      className="border border-gray-400 px-3 py-2 rounded-lg w-full"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>

  {/* STATUS */}
  <div className="flex gap-2 flex-wrap">
    {["all", "done", "pending", "cancel"].map((s) => (
      <button
        key={s}
        onClick={() => setStatus(s)}
        className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap
        ${
          status === s
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {s === "all" && "Tất cả"}
        {s === "done" && "Hoàn thành"}
        {s === "pending" && "Đang chế biến"}
        {s === "cancel" && "Đã hủy"}
      </button>
    ))}
  </div>

</div>

      {/* LIST */}
<div className="space-y-3">

  {currentOrders.map((order) => (
    <div
  key={order.id}
  onClick={() => setSelectedOrder(order)}
className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* IMAGE */}
        <img
  src={banhngot}
  className="w-12 h-12 rounded-lg object-cover"
/>

        {/* INFO */}
        <div>
          <p className="font-medium text-sm">{order.name}</p>
          <p className="text-gray-800 font-semibold text-sm">
            {order.price.toLocaleString()}đ
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">

        {/* QUANTITY */}
        <p className="text-sm text-gray-500">
          Số lượng: {order.quantity}
        </p>

        {/* STATUS */}
        <div className="mt-1">
          {order.status === "done" && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              Completed
            </span>
          )}
          {order.status === "pending" && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              Processing
            </span>
          )}
          {order.status === "cancel" && (
            <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
              Cancelled
            </span>
          )}
        </div>

      </div>

    </div>
  ))}

  {filteredOrders.length === 0 && (
    <p className="text-center text-gray-400">
      Không có đơn hàng
    </p>
  )}

</div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">

  {/* INFO */}
  <p className="text-sm text-gray-500">
    Trang {currentPage} / {totalPages || 1}
  </p>

  {/* BUTTONS */}
  <div className="flex items-center gap-2 flex-wrap justify-center">

    {/* PREV */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
    >
      ←
    </button>

    {/* PAGE NUMBERS */}
    {[...Array(totalPages)].map((_, i) => {
      const page = i + 1;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded-lg text-sm
            ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {page}
        </button>
      );
    })}

    {/* NEXT */}
    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
    >
      →
    </button>

  </div>
</div>

      {selectedOrder && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setSelectedOrder(null)}
  >
    {/* BOX */}
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-[92%] sm:w-[420px] rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]"
    >

      {/* IMAGE */}
      <div className="relative">
        <img
          src={banhngot}
          className="w-full h-44 object-cover"
        />

        {/* CLOSE */}
        <button
          onClick={() => setSelectedOrder(null)}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-sm hover:bg-white"
        >
          ✕
        </button>

        {/* STATUS BADGE */}
        <div className="absolute bottom-3 left-3">
          {selectedOrder.status === "done" && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">
              Hoàn thành
            </span>
          )}
          {selectedOrder.status === "pending" && (
            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
              Đang chế biến
            </span>
          )}
          {selectedOrder.status === "cancel" && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
              Đã hủy
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">

        {/* TITLE + PRICE */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {selectedOrder.name}
          </h2>
          <p className="text-blue-600 font-semibold">
            {selectedOrder.price.toLocaleString()}đ
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-3 text-sm">

          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-gray-400 text-xs">Số lượng</p>
            <p className="font-medium">x{selectedOrder.quantity}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-gray-400 text-xs">Ngày</p>
            <p className="font-medium">
              {formatDate(selectedOrder.date)}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-gray-400 text-xs">Nhận hàng</p>
            <p className="font-medium">
              {selectedOrder.pickupType}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-gray-400 text-xs">Thanh toán</p>
            <p className="font-medium">
              {selectedOrder.paymentMethod}
            </p>
          </div>

        </div>

        {/* NOTE */}
        <div className="bg-yellow-50 p-3 rounded-xl text-sm">
          <p className="text-gray-400 text-xs mb-1">Ghi chú</p>
          <p>
            {selectedOrder.note || "Không có ghi chú"}
          </p>
        </div>

        

      </div>
    </div>
  </div>
)}
    </div>
  );
}