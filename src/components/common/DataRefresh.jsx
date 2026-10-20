import RefreshNotice from "./RefreshNotice";
import React from "react";
import { getLoadingState } from "../../hooks/loadingState";

// Keep the previous response mounted while a replacement is in flight.
export default function DataRefresh({ pending, hasData, children, showStatus = true }) {
  const state = getLoadingState(pending, hasData);
  return (
    <div className="relative min-w-0 w-full" aria-busy={pending}>
      {showStatus && state.refreshing && <RefreshNotice />}
      <div inert={state.refreshing ? true : undefined}>{typeof children === "function" ? children(state) : children}</div>
    </div>
  );
}
