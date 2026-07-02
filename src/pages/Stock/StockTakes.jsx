import React, { useEffect, useState, useMemo } from "react";
import StockHeader from "../../components/Stock/StockHeader";
import TableStock from "../../components/StockTakes/TableStock";
import { stockTakeApi } from "../../api";

export default function StockTakes() {
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

  const totalAmount = useMemo(() => {
    return rows.reduce((sum, r) => sum + Number(r.totalDifferenceAmount || 0), 0);
  }, [rows]);

  return (
    <div className="min-h-screen bg-gray-100 py-3 md:py-4">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        <StockHeader
          activeTab="takes"
          onRefresh={loadRows}
          totalCount={rows.length}
          totalAmount={totalAmount}
        />

        <div className="mt-4 flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
          <TableStock
            rows={rows}
            loading={loading}
            error={error}
            onRefresh={loadRows}
          />
        </div>
      </div>
    </div>
  );
}
