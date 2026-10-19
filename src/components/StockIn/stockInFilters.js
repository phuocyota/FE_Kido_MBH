import { getStockInPurpose } from "./stockInPurposes.js";

export const defaultStockInFilters = {
  documentType: "Tất cả", secondaryStatus: "Tất cả", fromDate: "", toDate: "",
};

function dateValue(value) {
  const match = value?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return NaN;
  const [, day, month, year] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const time = Date.parse(`${iso}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === iso ? time : NaN;
}

export function validateStockInFilters(filters) {
  if ((filters.fromDate && !Number.isFinite(dateValue(filters.fromDate))) ||
      (filters.toDate && !Number.isFinite(dateValue(filters.toDate)))) return "Vui lòng nhập ngày hợp lệ theo dd/mm/yyyy.";
  if (filters.fromDate && filters.toDate && dateValue(filters.fromDate) > dateValue(filters.toDate)) return "Từ ngày phải trước hoặc bằng Đến ngày.";
  return "";
}

export function matchesStockInFilters(receipt, filters) {
  if (filters.documentType !== "Tất cả" && getStockInPurpose(receipt.reasonCode).title !== filters.documentType) return false;
  if (filters.secondaryStatus === "Đã thanh toán" && receipt.paymentStatus !== "PAID") return false;
  if (filters.secondaryStatus === "Chưa thanh toán" && !["DEBT", "UNPAID"].includes(receipt.paymentStatus)) return false;
  const posted = dateValue(receipt.postedDate);
  if ((filters.fromDate || filters.toDate) && !Number.isFinite(posted)) return false;
  if (filters.fromDate && posted < dateValue(filters.fromDate)) return false;
  if (filters.toDate && posted > dateValue(filters.toDate)) return false;
  return true;
}
