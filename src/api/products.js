import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getProductsFull = async ({ branchId } = {}) => {
  const params = new URLSearchParams();

  if (branchId) {
    params.set("branchId", branchId);
  }

  const query = params.toString();
  const res = await apiRequest(query ? `${API.PRODUCTS.FULL}?${query}` : API.PRODUCTS.FULL);

  return res?.data ?? res;
};
