import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { supplierApi } from "../../api";
import AddSupplierModal from "../Suppliers/AddSupplierModal";

export default function PaymentVoucherSupplierSelect({ onChange }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openAddSupplier, setOpenAddSupplier] = useState(false);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await supplierApi.getAll("active", undefined, 1, 1000);
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (loadError) {
      console.error("Failed to fetch suppliers:", loadError);
      setSuppliers([]);
      setError("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleChange = (event) => {
    const supplierId = event.target.value;
    const supplier =
      suppliers.find((item) => String(item.id) === String(supplierId)) || null;

    setSelectedSupplierId(supplierId);
    onChange?.(supplier);
  };

  return (
    <>
      <div className="flex flex-1 min-w-0">
        <select
          value={selectedSupplierId}
          aria-label="Chọn nhà cung cấp trả nợ"
          onChange={handleChange}
          disabled={loading}
          className="flex-1 min-w-0 h-10 border border-gray-300 rounded-l-lg px-3 bg-white disabled:bg-gray-100"
        >
          <option value="">
            {loading
              ? "Đang tải danh sách nhà cung cấp..."
              : error || "Chọn nhà cung cấp"}
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id || supplier.code || supplier.name}
              value={supplier.id}
            >
              {[supplier.code, supplier.name].filter(Boolean).join(" - ")}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setOpenAddSupplier(true)}
          className="w-10 h-10 border border-gray-300 border-l-0 rounded-r-lg flex items-center justify-center hover:bg-gray-50"
          title="Thêm nhà cung cấp"
          aria-label="Thêm nhà cung cấp"
        >
          <Plus size={16} />
        </button>
      </div>

      <AddSupplierModal
        open={openAddSupplier}
        onClose={() => setOpenAddSupplier(false)}
        onSaved={loadSuppliers}
      />
    </>
  );
}
