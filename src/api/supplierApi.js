import axiosInstance from "./axiosConfig";

export const supplierApi = {
  // Get all suppliers with optional filters
  getAll: async (status, search) => {
    const params = {};
    if (status && status !== "all") {
      params.status = status;
    }
    if (search) {
      params.search = search;
    }
    const response = await axiosInstance.get("/suppliers", { params });
    return response.data.data || response.data;
  },

  // Get supplier by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/suppliers/${id}`);
    return response.data.data || response.data;
  },

  // Create new supplier
  create: async (data) => {
    const response = await axiosInstance.post("/suppliers", data);
    return response.data.data || response.data;
  },

  // Update supplier
  update: async (id, data) => {
    const response = await axiosInstance.put(`/suppliers/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete supplier
  delete: async (id) => {
    await axiosInstance.delete(`/suppliers/${id}`);
  },
};
