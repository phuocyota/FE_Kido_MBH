import axiosInstance from "./axiosConfig";
import { clearAuthSession, getAccessToken, hasValidAuthSession, saveAuthSession } from "./authSession";

const findAuthValue = (source, keys) => {
  if (!source || typeof source !== "object") return null;

  for (const key of keys) {
    if (source[key]) return source[key];
  }

  for (const value of Object.values(source)) {
    const nestedValue = findAuthValue(value, keys);
    if (nestedValue) return nestedValue;
  }

  return null;
};

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login/admin", { email, password });
    const { accessToken, userId, userType } = response.data.data;
    
    saveAuthSession({ accessToken, userId, role: userType });

    return response.data;
  },

  logout: () => {
    clearAuthSession();
  },

  isAuthenticated: () => {
    return hasValidAuthSession();
  },

  getToken: () => {
    return getAccessToken();
  },

  getUserInfo: () => {
    return {
      userId: localStorage.getItem("userId"),
      role: localStorage.getItem("role"),
    };
  },
};
