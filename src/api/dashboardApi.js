import axiosInstance from "./axiosConfig";

export const dashboardApi = {
  // Get revenue statistics
  // filter: 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth'
  getRevenueStats: async (filter = "7days", branchId) => {
    const params = { filter };
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/dashboard/revenue", { params });
    return response.data;
  },

  // Get customer statistics
  // filter: 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth'
  getCustomerStats: async (filter = "7days", branchId) => {
    const params = { filter };
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/dashboard/customers", { params });
    return response.data;
  },

  getMenuPerformance: async ({ filter = "7days", groupBy = "category", branchId, from, to } = {}) => {
    const params = { filter, groupBy };
    if (branchId) {
      params.branchId = branchId;
    }
    if (from) {
      params.from = from;
    }
    if (to) {
      params.to = to;
    }
    const response = await axiosInstance.get("/api/reports/menu-performance", { params });
    return response.data;
  },
};
