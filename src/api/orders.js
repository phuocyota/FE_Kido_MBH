import { apiRequest } from "./client";
import { API } from "./endpoint";

const unwrapList = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const normalizeStatus = (status, fallbackStatus) => {
  const nextStatus = String(status || fallbackStatus || "").toUpperCase();

  if (nextStatus === "PENDING_PAYMENT" || nextStatus === "CASH") return "cash";
  if (nextStatus === "PREPARING" || nextStatus === "PENDING") return "pending";
  if (nextStatus === "READY_TO_PICKUP") return "done";
  if (nextStatus === "DONE") return "done";
  if (nextStatus === "CANCELLED" || nextStatus === "CANCELED") return "cancelled";

  return String(fallbackStatus || status || "").toLowerCase();
};

const getOrderItems = (order) =>
  order?.items ||
  order?.orderItems ||
  order?.OrderItems ||
  order?.details ||
  order?.orderDetails ||
  [];

export const normalizeOrderItem = (item) => {
  const product = item.product || item.Product || {};
  const quantity = toNumber(item.quantity ?? item.qty ?? 1);
  const price = toNumber(item.unitPrice ?? item.price ?? product.price);

  return {
    id: item.id || item.productId || product.id,
    productId: item.productId || product.id,
    name: product.name || item.productName || item.name || "Mon",
    price,
    qty: quantity,
    quantity,
    note: item.note || "",
  };
};

export const normalizeOrder = (order, fallbackStatus) => {
  const student = order.student || order.Student || order.user || order.User || {};
  const customer = order.customer || order.Customer || {};
  const createdAt = order.createdAt || order.created_at || order.orderTime;
  const items = getOrderItems(order).map(normalizeOrderItem);
  const total =
    order.total ??
    order.totalAmount ??
    order.amount ??
    items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    ...order,
    id: order.orderNumber || order.code || order.id,
    orderKey: order.id || order.orderId || order.orderNumber || order.code,
    studentId: order.studentId || student.id || student.cardId,
    studentName: customer.fullName || student.name || student.fullName || order.studentName || order.customerName,
    status: normalizeStatus(order.status, fallbackStatus),
    paymentMethod:
      String(order.paymentMethod || "").toUpperCase() === "CASH" ? "cash" : "card",
    pickupType: order.orderType || order.pickupType || order.note || "Lay lien",
    createdAt: createdAt ? new Date(createdAt).getTime() : Date.now(),
    total: toNumber(total),
    items,
  };
};

export const getPendingCashOrders = async () => {
  const response = await apiRequest(API.ORDERS.PENDING_CASH);
  return unwrapList(response).map((order) => normalizeOrder(order, "PENDING_PAYMENT"));
};

export const getPreparingOrders = async () => {
  const response = await apiRequest(API.ORDERS.PREPARING);
  return unwrapList(response).map((order) => normalizeOrder(order, "PREPARING"));
};

export const getDoneOrders = async () => {
  const response = await apiRequest(API.ORDERS.DONE);
  return unwrapList(response).map((order) => normalizeOrder(order, "DONE"));
};

export const getReadyToPickupOrders = async () => {
  const response = await apiRequest(API.ORDERS.READY_TO_PICKUP);
  return unwrapList(response).map((order) => normalizeOrder(order, "READY_TO_PICKUP"));
};

export const getActiveKitchenOrders = async () => {
  const [pendingCashOrders, preparingOrders] = await Promise.all([
    getPendingCashOrders(),
    getPreparingOrders(),
  ]);

  return [...pendingCashOrders, ...preparingOrders];
};

export const getKitchenOrders = async () => {
  const [activeOrders, doneOrders] = await Promise.all([
    getActiveKitchenOrders(),
    getDoneOrders(),
  ]);

  return [...activeOrders, ...doneOrders];
};

export const updateOrderToReadyToPickup = async (orderId) => {
  const response = await apiRequest(API.ORDERS.UPDATE_READY_TO_PICKUP(orderId), {
    method: "PUT",
  });
  return normalizeOrder(response?.data || response, "READY_TO_PICKUP");
};

export const updateOrderToDone = async (orderId) => {
  const response = await apiRequest(API.ORDERS.UPDATE_DONE(orderId), {
    method: "PUT",
  });
  return normalizeOrder(response?.data || response, "DONE");
};

export const receiveCashPayment = async (orderId) => {
  const response = await apiRequest(API.ORDERS.RECEIVE_CASH(orderId), {
    method: "POST",
  });
  return normalizeOrder(response?.data || response, "PREPARING");
};
