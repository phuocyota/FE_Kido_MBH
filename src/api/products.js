import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getProductsFull = async ({ branchId, maxPrice } = {}) => {
  const params = new URLSearchParams();

  if (branchId) {
    params.set("branchId", branchId);
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    params.set("maxPrice", maxPrice);
  }

  const query = params.toString();
  const res = await apiRequest(query ? `${API.PRODUCTS.FULL}?${query}` : API.PRODUCTS.FULL);

  return res?.data ?? res;
};
