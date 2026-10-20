import { useCallback } from "react";
import { useDebouncedValue } from "./useDebouncedValue";
import { useReadQuery } from "./useReadQuery";
import { warehouseApi } from "../api/warehouseApi";
import { getLoadingState } from "./loadingState";

const warehouseError = (error) =>
  error.response?.status === 403
    ? "Bạn không có quyền xem dữ liệu kho của chi nhánh này."
    : error.response?.data?.message === "BRANCH_REQUIRED"
      ? "Vui lòng chọn chi nhánh trước khi xem kho."
      : error.response?.status === 400 && typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : "Không thể tải dữ liệu kho. Vui lòng thử lại.";

export function useWarehouseData(path, params = {}, refresh = 0) {
  const search = useDebouncedValue(params.search ?? "");
  const debouncing = params.search !== undefined && search !== params.search;
  const key = JSON.stringify(params.search === undefined ? params : { ...params, search });
  const load = useCallback((signal) => warehouseApi.get(path, JSON.parse(key), signal), [path, key]);
  const result = useReadQuery({
    queryKey: [path, key, refresh],
    scopeKey: [path, params.branchId],
    load,
    getErrorMessage: warehouseError,
  });
  const loading = result.loading || debouncing;
  return { ...result, loading, error: debouncing ? "" : result.error, ...getLoadingState(loading, result.hasData) };
}
