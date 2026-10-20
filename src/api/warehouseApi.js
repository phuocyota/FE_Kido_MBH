import axiosInstance from "./axiosConfig";
import { getBranchIdFromToken } from "./authSession";

export const warehouseApi = {
  getKitchenShortages: async (date, signal) => {
    const response = await axiosInstance.get('/kitchen/staff-overview', {
      params: { date, branchId: getBranchIdFromToken() || undefined }, signal,
    });
    const payload = response.data?.data ?? response.data;
    if (!Array.isArray(payload?.shortages)) throw new Error('Không đọc được danh sách nguyên liệu thiếu.');
    return { date: payload.date, shortages: payload.shortages };
  },
  get: async (path, params = {}, signal) => {
    const response = await axiosInstance.get(`/warehouse/${path}`, {
      params: { branchId: getBranchIdFromToken() || undefined, ...params },
      signal,
    });
    return response.data?.data ?? response.data;
  },
};
