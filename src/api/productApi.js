import axiosInstance from "./axiosConfig";

export const productApi = {
  // Get all products
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
    const response = await axiosInstance.get("/products", { params });
    return response.data.data;
  },

  // Get products with categories (for POS)
  getFull: async () => {
    const response = await axiosInstance.get("/products/full");
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data.data || response.data;
  },

  // Update product
  update: async (id, data) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data.data || response.data;
  },

  // Bulk update products
  updateBulk: async (items) => {
    const response = await axiosInstance.put("/products/bulk/update", items);
    return response.data.data || response.data;
  },
};
