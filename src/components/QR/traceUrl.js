export function getQrOrigin() {
  return import.meta.env?.VITE_QR_BASE_URL
    || (typeof window !== "undefined" && window.location?.origin)
    || "https://fe.admin.kidocanteen.kidoedu.vn";
}
