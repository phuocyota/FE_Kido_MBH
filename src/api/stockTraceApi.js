import axiosInstance from "./axiosConfig";

export const stockTraceApi = {
  getFull: async (lotId, signal) => {
    const response = await axiosInstance.get("/stock-trace/full", {
      params: { lotId, includeMovements: true, includeConsumption: true, includeRecipe: true, includeTimeline: true }, signal,
    });
    return response.data?.data ?? response.data;
  },
};
