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
 
};
