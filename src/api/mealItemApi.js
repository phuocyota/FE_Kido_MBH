import axiosInstance from "./axiosConfig";

export const mealItemApi = {
  // Get meal items with filters (branchId, mealPeriod, status)
  getAll: async (filters = {}) => {
    const params = { page: 1, size: 100000, ...filters };
    
    const response = await axiosInstance.get("/meal-items", { params });
    const resData = response.data.data || response.data;
    if (resData && typeof resData === "object" && "data" in resData && Array.isArray(resData.data)) {
      return resData.data;
    }
    return Array.isArray(resData) ? resData : [];
  },

  // Get meal item details by id
  getById: async (id) => {
    const response = await axiosInstance.get(`/meal-items/${id}`);
    return response.data.data || response.data;
  },

  // Create new meal item
  create: async (data) => {
    const response = await axiosInstance.post("/meal-items", data);
    return response.data.data || response.data;
  },

  // Update existing meal item
  update: async (id, data) => {
    const response = await axiosInstance.put(`/meal-items/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete meal item
  delete: async (id) => {
    await axiosInstance.delete(`/meal-items/${id}`);
  },
};
