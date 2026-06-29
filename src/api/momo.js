import { apiRequest } from "./client";
import { API } from "./endpoint";

export const createMomoPayment = async (orderId) => {
  const res = await apiRequest(API.MOMO.CREATE(orderId), {
    method: "POST",
  });

  return res?.data ?? res;
};

export const createMomoTopup = async (customerId, amount) => {
  const res = await apiRequest(API.MOMO.TOPUP, {
    method: "POST",
    body: JSON.stringify({ customerId, amount }),
  });

  return res?.data ?? res;
};
