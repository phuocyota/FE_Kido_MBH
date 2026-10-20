import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data ?? response.data;
export const kitchenRecipeApi = {
  requestRecipe: async (productId, branchId, note) =>
    unwrap(
      await axiosInstance.post(
        `/kitchen/products/${productId}/request-recipe`,
        { branchId, note },
      ),
    ),
  list: async (productId, branchId, signal) =>
    unwrap(
      await axiosInstance.get("/kitchen/recipes", {
        params: { productId, branchId },
        signal,
      }),
    ),
  units: async (signal) =>
    unwrap(await axiosInstance.get("/kitchen/units", { signal })),
  ingredients: async (branchId, signal) => {
    const items = [];
    let page = 1;
    while (true) {
      const payload = unwrap(
        await axiosInstance.get("/products", {
          params: { branchId, productType: "INGREDIENT", page, size: 100 },
          signal,
        }),
      );
      const rows = Array.isArray(payload) ? payload : payload.data;
      if (!Array.isArray(rows))
        throw new Error("Không đọc được danh mục nguyên liệu.");
      items.push(...rows);
      if (
        !rows.length ||
        (payload.total !== undefined
          ? items.length >= Number(payload.total)
          : rows.length < 100)
      )
        return items;
      page++;
    }
  },
  create: async (data) =>
    unwrap(await axiosInstance.post("/kitchen/recipes", data)),
  review: async (id, action, reason) =>
    unwrap(
      await axiosInstance.post(`/kitchen/recipes/${id}/${action}`, { reason }),
    ),
};
