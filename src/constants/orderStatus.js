// BE Order Status (numeric) → FE Display Status
export const ORDER_STATUS_BE = {
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

// FE Kitchen Display Status
export const KITCHEN_DISPLAY_STATUS = {
  CASH: "cash",           // Chờ thanh toán
  PENDING: "pending",     // Chờ chế biến
  DONE: "done",           // Chờ lấy món / Hoàn thành
  CANCELLED: "cancelled",
};

// BE Status Code → FE Kitchen Display Status
export const BE_TO_FE_STATUS_MAP = {
  [ORDER_STATUS_BE.CANCELLED]: KITCHEN_DISPLAY_STATUS.CANCELLED,
  [ORDER_STATUS_BE.PREPARING]: KITCHEN_DISPLAY_STATUS.PENDING,
  [ORDER_STATUS_BE.PENDING]: KITCHEN_DISPLAY_STATUS.PENDING,
  [ORDER_STATUS_BE.PENDING_PAYMENT]: KITCHEN_DISPLAY_STATUS.CASH,
  [ORDER_STATUS_BE.READY_TO_PICKUP]: KITCHEN_DISPLAY_STATUS.DONE,
  [ORDER_STATUS_BE.DONE]: KITCHEN_DISPLAY_STATUS.DONE,
};

// BE Status Name (string) → FE Kitchen Display Status
export const BE_NAME_TO_FE_STATUS_MAP = {
  CANCELLED: KITCHEN_DISPLAY_STATUS.CANCELLED,
  PREPARING: KITCHEN_DISPLAY_STATUS.PENDING,
  PENDING: KITCHEN_DISPLAY_STATUS.PENDING,
  PENDING_PAYMENT: KITCHEN_DISPLAY_STATUS.CASH,
  READY_TO_PICKUP: KITCHEN_DISPLAY_STATUS.DONE,
  DONE: KITCHEN_DISPLAY_STATUS.DONE,
  CASH: KITCHEN_DISPLAY_STATUS.CASH,
};

/**
 * Normalize BE status to FE kitchen display status
 * @param {number|string} status - BE status (number or string)
 * @param {string} fallbackStatus - Fallback status if not found
 * @returns {string} FE kitchen display status
 */
export const normalizeOrderStatus = (status, fallbackStatus) => {
  // Handle numeric status from API
  const numericStatus = Number(status);
  if (Number.isInteger(numericStatus)) {
    const mapped = BE_TO_FE_STATUS_MAP[numericStatus];
    if (mapped) return mapped;
  }

  // Handle string status
  const upperStatus = String(status || "").toUpperCase();
  const mapped = BE_NAME_TO_FE_STATUS_MAP[upperStatus];
  if (mapped) return mapped;

  // Fallback
  return String(fallbackStatus || status || "").toLowerCase();
};
