import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const dashboardApi = {
  // Get revenue statistics
  // filter: 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth'
  getRevenueStats: async (filter = "7days", branchId) => {
    const params = { filter };
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/dashboard/revenue", { params });
    return unwrap(response);
  },

  // Get customer statistics
  // filter: 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth'
  getCustomerStats: async (filter = "7days", branchId) => {
    const params = { filter };
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/dashboard/customers", { params });
    return unwrap(response);
  },

  getRecentActivities: async ({ limit = 10, branchId } = {}) => {
    const params = { limit };
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/dashboard/recent-activities", { params });
    return unwrap(response);
  },

  getEmployeeAttendance: async (filter = "today") => {
    const response = await axiosInstance.get("/dashboard/employee-attendance", {
      params: { filter },
    });
    return unwrap(response);
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
    const response = await axiosInstance.get("/reports/menu-performance", { params });
    return unwrap(response);
  },

  getCancellations: async ({ filter = "7days", branchId, from, to } = {}) => {
    const params = { filter };
    if (branchId) {
      params.branchId = branchId;
    }
    if (from) {
      params.from = from;
    }
    if (to) {
      params.to = to;
    }
    const response = await axiosInstance.get("/reports/cancellations", { params });
    return unwrap(response);
  },
};
