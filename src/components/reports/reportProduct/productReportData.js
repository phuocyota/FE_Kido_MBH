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
    case "7 ngày qua":
      start.setUTCDate(start.getUTCDate() - 6);
      break;
    case "30 ngày qua":
      start.setUTCDate(start.getUTCDate() - 29);
      break;
    case "Quý này":
      start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3, 1);
      break;
    case "Quý trước":
      start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3 - 3, 1);
      end.setTime(start.getTime());
      end.setUTCMonth(end.getUTCMonth() + 3, 0);
      break;
    case "Năm nay":
      start.setUTCMonth(0, 1);
      break;
    case "Năm trước":
      start.setUTCFullYear(start.getUTCFullYear() - 1, 0, 1);
      end.setUTCFullYear(start.getUTCFullYear(), 11, 31);
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

export function filterProductReportRows(rows, { productKeyword = "", category = "", foodTypes = [] } = {}) {
  const keyword = productKeyword.trim().toLocaleLowerCase("vi");
  const types = { "Đồ ăn": "FOOD", "Đồ uống": "DRINK", "Khác": "OTHER" };
  return rows.filter(row => (!keyword || `${row.code || ""} ${row.name || ""}`.toLocaleLowerCase("vi").includes(keyword))
    && (!category || row.categoryId === category)
    && (!foodTypes.length || foodTypes.some(type => (row.productType || "OTHER") === types[type])));
}

export function aggregateProductSales(rows) {
  const products = new Map();
  for (const row of rows) {
    const key = row.productId || row.code || row.name;
    const product = products.get(key) || { ...row, qty: 0, total: 0 };
    product.qty += Number(row.qty) || 0;
    product.total += Number(row.total) || 0;
    products.set(key, product);
  }
  return [...products.values()].sort((a, b) => b.qty - a.qty || a.name.localeCompare(b.name));
}
