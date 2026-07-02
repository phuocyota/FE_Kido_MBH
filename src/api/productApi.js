import axiosInstance from "./axiosConfig";

export const productApi = {
  // Get all products
  getAll: async (filters = {}) => {
    const params = { ...filters };
    const response = await axiosInstance.get("/products", { params });
    const resData = response.data.data || response.data;
    if (resData && typeof resData === "object" && "data" in resData && Array.isArray(resData.data)) {
      const arr = [...resData.data];
      Object.defineProperties(arr, {
        page: { value: resData.page, writable: true, enumerable: false },
        size: { value: resData.size, writable: true, enumerable: false },
        total: { value: resData.total, writable: true, enumerable: false },
        items: { value: arr, writable: true, enumerable: false },
        totalPages: { 
          value: Math.ceil((resData.total || 0) / (resData.size || filters.limit || filters.size || 10)), 
          writable: true, 
          enumerable: false 
        }
      });
      return arr;
    }
    return resData;
  },

  // Get products with categories (for POS)
  getFull: async () => {
    const response = await axiosInstance.get("/products/full");
    return response.data.data || response.data;
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
    const response = await axiosInstance.post("/upload/images", formData, {
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
