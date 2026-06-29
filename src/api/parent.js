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
  { reason = "Phu huynh yeu cau huy don", isRefunded = true } = {}
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
