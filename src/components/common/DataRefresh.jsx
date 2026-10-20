import React from "react";
import { getLoadingState } from "../../hooks/loadingState";

// Keep the previous response mounted while a replacement is in flight.
export default function DataRefresh({ pending, hasData, children, showStatus = true }) {
  const state = getLoadingState(pending, hasData);
  return (
    <div className="relative min-w-0 w-full" aria-busy={pending}>
      {showStatus && state.refreshing && (
        <div role="status" className="print:hidden pointer-events-none absolute right-2 top-2 z-20 rounded-lg border border-blue-100 bg-white/95 px-3 py-1.5 text-xs text-blue-700 shadow-sm">
          Đang cập nhật...
        </div>
      )}
      <div inert={state.refreshing ? true : undefined}>{typeof children === "function" ? children(state) : children}</div>
    </div>
  );
}
