export function currentPurchaseDateTime() {
  const now = new Date();
  return new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 16);
}

export function freshFoodExpiry(purchasedAt = currentPurchaseDateTime().slice(0, 10)) {
  if (!purchasedAt) return "";
  const date = new Date(`${purchasedAt}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString().slice(0, 10);
}
