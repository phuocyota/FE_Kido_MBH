// PostgreSQL numeric fields can arrive as decimal strings. HTML number inputs
// already supply a dot decimal value regardless of their displayed locale.
export function stockNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return NaN;
  return Number(value);
}
