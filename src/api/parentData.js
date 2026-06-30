const COMPLETED_STATUSES = new Set(["COMPLETED", "RECEIVED", "DELIVERED", "PAID"]);
const READY_STATUSES = new Set(["DONE", "READY", "PREPARED"]);
const PAYMENT_STATUSES = new Set(["CASH", "WAITING_PAYMENT", "PENDING_PAYMENT"]);
const CANCELLED_STATUSES = new Set(["CANCELLED", "CANCELED", "FAILED", "REJECTED"]);

export const mapParentStatus = (status) => {
  const value = String(status || "").toUpperCase();

  if (COMPLETED_STATUSES.has(value)) return "completed";
  if (READY_STATUSES.has(value)) return "ready";
  if (PAYMENT_STATUSES.has(value)) return "payment";
  if (CANCELLED_STATUSES.has(value)) return "cancel";

  return "pending";
};

const toTimestamp = (value) => {
  const time = value ? new Date(value).getTime() : 0;

  return Number.isNaN(time) ? 0 : time;
};

export const normalizeParentHistory = (homeData) => {
  const orders = [];
  const todayOrder = homeData?.todayOrder;

  if (todayOrder?.items?.length) {
    todayOrder.items.forEach((item) => {
      const quantity = Number(item.quantity || 1);
      const totalPrice = Number(item.totalPrice ?? todayOrder.totalAmount ?? 0);
      const unitPrice = Number(item.unitPrice ?? (totalPrice / quantity || 0));

      orders.push({
        id: item.id || `${todayOrder.id}-${item.name}`,
        orderId: todayOrder.id,
        name: item.name || "Order",
        price: unitPrice,
        quantity,
        note: item.note || "",
        status: mapParentStatus(todayOrder.status),
        statusText: todayOrder.statusText,
        date: todayOrder.orderedAt || todayOrder.createdAt,
        pickupType: todayOrder.pickupType || "",
        paymentMethod: todayOrder.paymentMethod || "Ví",
        isFoodOrder: true,
      });
    });
  }

  (homeData?.recentHistory || []).forEach((item) => {
    const amount = Math.abs(Number(item.amount || 0));

    orders.push({
      id: item.id,
      orderId: item.orderId,
      name: item.title || item.type || "Giao dịch",
      price: amount,
      quantity: 1,
      note: "",
      status: mapParentStatus(item.status),
      statusText: item.statusText,
      date: item.createdAt,
      pickupType: "",
      paymentMethod: item.type === "TOPUP" ? "Nạp tiền" : "Ví",
    });
  });

  return orders.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
};
