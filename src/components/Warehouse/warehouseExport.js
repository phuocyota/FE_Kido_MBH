import { types } from "./warehouseFormat.js";

export function inventoryWorkbook(XLSX, rows) {
  const sheet = XLSX.utils.aoa_to_sheet([
    [
      "Mã hàng",
      "Tên hàng",
      "Phân loại",
      "Nhóm",
      "Kho",
      "Tồn thực tế",
      "Giữ chỗ",
      "Tồn dùng được trước giữ chỗ",
      "Đơn vị",
      "Tồn hết hạn",
      "Định mức",
      "Giá vốn hiện tại",
      "Giá trị ước tính",
    ],
    ...rows.map((row) => [
      row.code || "",
      row.name,
      types[row.productType] || "Chưa phân loại",
      row.categoryName,
      row.stockName,
      Number(row.quantity),
      "Chưa thiết lập",
      Number(row.availableQuantity),
      row.unit,
      Number(row.expiredQuantity),
      row.minimumStock === null ? null : Number(row.minimumStock),
      row.costPrice === null ? null : Number(row.costPrice),
      row.inventoryValue === null ? null : Number(row.inventoryValue),
    ]),
  ]);
  sheet["!cols"] = [16, 35, 20, 24, 28, 18, 20, 30, 14, 18, 18, 22, 22].map(
    (wch) => ({ wch }),
  );
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Ton kho");
  return book;
}
