import axiosInstance from "./axiosConfig";

export const customerApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/customers");
    return response.data.data || response.data;
  },

  getAllWithDebt: async () => {
    const response = await axiosInstance.get("/customers", { params: { getDebt: true } });
    return response.data.data || response.data;
  },

  search: async (keyword, limit = 50) => {
    const response = await axiosInstance.get("/customers/search", {
      params: { keyword, limit },
    });
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/customers", data);
    return response.data.data || response.data;
  },
};
