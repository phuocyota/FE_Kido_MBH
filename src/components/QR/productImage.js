const IMAGE_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3002";

export function resolveProductImage(value, baseUrl = IMAGE_BASE_URL) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim(), `${baseUrl.replace(/\/$/, "")}/`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
