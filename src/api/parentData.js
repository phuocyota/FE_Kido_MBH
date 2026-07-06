export const ORDER_STATUS = {
  CANCELLED: 0,
  PREPARING: 1,
  PENDING: 2,
  PENDING_PAYMENT: 3,
  READY_TO_PICKUP: 4,
  DONE: 5,
  REFUNDED: 6,
  DRAFT: 7,
  WAITING: 8,
  READY: 9,
  RECEIVED: 10,
  COMPLETED: 11,
};

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

const COMPLETED_STATUSES = new Set(["COMPLETED", "RECEIVED", "DELIVERED", "PAID"]);
const READY_STATUSES = new Set(["DONE", "READY", "PREPARED"]);
const PAYMENT_STATUSES = new Set(["CASH", "WAITING_PAYMENT", "PENDING_PAYMENT"]);
const CANCELLED_STATUSES = new Set(["CANCELLED", "CANCELED", "FAILED", "REJECTED"]);

export const mapParentStatus = (status) => {
  const numValue = status !== null && status !== undefined ? Number(status) : NaN;

  if (!Number.isNaN(numValue)) {
    if (numValue === ORDER_STATUS.RECEIVED || numValue === ORDER_STATUS.COMPLETED) {
      return "completed";
    }
    if (numValue === ORDER_STATUS.READY || numValue === ORDER_STATUS.READY_TO_PICKUP || numValue === ORDER_STATUS.DONE) {
      return "ready";
    }
    if (numValue === ORDER_STATUS.PENDING_PAYMENT || numValue === ORDER_STATUS.DRAFT) {
      return "payment";
    }
    if (numValue === ORDER_STATUS.CANCELLED || numValue === ORDER_STATUS.REFUNDED) {
      return "cancel";
    }
    return "pending"; // PREPARING, PENDING, WAITING
  }

  const value = String(status ?? "").toUpperCase();

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
    if (todayOrder && item.orderId === todayOrder.id) {
      return;
    }
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
