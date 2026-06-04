import axiosInstance from "./axiosConfig";

export const userApi = {
  // Get current user profile
  getMe: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put("/users/me", data);
    return response.data;
  },
};
