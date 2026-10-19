import axiosInstance from "./axiosConfig";
import { getBranchIdFromToken } from "./authSession";

export const warehouseApi = {
  get: async (path, params = {}, signal) => {
    const response = await axiosInstance.get(`/warehouse/${path}`, {
      params: { branchId: getBranchIdFromToken() || undefined, ...params },
      signal,
    });
    return response.data?.data ?? response.data;
  },
};
