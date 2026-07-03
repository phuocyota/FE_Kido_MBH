import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getProductsFull = async ({ branchId, maxPrice, isCanteenItem } = {}) => {
  const params = new URLSearchParams();

  if (branchId) {
    params.set("branchId", branchId);
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    params.set("maxPrice", maxPrice);
  }

  if (isCanteenItem !== undefined && isCanteenItem !== null) {
    params.set("isCanteenItem", isCanteenItem);
  }

  // Set size to 1000 to fetch all active categories from the backend pagination default
  params.set("size", "1000");

  const query = params.toString();
  const res = await apiRequest(query ? `${API.PRODUCTS.FULL}?${query}` : API.PRODUCTS.FULL);

  const data = res?.data ?? res;
  if (data && typeof data === "object" && Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};
