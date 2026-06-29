import { apiRequest } from "./client";
import { API } from "./endpoint";

export const clearMyCart = async () => {
  const res = await apiRequest(API.CART.CLEAR_ME, {
    method: "DELETE",
  });

  return res?.data ?? res;
};

export const addMyCartItem = async ({ productId, quantity, note }) => {
  const res = await apiRequest(API.CART.ADD_ME_ITEM, {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
      note,
    }),
  });

  return res?.data ?? res;
};

export const completeMyCart = async ({
  branchId,
  paymentMethod = "WALLET",
  orderType = "TAKEAWAY",
  note,
}) => {
  const res = await apiRequest(API.CART.COMPLETE_ME, {
    method: "POST",
    body: JSON.stringify({
      branchId,
      paymentMethod,
      orderType,
      note,
    }),
  });

  return res?.data ?? res;
};
