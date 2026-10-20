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

export function expiryAfter(baseDate, { days = 0, months = 0 }) {
  const date = new Date(`${baseDate}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== baseDate) return '';
  if (months) {
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
  }
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
