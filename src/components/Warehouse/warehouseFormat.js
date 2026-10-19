export const number = (value) =>
  value === null || value === undefined
    ? "—"
    : Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 4 });
export const money = (value) =>
  value === null || value === undefined
    ? "—"
    : Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
      " ₫";
export const date = (value) =>
  value ? value.slice(0, 10).split("-").reverse().join("/") : "—";
export const types = {
  INGREDIENT: "Nguyên liệu",
  FUEL: "Nhiên liệu",
  FINISHED_GOOD: "Thành phẩm",
  MERCHANDISE: "Hàng hóa",
};
export const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50";
export const cellClass =
  "border-b border-slate-100 px-3 py-3 align-middle text-sm text-slate-700";
export const headingClass =
  "whitespace-nowrap bg-slate-50 px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500";
export function rangeDays(days) {
  const now = new Date();
  const to = new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10);
  const first = new Date(`${to}T00:00:00Z`);
  first.setUTCDate(first.getUTCDate() - days + 1);
  return { from: first.toISOString().slice(0, 10), to };
}
export function movementSeries(rows, from, to, unit) {
  const map = new Map(
    rows.filter((row) => row.unit === unit).map((row) => [row.day, row]),
  );
  const result = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  while (cursor.toISOString().slice(0, 10) <= to) {
    const day = cursor.toISOString().slice(0, 10);
    result.push({
      day,
      incoming: Number(map.get(day)?.incoming || 0),
      outgoing: Number(map.get(day)?.outgoing || 0),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}
