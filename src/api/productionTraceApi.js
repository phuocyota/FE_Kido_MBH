import axiosInstance from "./axiosConfig";

const unwrap = ({ data }) =>
  Array.isArray(data?.data) && data?.total !== undefined
    ? data
    : (data?.data ?? data);

export const productionTraceApi = {
  getOrderProduct: async (orderId, productId, page, signal) =>
    unwrap(
      await axiosInstance.get(
        `/production-trace/orders/${encodeURIComponent(orderId)}/products/${encodeURIComponent(productId)}`,
        { params: { page, size: 20 }, signal },
      ),
    ),
  getBatch: async (batchId, signal) =>
    unwrap(
      await axiosInstance.get(
        `/production-trace/batches/${encodeURIComponent(batchId)}`,
        { signal },
      ),
    ),
  getLabels: async (batchId, page, signal) =>
    unwrap(
      await axiosInstance.get(
        `/production-trace/batches/${encodeURIComponent(batchId)}/labels`,
        { params: { page, size: 20 }, signal },
      ),
    ),
};
