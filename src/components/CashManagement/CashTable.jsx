import React, { useEffect, useState, useRef } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { financeApi } from "../../api";

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

const getVoucherTypeLabel = (type) => (type === "PAYMENT" ? "Phiếu chi" : "Phiếu thu");

function DescriptionCell({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text?.length > 60;

  return (
    <div className="max-w-[400px]">
      <p className={expanded ? "whitespace-normal break-words" : "truncate"}>{text}</p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-indigo-600 hover:text-indigo-700"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

export default function CashTable({ filters, refreshTrigger }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [voucherType, setVoucherType] = useState("ALL"); // ALL, RECEIVED, PAID
  const [totalItems, setTotalItems] = useState(0);

  const lastFiltersRef = useRef(filters);
  const lastVoucherTypeRef = useRef(voucherType);

  useEffect(() => {
    let active = true;

    const loadRows = async () => {
      try {
        setLoading(true);

        let targetPage = currentPage;
        // If filters or voucherType changed, reset page to 1
        if (
          lastFiltersRef.current?.from !== filters?.from ||
          lastFiltersRef.current?.to !== filters?.to ||
          lastFiltersRef.current?.search !== filters?.search ||
          lastVoucherTypeRef.current !== voucherType
        ) {
          targetPage = 1;
          setCurrentPage(1);
        }

        lastFiltersRef.current = filters;
        lastVoucherTypeRef.current = voucherType;

        const params = {
          page: targetPage,
          size: pageSize,
        };
        if (filters?.from) params.from = filters.from;
        if (filters?.to) params.to = filters.to;
        if (filters?.search) params.search = filters.search;
        if (voucherType !== "ALL") params.voucherType = voucherType;

        const data = await financeApi.getMoneyVouchers(params);
        if (active) {
          setRows(Array.isArray(data) ? data : []);
          setTotalItems(data.total !== undefined ? data.total : (Array.isArray(data) ? data.length : 0));
        }
      } catch (err) {
        console.error("Failed to load money vouchers:", err);
        if (active) {
          setRows([]);
          setTotalItems(0);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRows();

    return () => {
      active = false;
    };
  }, [filters, refreshTrigger, currentPage, pageSize, voucherType]);

  return (
    <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden mt-4">
      {/* Sub-tabs for Voucher Type */}
      <div className="flex border-b border-gray-300 bg-gray-50 px-4 pt-1">
        <button
          onClick={() => setVoucherType("ALL")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-150 relative ${
            voucherType === "ALL"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setVoucherType("RECEIVED")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-150 relative ${
            voucherType === "RECEIVED"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Phiếu thu (PT)
        </button>
        <button
          onClick={() => setVoucherType("PAID")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-150 relative ${
            voucherType === "PAID"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Phiếu chi (PC)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
              <th className="border-b border-indigo-200 px-4 py-3 w-12">
                <input type="checkbox" />
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Số phiếu
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Thời gian
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Tham chiếu
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Đối tượng
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Tổng tiền
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Hình thức
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Loại phiếu
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 min-w-[400px]">
                Diễn giải
              </th>
              <th className="border-b border-indigo-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Chức năng
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="py-16 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((item) => {
                const isReceipt = item.voucherType === "RECEIVED" || item.type === "RECEIPT";
                const voucherTypeLabel = isReceipt ? "Phiếu thu" : "Phiếu chi";

                const getPaymentFormLabel = (val) => {
                  if (val === "CASH") return "Tiền mặt";
                  if (val === "BANK") return "Chuyển khoản";
                  return val || "-";
                };

                return (
                  <tr key={item.id} className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <button className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                        {item.voucherNumber || item.code}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDateTime(item.createdAt || item.time)}</td>
                    <td className="px-4 py-3 text-gray-700 text-left">
                      {item.reference?.code || item.order?.orderCode || item.reference?.type || item.refType || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-left">
                      {item.object?.name || item.supplier?.name || item.fund?.name || item.object?.code || "-"}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isReceipt ? "text-green-600" : "text-red-600"}`}>
                      {isReceipt ? "+" : "-"}
                      {Number(item.amount || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-left">
                      {getPaymentFormLabel(item.paymentForm) || item.fund?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          isReceipt ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {voucherTypeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <DescriptionCell text={item.note || item.description || item.purpose || ""} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                          <Eye size={15} />
                          Xem
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={10} className="py-16 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-300 bg-gray-50">
        <div className="text-sm text-gray-700">
          Tổng số: <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Số bản ghi</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 border border-gray-300 rounded-md px-3 bg-white cursor-pointer outline-none focus:border-indigo-500"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <span className="text-sm text-gray-700">
            {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalItems)}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= Math.ceil(totalItems / pageSize)}
              onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(totalItems / pageSize), prev + 1))}
              className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
