import { io } from "socket.io-client";
import { BASE_URL } from "./client";
import { getAccessToken } from "./session";

// Phải khớp với BE: src/modules/socket/socket-events.constant.ts
export const SOCKET_EVENTS = {
  CUSTOMER_DEBT_PAID: "customer:debt-paid",
  ORDER_CREATED: "order:created",
  ORDER_UPDATED: "order:updated",
  ORDER_STATUS_CHANGED: "order:status-changed",
  ORDER_ITEM_ADDED: "order:item-added",
  ORDER_PAYMENT_RECEIVED: "order:payment-received",
  ORDER_PAID: "order:paid",
  ORDER_PREPARING: "order:preparing",
  ORDER_READY_TO_PICKUP: "order:ready-to-pickup",
  ORDER_COMPLETED: "order:completed",
  ORDER_CANCELLED: "order:cancelled",
  ORDER_REFUNDED: "order:refunded",
  ORDER_DELETED: "order:deleted",
  DASHBOARD_UPDATED: "dashboard:updated",
  KITCHEN_TICKET_CREATED: "kitchen:ticket.created",
  KITCHEN_TICKET_UPDATED: "kitchen:ticket.updated",
  KITCHEN_BATCH_UPDATED: "kitchen:batch.updated",
  KITCHEN_MEAL_PLAN_LOCKED: "kitchen:meal-plan.locked",
  KITCHEN_CONSUMPTION_UPDATED: "kitchen:consumption.updated",
};

// Mọi event làm danh sách đơn của bếp/thu ngân thay đổi.
export const ORDER_LIST_EVENTS = [
  SOCKET_EVENTS.ORDER_CREATED,
  SOCKET_EVENTS.ORDER_UPDATED,
  SOCKET_EVENTS.ORDER_STATUS_CHANGED,
  SOCKET_EVENTS.ORDER_ITEM_ADDED,
  SOCKET_EVENTS.ORDER_PAYMENT_RECEIVED,
  SOCKET_EVENTS.ORDER_PAID,
  SOCKET_EVENTS.ORDER_PREPARING,
  SOCKET_EVENTS.ORDER_READY_TO_PICKUP,
  SOCKET_EVENTS.ORDER_COMPLETED,
  SOCKET_EVENTS.ORDER_CANCELLED,
  SOCKET_EVENTS.ORDER_REFUNDED,
  SOCKET_EVENTS.ORDER_DELETED,
  SOCKET_EVENTS.KITCHEN_TICKET_CREATED,
  SOCKET_EVENTS.KITCHEN_TICKET_UPDATED,
];

// URL socket: VITE_SOCKET_URL > VITE_API_URL (BASE_URL) > cùng origin
// (dev không có VITE_API_URL thì đi qua proxy /socket.io trong vite.config.js).
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || BASE_URL || window.location.origin).replace(/\/$/, "");
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

let socket = null;
let socketToken = null;

/**
 * Trả về socket dùng chung, kết nối bằng access token hiện tại.
 * Nếu token đổi (đăng nhập lại) thì tạo kết nối mới.
 */
export const getSocket = () => {
  const token = getAccessToken();
  if (!token) {
    disconnectSocket();
    return null;
  }

  if (socket && socketToken === token) {
    if (!socket.connected && !socket.active) socket.connect();
    return socket;
  }

  disconnectSocket();
  socketToken = token;
  socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ["websocket", "polling"],
    // Gọi lại mỗi lần (re)connect để luôn lấy token mới nhất
    auth: (cb) => cb({ token: getAccessToken() }),
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }
  socket = null;
  socketToken = null;
};

/** Join room đơn hàng (theo chi nhánh/đơn cụ thể). BE tự giới hạn theo branch trong JWT. */
export const joinOrders = (payload = {}) =>
  new Promise((resolve) => {
    const s = getSocket();
    if (!s) return resolve({ ok: false, error: "NO_TOKEN" });
    s.timeout(5000).emit("orders:join", payload, (err, res) =>
      resolve(err ? { ok: false, error: "TIMEOUT" } : res)
    );
  });

export const leaveOrders = (payload = {}) => {
  if (socket?.connected) socket.emit("orders:leave", payload);
};
