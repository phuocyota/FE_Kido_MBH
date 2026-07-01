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

  createCategory: async (data) => {
    const response = await axiosInstance.post("/categories", data);
    return response.data.data || response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data.data || response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data.data || response.data;
  },

  // Create product
  create: async (data) => {
    const response = await axiosInstance.post("/products", data);
    return response.data.data || response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data || response.data;
  },

  // Update product
  update: async (id, data) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete product
  delete: async (id) => {
    await axiosInstance.delete(`/products/${id}`);
  },

  // Bulk update products
  updateBulk: async (items) => {
    const response = await axiosInstance.put("/products/bulk/update", items);
    return response.data.data || response.data;
  },
};
