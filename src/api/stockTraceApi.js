import axiosInstance from "./axiosConfig";

export const stockTraceApi = {
  getFull: async (lotId, signal) => {
    const response = await axiosInstance.get("/stock-trace/full", {
      params: { lotId, includeMovements: false, includeConsumption: false, includeRecipe: false, includeTimeline: false }, signal,
    });
    return response.data?.data ?? response.data;
  },
};
