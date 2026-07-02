import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const reportApi = {
  // Revenue summary
  getRevenue: async (from, to, branchId) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/revenue", { params });
    return unwrap(response);
  },

  // Daily revenue
  getDailyRevenue: async (from, to, branchId) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/revenue/daily", { params });
    return unwrap(response);
  },

  getCustomerStats: async (filter = "7days", branchId) => {
    const params = { filter };
    if (branchId) params.branchId = branchId;

    const response = await axiosInstance.get("/reports/customer", { params });
    return unwrap(response);
  },

  // Top selling products
  getTopProducts: async (from, to, branchId, limit = 10) => {
    const params = { limit };
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/top-products", { params });
    return unwrap(response);
  },

  // Bottom selling products
  getBottomProducts: async (from, to, branchId, limit = 10) => {
    const params = { limit };
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/bottom-products", { params });
    return unwrap(response);
  },

  // End of day report
  getEndOfDay: async (from, to, branchId) => {
    const params = { from, to };
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/end-of-day", { params });
    return unwrap(response);
  },

  // Inventory report
  getInventory: async (branchId) => {
    const params = {};
    if (branchId) params.branchId = branchId;
    
    const response = await axiosInstance.get("/reports/inventory", { params });
    return unwrap(response);
  },

  // Shift summary
  getShiftSummary: async (shiftId) => {
    const response = await axiosInstance.get(`/reports/shifts/${shiftId}/summary`);
    return unwrap(response);
  },

  // Monthly order plan (Ke hoach dat hang hoa trong Thang)
  getMonthlyOrderPlan: async (month, from, to, branchId, minRate, maxRate) => {
    const params = {};
    if (month) params.month = month;
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    if (minRate !== undefined) params.minRate = minRate;
    if (maxRate !== undefined) params.maxRate = maxRate;

    const response = await axiosInstance.get("/reports/monthly-order-plan", { params });
    return unwrap(response);
  },

  getEmployeeReport: async ({ filter = "7days", from, to, branchId, employeeId, limit = 10 } = {}) => {
    const params = { filter, limit };
    if (from) params.from = from;
    if (to) params.to = to;
    if (branchId) params.branchId = branchId;
    if (employeeId && employeeId !== "all") params.employeeId = employeeId;

    const response = await axiosInstance.get("/reports/employee", { params });
    return unwrap(response);
  },
};
