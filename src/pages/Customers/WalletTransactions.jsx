import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Search, RefreshCw, Wallet, ArrowDownLeft, ArrowUpRight, RotateCcw, ChevronDown, Sliders } from "lucide-react";
import toast from "react-hot-toast";
import { walletApi } from "../../api";

const typeOptions = [
  { value: "all", label: "Tất cả loại giao dịch", icon: Wallet, colorBg: "bg-indigo-50", colorText: "text-indigo-600", colorBorder: "border-indigo-200" },
  { value: "TOPUP", label: "Nạp tiền", icon: ArrowDownLeft, colorBg: "bg-emerald-50", colorText: "text-emerald-600", colorBorder: "border-emerald-200" },
  { value: "PAYMENT", label: "Thanh toán", icon: ArrowUpRight, colorBg: "bg-rose-50", colorText: "text-rose-600", colorBorder: "border-rose-200" },
  { value: "REFUND", label: "Hoàn tiền", icon: RotateCcw, colorBg: "bg-blue-50", colorText: "text-blue-600", colorBorder: "border-blue-200" },
  { value: "ADJUSTMENT", label: "Điều chỉnh số dư", icon: Sliders, colorBg: "bg-amber-50", colorText: "text-amber-600", colorBorder: "border-amber-200" },
];

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
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const sizeDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);
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
                <div className="w-full sm:w-[250px] relative" ref={typeDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 flex items-center justify-between transition hover:bg-gray-50 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2">
                      {(() => {
                        const selectedOption = typeOptions.find(opt => opt.value === typeFilter);
                        if (!selectedOption) return null;
                        const Icon = selectedOption.icon;
                        return (
                          <>
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${selectedOption.colorBg} ${selectedOption.colorText}`}>
                              <Icon size={14} />
                            </span>
                            <span className="font-medium text-gray-700">{selectedOption.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isTypeDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isTypeDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1.5 z-[100] bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                      {typeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = typeFilter === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setTypeFilter(option.value);
                              setCurrentPage(1);
                              setIsTypeDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-gray-50 text-left ${
                              isSelected ? "bg-indigo-50/50 font-semibold" : ""
                            }`}
                          >
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${option.colorBg} ${option.colorText} ${option.colorBorder}`}>
                              <Icon size={14} />
                            </span>
                            <span className={`flex-1 ${isSelected ? "text-indigo-600" : "text-gray-700"}`}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                <div className="relative inline-block" ref={sizeDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className="h-8 min-w-[90px] rounded-lg border border-gray-300 px-2.5 py-1 text-sm bg-white hover:bg-gray-50 flex items-center justify-between gap-1.5 font-medium text-gray-700 transition"
                  >
                    <span>{itemsPerPage} dòng</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isSizeDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isSizeDropdownOpen && (
                    <div className="absolute bottom-[calc(100%+6px)] left-0 z-[100] min-w-[100px] bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                      {[10, 15, 25, 50].map((size) => {
                        const isSelected = itemsPerPage === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setItemsPerPage(size);
                              setCurrentPage(1);
                              setIsSizeDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left transition-colors hover:bg-gray-50 ${
                              isSelected ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700"
                            }`}
                          >
                            {size} dòng
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
