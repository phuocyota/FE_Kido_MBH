import axiosInstance from "./axiosConfig";

export const customerApi = {
  generateCode: async () => {
    const response = await axiosInstance.post("/customers/generate-code");
    return response.data.data || response.data;
  },
  getAll: async () => {
    const response = await axiosInstance.get("/customers");
    return response.data.data || response.data;
  },

  getAllWithDebt: async () => {
    const customers = [];
    const size = 100;
    let page = 1;
    while (true) {
      const response = await axiosInstance.get("/customers", {
        params: { getDebt: true, page, size },
      });
      const payload = response.data.data ?? response.data;
      const items = Array.isArray(payload) ? payload : payload.data;
      if (!Array.isArray(items)) throw new Error("Dữ liệu khách hàng không hợp lệ");
      customers.push(...items);
      if (items.length === 0 || (payload.total !== undefined
        ? customers.length >= Number(payload.total)
        : items.length < size)) break;
      page += 1;
    }
    return customers;
  },

  search: async (keyword, limit = 50) => {
    const response = await axiosInstance.get("/customers/search", {
      params: { keyword, limit },
    });
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data.data || response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/customers/${id}`, data);
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/customers", data);
    return response.data.data || response.data;
  },
};
