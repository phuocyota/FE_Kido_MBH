import axiosInstance from "./axiosConfig";

export const employeeApi = {
  // Get all employees
  getAll: async (status) => {
    const params = status && status !== "all" ? { status } : {};
    const response = await axiosInstance.get("/employees", { params });
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (data) => {
    const response = await axiosInstance.post("/employees", data);
    return response.data;
  },

  // Update employee
  update: async (id, data) => {
    const response = await axiosInstance.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    await axiosInstance.delete(`/employees/${id}`);
  },
};
