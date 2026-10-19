import React, { useEffect, useState } from "react";
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

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <div className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
        <StockHeader activeTab="takes" onRefresh={loadRows} />

        <div className="mt-4">
          <div className="min-w-0 flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
            <TableStock
              rows={rows}
              loading={loading}
              error={error}
              onRefresh={loadRows}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
