import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getParentHome = async () => {
  const res = await apiRequest(API.PARENT.HOME);

  return res?.data ?? res;
};

export const getCustomer = async (customerId) => {
  const res = await apiRequest(API.CUSTOMER.DETAIL(customerId));

  return res?.data ?? res;
};

export const updateCustomerAdvanceAmount = async (customerId, amount) => {
  const customer = await getCustomer(customerId);

  const payload = {
    customerCode: customer.customerCode,
    fullName: customer.fullName,
    phone: customer.phone || undefined,
    type: customer.type,
    status: customer.status,
    debtLimit: amount,
  };

  const res = await apiRequest(API.CUSTOMER.DETAIL(customerId), {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return res?.data ?? res;
};

export const cancelParentOrder = async (
  orderId,
  { reason = "Phụ huynh yêu cầu hủy đơn", isRefunded = true } = {}
) => {
  const res = await apiRequest(API.ORDERS.CANCEL(orderId), {
    method: "PUT",
    body: JSON.stringify({
      reason,
      isRefunded,
    }),
  });

  return res?.data ?? res;
};

export const getWalletTransactions = async (customerId, page = 1, size = 50) => {
  const res = await apiRequest(
    API.WALLETS.TRANSACTIONS(customerId) + `?page=${page}&size=${size}`
  );

  return res?.data ?? res;
};

export const getMealItems = async ({ from, to, level, status = "ACTIVE" }) => {
  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);
  if (level) query.append("level", level);
  if (status) query.append("status", status);

  const res = await apiRequest(`${API.MEAL_ITEMS.WEEK_PLAN}?${query.toString()}`);
  return res?.data ?? res;
};

export const createCustomerMealItem = async (payload) => {
  const res = await apiRequest(API.CUSTOMER_MEAL_ITEMS.CREATE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?.data ?? res;
};

export const updateCustomerMealItem = async (id, payload) => {
  const res = await apiRequest(API.CUSTOMER_MEAL_ITEMS.UPDATE(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res?.data ?? res;
};

export const deleteCustomerMealItem = async (id) => {
  const res = await apiRequest(API.CUSTOMER_MEAL_ITEMS.DELETE(id), {
    method: "DELETE",
  });
  return res?.data ?? res;
};

export const selectCustomerMealItemMe = async (payload) => {
  const res = await apiRequest(API.CUSTOMER_MEAL_ITEMS.SELECT_ME, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?.data ?? res;
};

