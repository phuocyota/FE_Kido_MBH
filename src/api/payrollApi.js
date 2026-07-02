import axiosInstance from "./axiosConfig";

export const payrollApi = {
  // Get all payrolls with optional status filter
  getAll: async (status) => {
    const params = {};
    if (status && status !== "all") {
      params.status = status;
    }
    const response = await axiosInstance.get("/payrolls", { params });
    return response.data.data || response.data;
  },

  // Get payroll by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/payrolls/${id}`);
    return response.data.data || response.data;
  },

  // Create new payroll
  create: async (data) => {
    const response = await axiosInstance.post("/payrolls", data);
    return response.data.data || response.data;
  },

  // Update payroll
  update: async (id, data) => {
    const response = await axiosInstance.put(`/payrolls/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete payroll
  delete: async (id) => {
    await axiosInstance.delete(`/payrolls/${id}`);
  },
};
