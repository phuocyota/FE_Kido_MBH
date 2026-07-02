import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Wallet, ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { walletApi } from "../../api";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTxTypeBadge = (type) => {
  switch (type) {
    case "TOPUP":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ArrowDownLeft size={12} />
          Nạp tiền
        </span>
      );
    case "PAYMENT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
          <ArrowUpRight size={12} />
          Thanh toán
        </span>
      );
    case "REFUND":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
          <RotateCcw size={12} />
          Hoàn tiền
        </span>
      );
    case "ADJUSTMENT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          Điều chỉnh
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
          {type}
        </span>
      );
  }
};

export default function WalletTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalItems, setTotalItems] = useState(0);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await walletApi.getTransactions({
        page: currentPage,
        size: itemsPerPage,
        search: search.trim(),
        type: typeFilter,
      });

      if (response) {
        setTransactions(response.data || []);
        setTotalItems(response.total || 0);
      } else {
        setTransactions([]);
        setTotalItems(0);
      }
    } catch (err) {
      setTransactions([]);
      setTotalItems(0);
      setError("Không thể tải lịch sử giao dịch ví");
      toast.error("Lỗi khi tải lịch sử giao dịch ví");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search, typeFilter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage) || 1;
  }, [totalItems, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Local page statistics
  const stats = useMemo(() => {
    let deposits = 0;
    let payments = 0;
    let refunds = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.type === "TOPUP") {
        deposits += amt;
      } else if (tx.type === "PAYMENT") {
        payments += Math.abs(amt);
      } else if (tx.type === "REFUND") {
        refunds += amt;
      }
    });

    return { deposits, payments, refunds };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-6">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Lịch sử giao dịch ví thành viên</h1>
            <p className="text-gray-500 text-sm mt-1">
              Theo dõi và đối soát toàn bộ các giao dịch nạp tiền, hoàn tiền, thanh toán ví của khách hàng
            </p>
          </div>
          <button
            onClick={loadTransactions}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Tải lại dữ liệu
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <ArrowDownLeft size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Tổng nạp trong trang</p>
                <h2 className="text-xl font-bold text-emerald-600 mt-1">
                  +{formatNumber(stats.deposits)} ₫
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <ArrowUpRight size={24} className="text-rose-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Tổng chi trong trang</p>
                <h2 className="text-xl font-bold text-rose-600 mt-1">
                  -{formatNumber(stats.payments)} ₫
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <RotateCcw size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Tổng hoàn trong trang</p>
                <h2 className="text-xl font-bold text-blue-600 mt-1">
                  +{formatNumber(stats.refunds)} ₫
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table Container */}
        <div className="flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-300 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-[320px] lg:w-[420px]">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã KH, tên KH, ghi chú..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Type Filter */}
                <div className="w-full sm:w-[200px]">
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="all">Tất cả loại giao dịch</option>
                    <option value="TOPUP">Nạp tiền</option>
                    <option value="PAYMENT">Thanh toán</option>
                    <option value="REFUND">Hoàn tiền</option>
                    <option value="ADJUSTMENT">Điều chỉnh số dư</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 w-44">
                    Thời gian
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 w-36">
                    Mã GD
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 w-64">
                    Khách hàng
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 w-36">
                    Loại GD
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900 w-40">
                    Số tiền
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900 w-40">
                    Số dư sau GD
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Ghi chú
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900 w-44">
                    Người thực hiện
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-500 font-medium">
                      Đang tải lịch sử giao dịch...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-red-500 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                      Không tìm thấy giao dịch ví nào
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isPositive = tx.type === "TOPUP" || tx.type === "REFUND";
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {formatDateTime(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-semibold tracking-wider">
                          {tx.id ? tx.id.slice(0, 8).toUpperCase() : ""}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-semibold text-gray-900">{tx.customer?.fullName || "N/A"}</div>
                            <div className="text-xs text-gray-500 font-mono">{tx.customer?.customerCode || ""}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getTxTypeBadge(tx.type)}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                          {isPositive ? "+" : "-"}
                          {formatNumber(Math.abs(tx.amount))} ₫
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                          {formatNumber(tx.balanceAfter)} ₫
                        </td>
                        <td className="px-4 py-3 text-gray-600 break-words max-w-xs">
                          {tx.note || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {tx.createdByUser?.fullName || tx.createdByUser?.username || "Hệ thống"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && !error && totalItems > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Hiển thị</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm bg-white"
                >
                  <option value={10}>10 dòng</option>
                  <option value={15}>15 dòng</option>
                  <option value={25}>25 dòng</option>
                  <option value={50}>50 dòng</option>
                </select>
                <span className="text-sm text-gray-500">
                  trong tổng số {totalItems} giao dịch
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-9 px-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                >
                  Trước
                </button>
                <span className="text-sm font-semibold text-gray-800 px-2">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="h-9 px-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
