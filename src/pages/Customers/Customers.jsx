import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, RefreshCw, FileSpreadsheet, Edit2, Wallet, Users } from "lucide-react";
import toast from "react-hot-toast";
import { customerApi } from "../../api";
import AddCustomerModal from "../../components/Customers/AddCustomerModal";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await customerApi.getAll();
      setCustomers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch {
      setCustomers([]);
      setError("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const openCreateModal = () => {
    setSelectedCustomer(null);
    setOpenAddCustomer(true);
  };

  const handleEditCustomer = (cust) => {
    setSelectedCustomer(cust);
    setOpenAddCustomer(true);
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return customers;

    return customers.filter((cust) => {
      const name = cust.fullName || "";
      const code = cust.customerCode || "";
      const phone = cust.phone || "";
      const email = cust.email || "";

      return `${name} ${code} ${phone} ${email}`.toLowerCase().includes(keyword);
    });
  }, [search, customers]);

  const totalDebt = useMemo(() => {
    return filteredCustomers.reduce((sum, cust) => sum + Number(cust.debt || 0), 0);
  }, [filteredCustomers]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 py-3 md:py-4">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Quản lý khách hàng
          </h1>
          <button
            onClick={loadCustomers}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition self-start lg:self-auto"
          >
            <RefreshCw size={14} />
            Dữ liệu mới
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                <Users size={28} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Tổng số khách hàng</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  {filteredCustomers.length} khách hàng
                </h2>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                <Wallet size={28} className="text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Tổng công nợ khách hàng cần thu</p>
                <h2 className="text-2xl font-bold text-rose-600 mt-1">
                  {formatNumber(totalDebt)} ₫
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-300 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã, tên, SĐT, email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 w-full sm:w-[320px] lg:w-[420px] rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={loadCustomers}
                  className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
                  title="Tải lại"
                >
                  <RefreshCw size={17} className="text-gray-600" />
                </button>

                <button
                  className="min-w-10 w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
                  title="Xuất Excel"
                >
                  <FileSpreadsheet size={17} className="text-green-600" />
                </button>

                <button
                  onClick={openCreateModal}
                  className="h-10 px-4 bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition rounded-xl whitespace-nowrap shadow-sm"
                >
                  <Plus size={18} />
                  Thêm khách hàng
                </button>
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
                  <th className="border-b border-indigo-200 px-4 py-3 w-12 text-center">
                    <input type="checkbox" />
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Mã khách hàng
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Tên khách hàng
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Số điện thoại
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Email
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Địa chỉ
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Dư nợ khách hàng
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Hạn mức nợ còn lại
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Trạng thái
                  </th>
                  <th className="border-b border-indigo-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-indigo-900">
                    Chức năng
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-gray-500 bg-white">
                      Đang tải danh sách khách hàng...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-red-500 bg-white">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  currentCustomers.map((cust) => {
                    const hasDebt = Number(cust.debt || 0) > 0;
                    return (
                      <tr
                        key={cust.id || cust.customerCode}
                        className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors bg-white"
                      >
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEditCustomer(cust)}
                            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            {cust.customerCode || "KH000" + cust.id}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-semibold">{cust.fullName}</td>
                        <td className="px-4 py-3 text-gray-700">{cust.phone || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{cust.email || "-"}</td>
                        <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]" title={cust.address}>
                          {cust.address || "-"}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${hasDebt ? "text-red-600" : "text-gray-700"}`}>
                          {formatNumber(cust.debt)} ₫
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-700">
                          {formatNumber(cust.debtLimit)} ₫
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              cust.status === "inactive"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {cust.status === "inactive" ? "Ngừng hoạt động" : "Đang hoạt động"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleEditCustomer(cust)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition font-medium"
                            >
                              <Edit2 size={13} />
                              Sửa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {!loading && !error && filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-gray-500 bg-white">
                      Không tìm thấy khách hàng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-300 bg-gray-50">
            <div className="text-sm text-gray-700">
              Tổng số khách hàng: <span className="font-semibold">{filteredCustomers.length}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Số bản ghi</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-9 border border-gray-300 rounded-md px-3 bg-white"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                >
                  &lt;
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                  className="h-9 w-9 border border-gray-300 rounded-md bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCustomerModal
        open={openAddCustomer}
        onClose={() => {
          setOpenAddCustomer(false);
          setSelectedCustomer(null);
        }}
        onSaved={loadCustomers}
        initialData={selectedCustomer}
      />
    </div>
  );
}
