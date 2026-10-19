export const lotTypes = { INGREDIENT: "Nguyên liệu", FUEL: "Nhiên liệu", FINISHED_GOOD: "Thành phẩm", MERCHANDISE: "Hàng hóa" };

export function todayInVietnam() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function lotStatus(lot, today = todayInVietnam()) {
  if (Number(lot.quantity) <= 0) return { label: "Đã hết hàng", color: "bg-slate-100 text-slate-600" };
  if (lot.expiresAt && lot.expiresAt < today) return { label: "Đã hết hạn", color: "bg-red-100 text-red-700" };
  if (lot.expiresAt) {
    const days = (Date.parse(lot.expiresAt) - Date.parse(today)) / 86400000;
    if (days <= 7) return { label: "Sắp hết hạn", color: "bg-amber-100 text-amber-800" };
  }
  return { label: "Còn sử dụng", color: "bg-emerald-100 text-emerald-700" };
}

export const lotDate = (value) => value ? value.slice(0, 10).split("-").reverse().join("/") : "—";
export const lotNumber = (value) => Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 4 });
