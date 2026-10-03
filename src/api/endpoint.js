import { API_BASE_URL } from "./client";

export const API = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGIN_STUDENT: `${API_BASE_URL}/auth/login/student`,
    LOGIN_CASHIER: `${API_BASE_URL}/auth/login/cashier`,
  },
  PRODUCTS: {
    FULL: `${API_BASE_URL}/products/full`,
  },
  CART: {
    ME: `${API_BASE_URL}/cart/me`,
    ITEMS: `${API_BASE_URL}/cart/me/items`,
    ITEM: (itemId) => `${API_BASE_URL}/cart/me/items/${itemId}`,
    COMPLETE: `${API_BASE_URL}/cart/me/complete`,
  },
  ORDERS: {
    PENDING_CASH: `${API_BASE_URL}/orders/pending-cash`,
    PREPARING: `${API_BASE_URL}/orders/preparing`,
    READY_TO_PICKUP: `${API_BASE_URL}/orders/ready-to-pickup`,
    DONE: `${API_BASE_URL}/orders?status=DONE`,
    UPDATE_STATUS: (id, status) => `${API_BASE_URL}/orders/${id}/${status}`,
    UPDATE_READY_TO_PICKUP: (id) => `${API_BASE_URL}/orders/${id}/ready-to-pickup`,
    UPDATE_DONE: (id) => `${API_BASE_URL}/orders/${id}/done`,
    RECEIVE_CASH: (id) => `${API_BASE_URL}/orders/${id}/receive-cash`,
  },
  GRADE: {
    GET_ALL: `${API_BASE_URL}/grade?isGetAllDetail=true`,

  },
  EXAM_SET: {
    DETAIL: (id) => `${API_BASE_URL}/exam-set/${id}`,
    GET_BY_SUBJECT: (subjectId) =>
    `${API_BASE_URL}/exam-set?subjectId=${subjectId}`,

  

  },
  STUDENT: {
    UPLOAD_AVATAR: `${API_BASE_URL}/upload/single`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_AVATAR: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/users/${id}`,
    LOGIN:
      `${API_BASE_URL}/auth/login/student`,
  },
  ATTEMPT: {
    START: `${API_BASE_URL}/attempt/start`,
    SUBMIT: (attemptId) => `${API_BASE_URL}/attempt/${attemptId}/end`,
    REVIEW: (attemptId) => `${API_BASE_URL}/attempt/${attemptId}/review`,
    EXAM_HISTORY: (fromDate, toDate) =>
      `${API_BASE_URL}/attempt/exam-history?fromDate=${fromDate}&toDate=${toDate}`,

     LIST: (questionBankId, examSetId, page = 1, size = 1000, status = "SUBMITTED") =>
  `${API_BASE_URL}/attempt?questionBankId=${questionBankId}&examSetId=${examSetId}&status=${status}&page=${page}&size=${size}`,
  },

   // 👇 THÊM CATEGORY
  CATEGORY: {
    GET_FULL:
      `${API_BASE_URL}/products/full`,
  },
};
