import { apiRequest, buildAssetUrl } from "./client";
import { API } from "./endpoint";

const unwrap = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const normalizeProduct = (product, categoryName = "") => {
  const productId =
    product.id ||
    product.productId ||
    product.ProductId ||
    product._id;

  return {
    id: productId,
    productId,
    categoryId: product.categoryId,
    sku: product.sku,
    name: product.name,
    description: product.description,
    image: buildAssetUrl(product.imageUrl),
    imageUrl: product.imageUrl,
    price: toNumber(product.price),
    unit: product.unit,
    category: categoryName,
    isActive: product.isActive,
  };
};

export const getProductsFull = async () => {
  const response = await apiRequest(API.PRODUCTS.FULL);
  const categories = unwrap(response);

  return categories.map((category) => ({
    ...category,
    products: (category.products || []).map((product) =>
      normalizeProduct(product, category.name)
    ),
  }));
};


export const getProductsByPrice = async (
  minPrice = 0,
  maxPrice = 5000
) => {

  const response = await apiRequest(
    `${API.PRODUCTS.FULL}?minPrice=${minPrice}&maxPrice=${maxPrice}`
  );

  const categories = unwrap(response);

  return categories.map((category) => ({
    ...category,
    products: (category.products || []).map(
      (product) =>
        normalizeProduct(
          product,
          category.name
        )
    ),
  }));
};
