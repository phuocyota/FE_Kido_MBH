import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Plus } from "lucide-react";
import { customerApi } from "../../api";
import AddCustomerModal from "../Customers/AddCustomerModal";

const formatDateTimeLocal = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default function StockOutInfo({
  customer,
  onChangeCustomer,
  note,
  onChangeNote,
}) {
  const [customerName, setCustomerName] = useState(customer?.fullName || "");
  const [customers, setCustomers] = useState([]);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [hasLoadedCustomers, setHasLoadedCustomers] = useState(false);
  const isLoadingCustomersRef = useRef(false);

  const defaultPostedAt = useMemo(() => formatDateTimeLocal(new Date()), []);

  const filteredCustomers = useMemo(() => {
    const keyword = customerName.trim().toLowerCase();
    if (!keyword) return customers;

    return customers.filter((cust) => {
      const name = cust.fullName || "";
      const code = cust.customerCode || "";
      const phone = cust.phone || "";

      return `${name} ${code} ${phone}`.toLowerCase().includes(keyword);
    });
  }, [customerName, customers]);

  const loadCustomers = useCallback(async () => {
    if (isLoadingCustomersRef.current) return;

    isLoadingCustomersRef.current = true;
    setLoadingCustomers(true);
    setCustomerError("");

    try {
      const data = await customerApi.getAllWithDebt();
      setCustomers(Array.isArray(data) ? data : []);
      setHasLoadedCustomers(true);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomerError("Không thể tải danh sách khách hàng");
      setCustomers([]);
    } finally {
      isLoadingCustomersRef.current = false;
      setLoadingCustomers(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.fullName || "");
    } else {
      setCustomerName("");
    }
  }, [customer]);

  const handleFocusCustomerInput = async () => {
    setShowCustomerList(true);
    if (!hasLoadedCustomers && !loadingCustomers) await loadCustomers();
  };

  const handleSelectCustomer = (selectedCustomer) => {
    setCustomerName(selectedCustomer.fullName || "");
    onChangeCustomer(selectedCustomer);
    setShowCustomerList(false);
  };

  const handleCustomerSaved = (createdCustomer) => {
    if (createdCustomer?.id) {
      setCustomers((current) => [
        createdCustomer,
        ...current.filter((item) => item.id !== createdCustomer.id),
      ]);
      handleSelectCustomer(createdCustomer);
    } else {
      loadCustomers();
    }
  };

  return (
    <div className="border-b border-gray-300 p-3 md:p-4">
      {/* Click outside to close dropdown */}
      {showCustomerList && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCustomerList(false)}
        ></div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 relative">
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={`relative ${showCustomerList ? "z-50" : ""}`}>
              <label className="mb-1 block text-sm font-medium">
                Tìm khách hàng <span className="text-red-500">*</span>
              </label>

              <div className="flex">
                <input
                  value={customerName}
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                    setShowCustomerList(true);
                  }}
                  onClick={handleFocusCustomerInput}
                  onFocus={handleFocusCustomerInput}
                  placeholder="Nhập tên, mã hoặc SĐT để tìm"
                  className="min-w-0 flex-1 h-10 rounded-l border border-gray-300 px-3 bg-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerList(false);
                    setOpenAddCustomer(true);
                  }}
                  title="Thêm khách hàng"
                  aria-label="Thêm khách hàng"
                  className="h-10 w-10 rounded-r-md border border-l-0 border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              {showCustomerList && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
                  {loadingCustomers && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Đang tải danh sách khách hàng...
                    </div>
                  )}

                  {!loadingCustomers && customerError && (
                    <div className="px-3 py-2 text-sm text-red-600">
                      {customerError}
                    </div>
                  )}

                  {!loadingCustomers &&
                    !customerError &&
                    filteredCustomers.map((cust) => (
                      <button
                        type="button"
                        key={cust.id || cust.customerCode || cust.fullName}
                        onClick={() => handleSelectCustomer(cust)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
                      >
                        <span className="block font-medium text-gray-900 font-semibold">
                          {cust.fullName}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {[cust.customerCode, cust.phone]
                            .filter(Boolean)
                            .join(" - ")}
                        </span>
                      </button>
                    ))}

                  {!loadingCustomers &&
                    !customerError &&
                    filteredCustomers.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Không tìm thấy khách hàng
                      </div>
                    )}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Mã khách hàng
              </label>
              <input
                value={customer?.customerCode || ""}
                readOnly
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 cursor-not-allowed"
                placeholder="Mã khách hàng tự động điền"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Người nhận
              </label>
              <input
                value={customer?.fullName || ""}
                readOnly
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 cursor-not-allowed"
                placeholder="Người nhận"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
              <input
                value={customer?.phone ? `SĐT: ${customer.phone}` : ""}
                readOnly
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 cursor-not-allowed"
                placeholder="Địa chỉ/Số điện thoại"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Nhân viên bán hàng
              </label>
              <input
                value="Admin"
                readOnly
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Lý do xuất
              </label>
              <input
                value={note}
                onChange={(e) => onChangeNote(e.target.value)}
                placeholder="Xuất kho bán hàng"
                className="w-full h-10 rounded border border-gray-300 px-3 bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Ngày hạch toán
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  defaultValue={defaultPostedAt}
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Ngày chứng từ
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  defaultValue={defaultPostedAt}
                  className="w-full h-10 rounded border border-gray-300 px-3 bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Số chứng từ
              </label>
              <input
                value="XK000001 (Tự động)"
                readOnly
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
      <AddCustomerModal
        open={openAddCustomer}
        onClose={() => setOpenAddCustomer(false)}
        onSaved={handleCustomerSaved}
      />
    </div>
  );
}
