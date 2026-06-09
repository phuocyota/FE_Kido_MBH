import axiosInstance from "./axiosConfig";

export const branchApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/branches");
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/branches/${id}`);
    return response.data.data || response.data;
  },
};
