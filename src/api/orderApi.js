import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getOrderStatusLogs = async (orderId) => {
  const res = await apiRequest(API.ORDERS.STATUS_LOGS(orderId));
  return res?.data ?? res;
};
