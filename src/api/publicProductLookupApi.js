const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:3002";

export function buildLookupApiUrl(lotId, base = API_BASE) {
  const url = new URL(`${base.replace(/\/+$/, "")}/stock-trace/full`);
  url.searchParams.set("lotId", lotId);
  return url.href;
}

export async function getPublicProduct(lotId, signal) {
  const response = await fetch(buildLookupApiUrl(lotId), {
    method: "GET", headers: { Accept: "application/json" }, credentials: "omit", signal,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success === false) {
    if (response.status === 404) throw new Error("Không tìm thấy sản phẩm của ID hoặc mã lô này.");
    if (response.status === 401 || response.status === 403) throw new Error("API chưa cho phép truy xuất công khai hồ sơ này.");
    throw new Error(typeof body?.message === "string" ? body.message : "Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
  }
  const data = body?.data ?? body;
  if (!data?.product || !(data.lot || data.unit)) throw new Error("API chưa trả về hồ sơ sản phẩm hợp lệ.");
  return data;
}
