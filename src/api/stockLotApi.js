import axiosInstance from "./axiosConfig";
import { getBranchIdFromToken } from "./authSession";

const unwrap = (response) => response.data?.data ?? response.data;

export const stockLotApi = {
  suggestFefo: async (params, signal) => unwrap(await axiosInstance.get('/stock-lots/fefo', {
    params: { branchId: getBranchIdFromToken() || undefined, ...params }, signal,
  })),
  searchTrace: async (id, page = 1, signal) => {
    const response = await axiosInstance.get("/production-trace/lookup", {
      params: { search: id, page, branchId: getBranchIdFromToken() || undefined },
      signal,
    });
    return unwrap(response);
  },
  lookup: async (id, signal) => {
    const response = await axiosInstance.get("/production-trace/lookup", { params: { id, branchId: getBranchIdFromToken() || undefined }, signal });
    return unwrap(response);
  },
  getAll: async (params, signal) => {
    const response = await axiosInstance.get("/stock-lots", {
      params: { branchId: getBranchIdFromToken() || undefined, ...params }, signal,
    });
    // The global response wrapper contains the API's paginated object.
    const payload = Array.isArray(response.data?.data) && response.data?.total !== undefined
      ? response.data : unwrap(response);
    return { items: payload.data || [], total: Number(payload.total || 0) };
  },
  enableEmptyProductTracking: async (productId, branchId) => {
    const response = await axiosInstance.get("/stock-lots/opening-preview", { params: { productId, branchId } });
    const preview = unwrap(response);
    if (preview.requiresAdmin || preview.stockAllocations?.some((row) => Number(row.quantity) !== 0)) {
      throw new Error("Hàng đang có tồn chưa phân lô. Cần phân bổ tồn đầu theo lô trước khi bật theo dõi lô.");
    }
    const allocations = (preview.stockAllocations || []).filter((row) => row.branchId === branchId);
    const result = await axiosInstance.post("/stock-lots/opening", {
      productId, branchId, requestId: crypto.randomUUID(),
      ...(allocations.length ? { stockAllocations: allocations.map((row) => ({ stockId: row.stockId, lots: [{ quantity: 0 }] })) } : { lots: [{ quantity: 0 }] }),
    });
    return unwrap(result);
  },
  getTrace: async (id, signal) => {
    const result = await stockLotApi.lookup(id, signal);
    if (result.type !== "LOT") throw new Error("ID không phải lô hàng.");
    return result.trace;
  },
};
