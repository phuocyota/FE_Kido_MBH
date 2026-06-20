import React, { useEffect, useState } from "react";
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

export default function CashTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRows = async () => {
      try {
        setLoading(true);
        const data = await financeApi.getMoneyVouchers();
        if (active) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setRows([]);
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
  }, []);

  return (
    <div className="w-full">
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
                const voucherType = getVoucherTypeLabel(item.type);
                const isReceipt = item.type !== "PAYMENT";

                return (
                  <tr key={item.id} className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <button className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                        {item.code}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDateTime(item.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-700">{item.refType || item.order?.orderCode || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{item.supplier?.name || item.fund?.name || "-"}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${isReceipt ? "text-green-600" : "text-red-600"}`}>
                      {isReceipt ? "+" : "-"}
                      {Number(item.amount || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.fund?.name || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          isReceipt ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <DescriptionCell text={item.note || item.purpose || ""} />
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
          Tổng số: <span className="font-semibold">{rows.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Số bản ghi</span>
          <select className="h-9 border border-gray-300 rounded-md px-3 bg-white">
            <option>50</option>
            <option>100</option>
            <option>200</option>
          </select>
          <span className="text-sm text-gray-700">1 - {rows.length}</span>
          <div className="flex items-center gap-1">
            <button className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
