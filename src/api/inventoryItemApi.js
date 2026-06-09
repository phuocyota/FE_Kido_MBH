import axiosInstance from "./axiosConfig";

export const inventoryItemApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/inventory-items");
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/inventory-items/${id}`);
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/inventory-items", data);
    return response.data.data || response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/inventory-items/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    await axiosInstance.delete(`/inventory-items/${id}`);
  },
};
