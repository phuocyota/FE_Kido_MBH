import axiosInstance from "./axiosConfig";

export const orderApi = {
  // Get all orders with optional branchId and status filtering
  getAll: async (branchId, status) => {
    const params = { page: 1, size: 100000 };
    if (branchId) {
      params.branchId = branchId;
    }
    if (status !== undefined && status !== null && status !== "") {
      params.status = status;
    }
    const response = await axiosInstance.get("/orders", { params });
    const resData = response.data.data || response.data;
    if (resData && typeof resData === "object" && "data" in resData && Array.isArray(resData.data)) {
      return resData.data;
    }
    return Array.isArray(resData) ? resData : [];
  },

  // Get order details by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.data || response.data;
  },

  // Set order status to pending
  setPending: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/pending`);
    return response.data.data || response.data;
  },

  // Set order status to ready to pickup
  setReadyToPickup: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/ready-to-pickup`);
    return response.data.data || response.data;
  },

  // Set order status to done (cashier complete)
  setDone: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/done`);
    return response.data.data || response.data;
  },

  // Confirm order received by cashier
  confirmReceived: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/received`);
    return response.data.data || response.data;
  },

  // Cancel order with optional reason
  cancel: async (id, reason = "Hủy đơn hàng") => {
    const response = await axiosInstance.put(`/orders/${id}/cancel`, { reason });
    return response.data.data || response.data;
  },

  // Receive cash payment
  receiveCash: async (id, amount) => {
    const response = await axiosInstance.post(`/orders/${id}/receive-cash`, { amount });
    return response.data.data || response.data;
  },

  // Delete order
  delete: async (id) => {
    await axiosInstance.delete(`/orders/${id}`);
  },
};
