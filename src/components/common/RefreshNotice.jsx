import React from "react";

export default function RefreshNotice({ error, onRetry }) {
  return (
    <div role={error ? "alert" : "status"} className="print:hidden absolute right-2 top-2 z-20 rounded-lg border border-blue-100 bg-white/95 px-3 py-1.5 text-xs text-blue-700 shadow-sm">
      {error ? <>
        <span className="text-red-700">{error}</span>
        {onRetry && <button type="button" onClick={onRetry} className="ml-2 underline">Thử lại</button>}
      </> : "Đang cập nhật..."}
    </div>
  );
}
