import axiosInstance from "./axiosConfig";
import { getBranchIdFromToken } from "./authSession";
import { warehouseApi } from "./warehouseApi";

const unwrap = (response) => response.data?.data ?? response.data;

export const stockLotApi = {
  searchTrace: async (id, page = 1, signal) => {
    try {
      return await stockLotApi.lookup(id, signal);
    } catch (error) {
      if (error.response?.status !== 404 || signal?.aborted) throw error;
    }
    const size = 20;
    const [lots, serials] = await Promise.all([
      stockLotApi.getAll({ search: id, page, size }, signal),
      warehouseApi.get("serials", { search: id, page, size }, signal),
    ]);
    return {
      type: "SEARCH",
      lotTotal: lots.total,
      serialTotal: Number(serials.total || 0),
      hasNext: page * size < Math.max(lots.total, Number(serials.total || 0)),
      matches: [
        ...lots.items.map((lot) => ({
          type: "LOT", lotId: lot.id, lotCode: lot.lotCode,
          productName: lot.product?.name, stockName: lot.stock?.name,
        })),
        ...(serials.data || []).map((serial) => ({ ...serial, type: "SERIAL" })),
      ],
    };
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
