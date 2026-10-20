import { useCallback, useEffect, useState } from "react";
import { getAccessToken, getBranchIdFromToken } from "../api/authSession";
import { getLoadingState } from "./loadingState";

const defaultErrorMessage = (error) => {
  const message = error.response?.data?.message;
  return typeof message === "string" ? message : "Không thể tải dữ liệu. Vui lòng thử lại.";
};

// Keep `load` stable with useCallback. Query keys describe filters/pages; scope
// keys identify the branch or record whose previous response may be displayed.
export function useReadQuery({
  queryKey,
  scopeKey,
  load,
  enabled = true,
  getErrorMessage = defaultErrorMessage,
  retainOnError = false,
}) {
  const [revision, setRevision] = useState(0);
  const key = JSON.stringify([queryKey, revision]);
  const scope = JSON.stringify([getAccessToken(), getBranchIdFromToken(), scopeKey]);
  const [state, setState] = useState({ key: "", scope: "", data: null, failure: null });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const run = async () => {
      // A disabled query can be enabled again with the same key and response.
      setState((previous) => previous.key === key && previous.scope === scope
        ? { ...previous, key: "" } : previous);
      try {
        const data = await load(controller.signal);
        if (!controller.signal.aborted) setState({ key, scope, data, failure: null });
      } catch (failure) {
        if (!controller.signal.aborted)
          setState((previous) => ({
            key,
            scope,
            data: retainOnError && previous.scope === scope ? previous.data : null,
            failure,
          }));
      }
    };
    run();
    return () => controller.abort();
  }, [key, scope, load, enabled, retainOnError]);

  const sameScope = enabled && state.scope === scope;
  const current = sameScope && state.key === key;
  const data = sameScope ? state.data : null;
  const failure = current ? state.failure : null;
  const loading = enabled && !current;
  const hasData = data !== null && data !== undefined;
  const refetch = useCallback(() => setRevision((value) => value + 1), []);
  return {
    data,
    failure,
    error: failure ? getErrorMessage(failure) : "",
    loading,
    hasData,
    ...getLoadingState(loading, hasData),
    refetch,
  };
}
