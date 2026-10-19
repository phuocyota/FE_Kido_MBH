export const getVietnamDateKey = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export function mapEndOfDayRows(result) {
  const rows = Array.isArray(result) ? result : result?.data;
  if (!Array.isArray(rows)) throw new Error("Dữ liệu báo cáo không hợp lệ");
  const money = (value) => (Number(value) || 0).toLocaleString("vi-VN");
  return rows.map((item) => ({
    date: item.date
      ? new Date(item.date).toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      : "",
    code: item.code || "",
    name: item.name || "",
    price: money(item.price),
    qty: Number(item.qty) || 0,
    total: money(item.total),
    gross: money(item.gross),
    tax: money(item.tax),
    net: money(item.net),
  }));
}
