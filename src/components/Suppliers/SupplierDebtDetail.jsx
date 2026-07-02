import React, { useEffect, useState } from "react";
import { supplierApi } from "../../api/supplierApi";
import { X } from "lucide-react";

export default function SupplierDebtDetail({ supplier, onClose }) {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplier?.id) {
      fetchDebts();
    }
  }, [supplier?.id]);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const data = await supplierApi.getDebts(supplier.id);
      setDebts(data);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử công nợ:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeName = (type) => {
    switch (type) {
      case "PURCHASE":
        return "Mua hàng";
      case "PAYMENT":
        return "Thanh toán";
      case "INITIAL":
        return "Nợ đầu kỳ";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col bg-white border-t border-gray-300 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] h-[35vh] min-h-[250px] animate-in slide-in-from-bottom-10 duration-300 relative z-10">
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#5b45ff] text-white">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Chi tiết công nợ
          </h3>
          <div className="h-4 w-px bg-white/30"></div>
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full font-medium">
            {supplier.code} - {supplier.name}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white/90 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50/50 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-[#5b45ff] rounded-full animate-spin"></div>
          </div>
        ) : debts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 font-medium">
            Không có dữ liệu công nợ
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f0f2f5] text-gray-700 font-semibold sticky top-0 shadow-sm z-10">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center border-b border-gray-200">#</th>
                    <th className="px-4 py-3 border-b border-gray-200">Ngày</th>
                    <th className="px-4 py-3 border-b border-gray-200">Loại giao dịch</th>
                    <th className="px-4 py-3 border-b border-gray-200">Mã tham chiếu</th>
                    <th className="px-4 py-3 border-b border-gray-200">Ghi chú</th>
                    <th className="px-4 py-3 text-right border-b border-gray-200">Giá trị</th>
                    <th className="px-4 py-3 text-right border-b border-gray-200">Dư nợ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {debts.map((debt, index) => (
                    <tr key={debt.id || index} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(debt.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {getTransactionTypeName(debt.type)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#5b45ff] font-medium">
                          {debt.voucher?.code || debt.refId || "-"}
                        </div>
                        {debt.voucher?.details && debt.voucher.details.length > 0 && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {debt.voucher.details.length} mặt hàng
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={debt.note}>
                        {debt.note || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {Number(debt.amount || 0).toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {Number(debt.balanceAfter || 0).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
