import axiosInstance from "./axiosConfig";

export const walletApi = {
  // Get all wallet transactions across all customers with search and type filters
  getTransactions: async ({ page = 1, size = 15, search = "", type = "" } = {}) => {
    const params = { page, size };
    if (search) params.search = search;
    if (type) params.type = type;
    const response = await axiosInstance.get("/wallet-transactions", { params });
    return response.data.data || response.data;
  },
};
