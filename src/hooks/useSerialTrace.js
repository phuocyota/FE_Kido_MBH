import { useCallback } from "react";
import { useReadQuery } from "./useReadQuery";
import { stockLotApi } from "../api/stockLotApi";
import { warehouseApi } from "../api/warehouseApi";

const serialError = (error) => typeof error.response?.data?.message === "string"
  ? error.response.data.message
  : error.response ? "Không thể truy xuất serial. Vui lòng thử lại."
    : error.message || "Không thể truy xuất serial. Vui lòng thử lại.";

export function useSerialTrace(selected, refresh = 0) {
  const { detailId, position, serial } = selected;
  const load = useCallback(async (signal) => {
        // Retain old bookmarked links which only contain detailId/position.
        const identity = serial ? { serial } : await warehouseApi.get(`serials/${detailId}/${position}`, {}, signal);
        let result;
        try {
          result = await stockLotApi.lookup(identity.serial, signal);
        } catch (error) {
          // The user already selected an exact receipt row. A duplicate serial
          // must not replace that selection with another product's provenance.
          if (error.response?.status !== 409 || error.response?.data?.code !== "TRACE_ID_AMBIGUOUS") throw error;
          const exact = await warehouseApi.get(`serials/${detailId}/${position}`, {}, signal);
          if (exact.serial !== identity.serial) throw new Error("Serial đã thay đổi. Vui lòng tải lại danh sách.");
          result = { type: "SERIAL", serial: exact, lotTrace: exact.lotId ? await stockLotApi.getTrace(exact.lotId, signal) : null };
        }
        if (result.type !== "SERIAL" || result.serial.detailId !== detailId || Number(result.serial.position) !== Number(position))
          throw new Error("Nguồn truy xuất không khớp serial đã chọn. Vui lòng tải lại danh sách.");
    return result;
  }, [detailId, position, serial]);
  return useReadQuery({
    queryKey: [detailId, position, serial, refresh],
    scopeKey: ["serial-trace", detailId, position, serial],
    load,
    getErrorMessage: serialError,
  });
}
