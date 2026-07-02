import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, RefreshCcw, FileSpreadsheet, Plus, Search, Settings } from "lucide-react";
import StockTakeModal from "./StockTakeModal";
import SidebarFilterStock from "./SidebarFilterStock";
import StockInPagination from "../StockIn/StockInPagination";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));
const formatDecimal = (value) =>
  new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const columns = [
  { label: "", className: "w-12 text-center" },
  { label: "Mã kiểm kho", className: "min-w-[150px]" },
  { label: "Thời gian", className: "min-w-[180px] text-center" },
  { label: "Ngày cân bằng", className: "min-w-[180px] text-center" },
  { label: "Tổng chênh lệch", className: "min-w-[160px] text-right" },
  { label: "SL lệch tăng", className: "min-w-[130px] text-right" },
  { label: "SL lệch giảm", className: "min-w-[130px] text-right" },
  { label: "Ghi chú", className: "min-w-[320px]" },
  { label: "Trạng thái", className: "min-w-[140px] text-center" },
];

const detailColumns = [
  { label: "#", className: "w-12 text-center" },
  { label: "Mã hàng", className: "min-w-[150px]" },
  { label: "Tên hàng", className: "min-w-[280px]" },
  { label: "Tồn kho", className: "min-w-[120px] text-right" },
  { label: "Thực tế", className: "min-w-[120px] text-right" },
  { label: "SL chênh lệch", className: "min-w-[130px] text-right" },
  { label: "Giá trị chênh lệch", className: "min-w-[150px] text-right" },
];

