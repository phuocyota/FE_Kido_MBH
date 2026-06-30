import axiosInstance from "./axiosConfig";

export const mealItemApi = {
  // Get meal items with filters (branchId, mealPeriod, status)
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.branchId) params.branchId = filters.branchId;
    if (filters.mealPeriod) params.mealPeriod = filters.mealPeriod;
    if (filters.status) params.status = filters.status;
    
    const response = await axiosInstance.get("/meal-items", { params });
    // BE returns data wrapped in data: { data: [...] } if standard structure applies
    return response.data.data || response.data;
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
