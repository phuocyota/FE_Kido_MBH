import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { supplierApi } from "../../api";

export default function StockInInfo() {
  const [supplierName, setSupplierName] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierList, setShowSupplierList] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierError, setSupplierError] = useState("");

  const filteredSuppliers = useMemo(() => {
    const keyword = supplierName.trim().toLowerCase();
    if (!keyword) return suppliers;

    return suppliers.filter((supplier) => {
      const name = supplier.name || "";
      const code = supplier.code || "";
      const phone = supplier.phone || "";

      return `${name} ${code} ${phone}`.toLowerCase().includes(keyword);
    });
  }, [supplierName, suppliers]);

  const handleOpenSupplierList = async () => {
    const nextOpen = !showSupplierList;
    setShowSupplierList(nextOpen);

    if (!nextOpen) return;

    setLoadingSuppliers(true);
    setSupplierError("");

    try {
      const data = await supplierApi.getAll();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      setSupplierError("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleSelectSupplier = (supplier) => {
    setSupplierName(supplier.name || "");
    setShowSupplierList(false);
  };

  return (
    <div className="border-b border-gray-300 p-3 md:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-9">
          <label className="mb-1 block text-sm font-medium">
            Nhà cung cấp <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="flex">
              <input
                value={supplierName}
                onChange={(event) => {
                  setSupplierName(event.target.value);
                  if (suppliers.length > 0) setShowSupplierList(true);
                }}
                className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Chọn nhà cung cấp"
              />

              <button
                type="button"
                onClick={handleOpenSupplierList}
                disabled={loadingSuppliers}
                className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>

            {showSupplierList && (
              <div className="absolute left-0 right-10 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
                {loadingSuppliers && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Đang tải danh sách nhà cung cấp...
                  </div>
                )}

                {!loadingSuppliers && supplierError && (
                  <div className="px-3 py-2 text-sm text-red-600">
                    {supplierError}
                  </div>
                )}

                {!loadingSuppliers &&
                  !supplierError &&
                  filteredSuppliers.map((supplier) => (
                    <button
                      type="button"
                      key={supplier.id || supplier.code || supplier.name}
                      onClick={() => handleSelectSupplier(supplier)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="block font-medium text-gray-900">
                        {supplier.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {[supplier.code, supplier.phone].filter(Boolean).join(" - ")}
                      </span>
                    </button>
                  ))}

                {!loadingSuppliers &&
                  !supplierError &&
                  filteredSuppliers.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Không có nhà cung cấp
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-sm font-medium">
            Số phiếu <span className="text-red-500">*</span>
          </label>

          <input
            value="NK000001"
            readOnly
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2"
          />
        </div>

        <div className="md:col-span-9">
          <label className="mb-1 block text-sm font-medium">Diễn giải</label>

          <input
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Nhập diễn giải"
          />
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-sm font-medium">
            Thời gian <span className="text-red-500">*</span>
          </label>

          <input
            type="datetime-local"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-5">
          <label className="mb-1 block text-sm font-medium">
            Ký hiệu hóa đơn
          </label>

          <input
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="VD: 1C24TYY"
          />
        </div>

        <div className="md:col-span-4">
          <label className="mb-1 block text-sm font-medium">Số hóa đơn</label>

          <input
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Nhập số hóa đơn"
          />
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-sm font-medium">
            Người lập phiếu
          </label>

          <input
            value="Admin"
            readOnly
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