export default function TableStock({ rows = [], loading, error, onRefresh }) {
  const [openStockTake, setOpenStockTake] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Pagination for main table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Pagination for detail table
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const [detailPageSize, setDetailPageSize] = useState(20);

  const iconButtonClass =
    "min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition";

  // Reset selected row and pagination when rows change
  useEffect(() => {
    if (rows.length > 0 && !selectedRowId) {
      setSelectedRowId(rows[0].id);
    }
  }, [rows, selectedRowId]);

  // Handle Search input change
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1);
  };

  // Filter rows locally by search keyword
  const filteredRows = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return rows;
    return rows.filter((row) =>
      [row.code, row.note, row.status]
        .join(" ")
        .toLowerCase()
        .includes(kw)
    );
  }, [rows, searchKeyword]);

  // Paginated rows for main table
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    return filteredRows.slice(
      (safeCurrentPage - 1) * pageSize,
      safeCurrentPage * pageSize
    );
  }, [filteredRows, safeCurrentPage, pageSize]);

  // Get selected row details
  const selectedRow = useMemo(() => {
    const found = filteredRows.find((r) => r.id === selectedRowId);
    return found || filteredRows[0] || null;
  }, [filteredRows, selectedRowId]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleDetailPageSizeChange = (value) => {
    setDetailPageSize(value);
    setDetailCurrentPage(1);
  };

  // Compute total chênh lệch amount of filtered rows
  const totalAmount = useMemo(() => {
    return filteredRows.reduce(
      (sum, item) => sum + Number(item.totalDifferenceAmount || 0),
      0
    );
  }, [filteredRows]);

  // Detail table data
  const details = selectedRow?.items || [];
  const detailTotal = details.length;
  const detailTotalPages = Math.max(1, Math.ceil(detailTotal / detailPageSize));
  const safeDetailCurrentPage = Math.min(detailCurrentPage, detailTotalPages);
  const paginatedDetails = useMemo(() => {
    return details.slice(
      (safeDetailCurrentPage - 1) * detailPageSize,
      safeDetailCurrentPage * detailPageSize
    );
  }, [details, safeDetailCurrentPage, detailPageSize]);

  const detailTotalQuantitySystem = details.reduce((sum, item) => sum + Number(item.systemQuantity || 0), 0);
  const detailTotalQuantityActual = details.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
  const detailTotalQuantityDiff = details.reduce((sum, item) => sum + Number(item.differenceQuantity || 0), 0);
  const detailTotalAmountDiff = details.reduce((sum, item) => sum + Number(item.differenceAmount || 0), 0);

  return (
    <div className="w-full bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-300">
        <div className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                className="h-10 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <span className="truncate">Thực hiện hàng loạt</span>
                <ChevronDown size={15} className="shrink-0" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((current) => !current)}
                  className={`h-10 px-4 w-full sm:w-auto rounded-xl border bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 ${
                    isFilterOpen ? "border-indigo-600 text-indigo-600 ring-2 ring-indigo-100" : "border-gray-300"
                  }`}
                >
                  Lọc
                  <ChevronDown
                    size={15}
                    className={`transition ${isFilterOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 z-[60] bg-white border border-gray-300 rounded-xl shadow-lg p-4 sm:w-[720px] max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <SidebarFilterStock />
                    <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-sm font-medium text-gray-600 sm:px-3 text-center sm:text-left">
                Tháng này
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto lg:justify-end">
              <div className="relative flex-1 sm:flex-none">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm phiếu kiểm kho..."
                  className="h-11 w-full sm:w-[280px] lg:w-[320px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    className={iconButtonClass}
                    title="Tải lại"
                  >
                    <RefreshCcw size={17} className="text-gray-600" />
                  </button>
                )}

                <button
                  type="button"
                  className={iconButtonClass}
                  title="Xuất Excel"
                >
                  <FileSpreadsheet size={17} className="text-green-600" />
                </button>

                <button type="button" className={iconButtonClass} title="Thiết lập">
                  <Settings size={17} className="text-gray-600" />
                </button>

                <div className="relative flex-shrink-0">
                  <div className="flex overflow-hidden rounded-xl border border-indigo-600 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenStockTake(true)}
                      className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap"
                    >
                      <Plus size={18} />
                      Kiểm kho
                    </button>

                    <button
                      type="button"
                      className="w-10 h-10 bg-indigo-600 border-l border-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 transition"
                      title="Tùy chọn thêm"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 border-b border-indigo-200 ${col.className || ""}`}
                >
                  {col.label || <input type="checkbox" checked={paginatedRows.length > 0 && paginatedRows.every(r => r.id === selectedRowId)} readOnly />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="9" className="text-center py-16 text-gray-500 bg-white">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan="9" className="text-center py-16 text-red-500 bg-white">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              paginatedRows.map((item) => {
                const isSelected = item.id === selectedRowId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedRowId(item.id);
                      setDetailCurrentPage(1);
                    }}
                    className={`cursor-pointer border-b border-gray-300 hover:bg-indigo-50/60 transition-colors ${
                      isSelected ? "bg-indigo-50/80" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={isSelected} readOnly />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline text-left"
                      >
                        {item.code}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{formatDateTime(item.createdAt)}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{formatDateTime(item.countedAt)}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">{formatNumber(item.totalDifferenceAmount)} ₫</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNumber(item.increaseQuantity)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNumber(item.decreaseQuantity)}</td>
                    <td className="px-4 py-3 text-gray-600">{item.note || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {item.status === "DRAFT" ? "Tạm tính" : "Hoàn thành"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            {!loading && !error && filteredRows.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-16 text-gray-500 bg-white">
                  Không tìm thấy phiếu kiểm kho nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold text-gray-800">
              <td colSpan={4} className="px-4 py-3 border-t border-gray-300 text-center">
                Tổng cộng
              </td>
              <td className="px-4 py-3 border-t border-gray-300 text-right text-indigo-600">
                {formatNumber(totalAmount)} ₫
              </td>
              <td colSpan={5} className="px-4 py-3 border-t border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Main Table Pagination */}
      <StockInPagination
        total={filteredRows.length}
        currentPage={safeCurrentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Detail Table Section */}
      {selectedRow && (
        <div className="min-h-[320px] border-t-8 border-gray-300 bg-white">
          <div className="flex justify-center bg-gray-50">
            <div className="-mt-1 h-3 w-12 rounded-b bg-gray-300"></div>
          </div>

          <div className="px-4 pt-3 sm:px-5">
            <span className="inline-flex rounded-t-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
              Chi tiết hàng hóa
            </span>
          </div>

          {/* Desktop view */}
          <div className="overflow-x-auto border-t border-gray-300">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
                  {detailColumns.map((column, idx) => (
                    <th
                      key={idx}
                      className={`border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 ${column.className || ""}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedDetails.map((item, index) => {
                  const prodCode = item.product?.sku || "N/A";
                  const prodName = item.product?.name || "N/A";
                  return (
                    <tr key={item.id} className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors bg-white">
                      <td className="px-4 py-3 text-center text-gray-500">
                        {(safeDetailCurrentPage - 1) * detailPageSize + index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-indigo-600">
                        {prodCode}
                      </td>
                      <td className="px-4 py-3 leading-5 text-gray-800">
                        {prodName}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                        {formatDecimal(item.systemQuantity)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                        {formatDecimal(item.actualQuantity)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold tabular-nums ${
                        Number(item.differenceQuantity) > 0 ? "text-green-600" : Number(item.differenceQuantity) < 0 ? "text-rose-600" : "text-gray-700"
                      }`}>
                        {Number(item.differenceQuantity) > 0 ? "+" : ""}{formatDecimal(item.differenceQuantity)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold tabular-nums ${
                        Number(item.differenceAmount) > 0 ? "text-green-600" : Number(item.differenceAmount) < 0 ? "text-rose-600" : "text-gray-900"
                      }`}>
                        {Number(item.differenceAmount) > 0 ? "+" : ""}{formatNumber(item.differenceAmount)} ₫
                      </td>
                    </tr>
                  );
                })}

                {details.length === 0 && (
                  <tr>
                    <td
                      colSpan={detailColumns.length}
                      className="px-4 py-16 text-center text-gray-500"
                    >
                      Chưa có hàng hóa trong phiếu kiểm kho
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="bg-gray-50 font-bold text-gray-800">
                  <td colSpan={3} className="px-4 py-3 border-t border-gray-300">
                    Tổng cộng
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-gray-800">
                    {formatDecimal(detailTotalQuantitySystem)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums border-t border-gray-300 text-gray-800">
                    {formatDecimal(detailTotalQuantityActual)}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums border-t border-gray-300 ${
                    detailTotalQuantityDiff > 0 ? "text-green-600" : detailTotalQuantityDiff < 0 ? "text-rose-600" : "text-gray-800"
                  }`}>
                    {detailTotalQuantityDiff > 0 ? "+" : ""}{formatDecimal(detailTotalQuantityDiff)}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums border-t border-gray-300 ${
                    detailTotalAmountDiff > 0 ? "text-green-600" : detailTotalAmountDiff < 0 ? "text-rose-600" : "text-indigo-600"
                  }`}>
                    {detailTotalAmountDiff > 0 ? "+" : ""}{formatNumber(detailTotalAmountDiff)} ₫
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Detail Table Pagination */}
          <StockInPagination
            total={details.length}
            currentPage={safeDetailCurrentPage}
            pageSize={detailPageSize}
            onPageChange={setDetailCurrentPage}
            onPageSizeChange={handleDetailPageSizeChange}
          />
        </div>
      )}

      <StockTakeModal
        open={openStockTake}
        onClose={() => setOpenStockTake(false)}
        onSaved={() => {
          setOpenStockTake(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}
