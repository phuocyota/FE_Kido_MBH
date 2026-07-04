import { API_BASE_URL } from "./client";

const withApiPrefix = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return API_BASE_URL.endsWith("/api")
    ? `${API_BASE_URL}${normalizedPath}`
    : `${API_BASE_URL}/api${normalizedPath}`;
};

export const API = {
  AUTH: {
    LOGIN_STUDENT: `${API_BASE_URL}/auth/login/student`,
  }, 

 
  STUDENT: {
    UPLOAD_AVATAR: `${API_BASE_URL}/upload/single`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_AVATAR: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/users/${id}`,
  },

  PARENT: {
    HOME: withApiPrefix("/parent/home"),
  },

  CUSTOMER: {
    DETAIL: (id) => withApiPrefix(`/customers/${id}`),
  },

  PRODUCTS: {
    FULL: withApiPrefix("/products/full"),
  },

  ORDERS: {
    CANCEL: (id) => withApiPrefix(`/orders/${id}/cancel`),
  },

  CART: {
    CLEAR_ME: withApiPrefix("/cart/me/clear"),
    ADD_ME_ITEM: withApiPrefix("/cart/me/items"),
    COMPLETE_ME: withApiPrefix("/cart/me/complete"),
  },

  MOMO: {
    CREATE: (orderId) => withApiPrefix(`/momo/create/${orderId}`),
    TOPUP: withApiPrefix("/momo/topup"),
  },

  WALLETS: {
    TRANSACTIONS: (customerId) => withApiPrefix(`/wallets/customer/${customerId}/transactions`),
  },

  MEAL_ITEMS: {
    WEEK_PLAN: withApiPrefix("/meal-items/week-plan"),
  },

  CUSTOMER_MEAL_ITEMS: {
    LIST: withApiPrefix("/customer-meal-items"),
    CREATE: withApiPrefix("/customer-meal-items"),
    SELECT_ME: withApiPrefix("/customer-meal-items/me/select"),
    UPDATE: (id) => withApiPrefix(`/customer-meal-items/${id}`),
    DELETE: (id) => withApiPrefix(`/customer-meal-items/${id}`),
  },
};
