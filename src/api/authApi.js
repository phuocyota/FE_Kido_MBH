import axiosInstance from "./axiosConfig";

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login/admin", { email, password });
    const { accessToken, userId, userType } = response.data.data;
    
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", userType);
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  getToken: () => {
    return localStorage.getItem("accessToken");
  },

  getUserInfo: () => {
    return {
      userId: localStorage.getItem("userId"),
      role: localStorage.getItem("role"),
    };
  },
};
