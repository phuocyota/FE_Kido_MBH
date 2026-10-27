export const isLotReference = (value) => typeof value === "string" && value.length <= 200 && /^[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u.test(value);

export function traceErrorMessage(error) {
  const status = error.response?.status;
  if (status === 404) return "Không tìm thấy hồ sơ của lô hàng này.";
  if (status === 401 || status === 403) return "API chưa cho phép truy cập hồ sơ này. Vui lòng kiểm tra quyền truy xuất với quản trị viên.";
  const message = error.response?.data?.message;
  return typeof message === "string" ? message : "Không thể tải hồ sơ truy xuất. Vui lòng thử lại.";
}
