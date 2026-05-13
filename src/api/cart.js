import { apiRequest, buildAssetUrl } from "./client";
import { API } from "./endpoint";

const unwrap = (response) => response?.data || response || {};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getCartItems = (cart) =>
  cart?.items || cart?.cartItems || cart?.CartItems || [];

export const normalizeCartItem = (item) => {
  const product = item.product || item.Product || {};
  const productId = item.productId || product.id || item.id;
  const quantity = toNumber(item.quantity ?? item.qty ?? 1);
  const price = toNumber(item.unitPrice ?? item.price ?? product.price);

  return {
    id: productId,
    cartItemId: item.id,
    productId,
    name: product.name || item.name,
    image: buildAssetUrl(product.imageUrl || item.imageUrl),
    price,
    qty: quantity,
    quantity,
    note: item.note || "",
    category: product.category?.name || product.categoryName || item.category,
  };
};

export const normalizeCart = (response) => {
  const cart = unwrap(response);
  const items = getCartItems(cart).map(normalizeCartItem);

  return {
    ...cart,
    items,
    total: toNumber(cart.total ?? cart.totalAmount ?? cart.amount),
  };
};

export const getMyCart = async () => {
  const response = await apiRequest(API.CART.ME);
  return normalizeCart(response);
};

export const addCartItem = async ({ productId, quantity = 1, note = "" }) => {
  const response = await apiRequest(API.CART.ITEMS, {
    method: "POST",
    body: JSON.stringify({ productId, quantity, note }),
  });

  return normalizeCart(response);
};

export const updateCartItem = async (itemId, { quantity }) => {
  const response = await apiRequest(API.CART.ITEM(itemId), {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

  return normalizeCart(response);
};

export const deleteCartItem = async (itemId) => {
  const response = await apiRequest(API.CART.ITEM(itemId), {
    method: "DELETE",
  });

  return normalizeCart(response);
};

export const completeCart = async ({
  branchId,
  posDeviceId,
  paymentMethod,
  orderType = "TAKEAWAY",
  note = "",
}) =>
  apiRequest(API.CART.COMPLETE, {
    method: "POST",
    body: JSON.stringify({
      branchId,
      posDeviceId,
      paymentMethod,
      orderType,
      note,
    }),
  });
