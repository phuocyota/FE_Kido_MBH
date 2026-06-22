import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const stockTakeApi = {
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.branchId) params.branchId = filters.branchId;
    const response = await axiosInstance.get("/stock-takes", { params });
    return unwrap(response);
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/stock-takes/${id}`);
    return unwrap(response);
  },

  createDraft: async (data) => {
    const response = await axiosInstance.post("/stock-takes/drafts", data);
    return unwrap(response);
  },

  updateItems: async (id, items) => {
    const response = await axiosInstance.put(`/stock-takes/${id}/items`, { items });
    return unwrap(response);
  },

  complete: async (id) => {
    const response = await axiosInstance.post(`/stock-takes/${id}/complete`);
    return unwrap(response);
  },
};
