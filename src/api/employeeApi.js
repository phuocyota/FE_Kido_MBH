import axiosInstance from "./axiosConfig";
import { getBranchIdFromToken } from "./authSession";

export const employeeApi = {
  // Get all employees
  getAll: async (status) => {
    const params = { page: 1, size: 100000 };
    if (status && status !== "all") {
      params.status = status;
    }
    const branchId = getBranchIdFromToken();
    if (branchId) {
      params.branchId = branchId;
    }
    const response = await axiosInstance.get("/employees", { params });
    const resData = response.data.data || response.data;
    if (resData && typeof resData === "object" && "data" in resData && Array.isArray(resData.data)) {
      return resData.data;
    }
    return Array.isArray(resData) ? resData : [];
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data.data || response.data;
  },

  // Create new employee
  create: async (data) => {
    const response = await axiosInstance.post("/employees", data);
    return response.data.data || response.data;
  },

  // Update employee
  update: async (id, data) => {
    const response = await axiosInstance.put(`/employees/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete employee
  delete: async (id) => {
    await axiosInstance.delete(`/employees/${id}`);
  },
};
