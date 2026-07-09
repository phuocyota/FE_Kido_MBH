import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const stockTransferApi = {
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.fromBranchId) params.fromBranchId = filters.fromBranchId;
    if (filters.toBranchId) params.toBranchId = filters.toBranchId;
    const response = await axiosInstance.get("/stock-transfers", { params });
    return unwrap(response);
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/stock-transfers/${id}`);
    return unwrap(response);
  },

  create: async (data) => {
    const response = await axiosInstance.post("/stock-vouchers", data);
    return unwrap(response);
  },

  complete: async (id) => {
    const response = await axiosInstance.post(`/stock-transfers/${id}/complete`);
    return unwrap(response);
  },
};
