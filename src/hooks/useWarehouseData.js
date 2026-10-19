import { useEffect, useState } from "react";
import { warehouseApi } from "../api/warehouseApi";

export function useWarehouseData(path, params = {}, refresh = 0) {
  const key = JSON.stringify(params);
  const requestKey = `${path}:${key}:${refresh}`;
  const [state, setState] = useState({
    key: "",
    data: null,
    error: "",
    loading: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const data = await warehouseApi.get(
          path,
          JSON.parse(key),
          controller.signal,
        );
        if (!controller.signal.aborted)
          setState({ key: requestKey, data, error: "", loading: false });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            key: requestKey,
            data: null,
            loading: false,
            error:
              error.response?.status === 403
                ? "Bạn không có quyền xem dữ liệu kho của chi nhánh này."
                : error.response?.data?.message === "BRANCH_REQUIRED"
                  ? "Vui lòng chọn chi nhánh trước khi xem kho."
                  : error.response?.status === 400 &&
                      typeof error.response?.data?.message === "string"
                    ? error.response.data.message
                    : "Không thể tải dữ liệu kho. Vui lòng thử lại.",
          });
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [path, key, requestKey]);
  return state.key === requestKey
    ? state
    : { loading: true, data: null, error: "" };
}
