import React, { useEffect, useState } from "react";
import StockTakeModal from "./StockTakeModal";
import { stockTakeApi } from "../../api";

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

export default function TableStock() {
  const [openStockTake, setOpenStockTake] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await stockTakeApi.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
      setError("Không thể tải danh sách phiếu kiểm kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Phiếu kiểm kho</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenStockTake(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Kiểm kho
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            Xuất file
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th className="p-3"><input type="checkbox" /></th>
                <th className="p-3 text-left whitespace-nowrap">Mã kiểm kho</th>
                <th className="p-3 text-left whitespace-nowrap">Thời gian</th>
                <th className="p-3 text-left whitespace-nowrap">Ngày cân bằng</th>
                <th className="p-3 text-left whitespace-nowrap">Tổng chênh lệch</th>
                <th className="p-3 text-left whitespace-nowrap">SL lệch tăng</th>
                <th className="p-3 text-left whitespace-nowrap">SL lệch giảm</th>
                <th className="p-3 text-left whitespace-nowrap">Ghi chú</th>
                <th className="p-3 text-left whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="9" className="text-center py-24 text-gray-400">Đang tải dữ liệu...</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan="9" className="text-center py-24 text-red-500">{error}</td></tr>
              )}
              {!loading && !error && rows.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-center"><input type="checkbox" /></td>
                  <td className="p-3 font-medium text-blue-600">{item.code}</td>
                  <td className="p-3">{formatDateTime(item.createdAt)}</td>
                  <td className="p-3">{formatDateTime(item.countedAt)}</td>
                  <td className="p-3">{formatNumber(item.totalDifferenceAmount)}</td>
                  <td className="p-3">{formatNumber(item.increaseQuantity)}</td>
                  <td className="p-3">{formatNumber(item.decreaseQuantity)}</td>
                  <td className="p-3">{item.note || ""}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-24 text-gray-400">
                    Không tìm thấy phiếu kiểm kho nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockTakeModal
        open={openStockTake}
        onClose={() => setOpenStockTake(false)}
        onSaved={() => {
          setOpenStockTake(false);
          loadRows();
        }}
      />
    </div>
  );
}
