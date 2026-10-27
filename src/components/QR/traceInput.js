export const isLotId = (value) => /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value || "");
export const isLotReference = (value) => typeof value === "string" && value.length <= 200 && /^[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u.test(value);

export function parseTraceInput(value) {
  const input = value.trim();
  if (isLotId(input)) return { lotId: input };
  let params;
  try {
    const url = new URL(input, "https://trace.local");
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    params = url.searchParams;
    const hash = new URLSearchParams(url.hash.slice(1));
    const id = params.get("lotId") || params.get("id") || hash.get("lotId") || hash.get("id");
    if (isLotReference(id)) return { lotId: id, serial: params.get("serial") || hash.get("serial") || "" };
    // Previously printed labels carry a snapshot rather than a database ID.
    if (hash.get("name") && (hash.has("serial") || (hash.get("type") === "lot" && hash.get("lot")))) {
      return { snapshot: hash.toString() };
    }
  } catch { /* Continue with text and JSON QR formats. */ }
  try {
    const data = JSON.parse(input);
    const id = data?.lotId || data?.id;
    if (isLotReference(id)) return { lotId: id };
  } catch { /* A plain UUID or URL is the usual input. */ }
  const match = input.match(/(?:lotId|ID lô|Lô)\s*[:=]\s*(\S+)/i);
  if (match && isLotReference(match[1])) return { lotId: match[1] };
  if (isLotReference(input)) return { lotId: input };
  throw new Error("Vui lòng nhập UUID, mã lô hoặc đường dẫn QR hợp lệ.");
}

export function traceErrorMessage(error) {
  const status = error.response?.status;
  if (status === 404) return "Không tìm thấy hồ sơ của lô hàng này.";
  if (status === 401 || status === 403) return "API chưa cho phép truy cập hồ sơ này. Vui lòng kiểm tra quyền truy xuất với quản trị viên.";
  const message = error.response?.data?.message;
  return typeof message === "string" ? message : "Không thể tải hồ sơ truy xuất. Vui lòng thử lại.";
}
