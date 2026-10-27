import { useCallback, useEffect, useState } from "react";
import { getPublicProduct } from "../../api/publicProductLookupApi";
import { isLookupReference } from "./lookupHelpers";

export function useProductLookup(reference) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ key: "", data: null, error: "" });
  const key = JSON.stringify([reference, revision]);
  const enabled = isLookupReference(reference);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const run = async () => {
      try {
        const data = await getPublicProduct(reference, controller.signal);
        if (!controller.signal.aborted) setState({ key, data, error: "" });
      } catch (failure) {
        if (!controller.signal.aborted) setState({ key, data: null, error: failure instanceof TypeError ? "Không kết nối được API. Vui lòng kiểm tra kết nối và thử lại." : failure.message });
      }
    };
    run();
    return () => controller.abort();
  }, [reference, key, enabled]);
  const current = state.key === key;
  return {
    data: current ? state.data : null,
    error: current ? state.error : "",
    loading: enabled && !current,
    retry: useCallback(() => setRevision((value) => value + 1), []),
  };
}
