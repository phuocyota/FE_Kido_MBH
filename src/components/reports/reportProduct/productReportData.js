import { getVietnamDateKey } from "../reportEndDay/reportData";

export function getProductReportRange(preset, now = new Date()) {
  const today = getVietnamDateKey(now);
  const end = new Date(`${today}T00:00:00Z`);
  const start = new Date(end);
  switch (preset) {
    case "Hôm qua":
      start.setUTCDate(start.getUTCDate() - 1);
      end.setUTCDate(end.getUTCDate() - 1);
      break;
    case "Tuần này":
      start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
      break;
    case "Tuần trước":
      start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7) - 7);
      end.setTime(start.getTime() + 6 * 86400000);
      break;
    case "Tháng này":
      start.setUTCDate(1);
      break;
    case "Tháng trước":
      start.setUTCDate(1);
      start.setUTCMonth(start.getUTCMonth() - 1);
      end.setUTCDate(0);
      break;
    case "Toàn thời gian":
      start.setTime(Date.UTC(1970, 0, 1));
      break;
    default:
      break;
  }
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
}

// reportApi already unwraps the transport envelope. Preserve report metadata.
export function unwrapProductReport(response) {
  if (response?.success !== undefined) return response.data;
  if (response?.data?.success !== undefined) return response.data.data;
  return response;
}

export function validateReportDates(from, to) {
  if (!from || !to || from > to)
    throw new Error("Vui lòng chọn khoảng ngày hợp lệ");
}
