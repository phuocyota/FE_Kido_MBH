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
<<<<<<< HEAD
    const { accessToken, userId, userType } = response.data.data;
=======
    const payload = response.data || {};
    const accessToken = findAuthValue(payload, [
      "accessToken",
      "access_token",
      "access-token",
      "token",
      "jwt",
    ]);
    const userId = findAuthValue(payload, ["userId", "user_id", "id"]);
    const userType = findAuthValue(payload, ["userType", "user_type", "role"]);
>>>>>>> 57781e6161c7eeda0ef5a3bd372575c204a76ac8
    
    saveAuthSession({ accessToken, userId, role: userType });

    if (import.meta.env.DEV) {
      console.log("Login token saved:", Boolean(accessToken));
    }
    
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
