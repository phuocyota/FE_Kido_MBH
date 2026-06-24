import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StockTransferDetailPanel from "../../components/StockTransfer/StockTransferDetailPanel";
import StockTransferListTable from "../../components/StockTransfer/StockTransferListTable";
import StockTransferListToolbar from "../../components/StockTransfer/StockTransferListToolbar";
import { stockTransferApi } from "../../api";

export default function StockTransferList() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [selectedTransferId, setSelectedTransferId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTransfers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await stockTransferApi.getAll();
      const safeData = Array.isArray(data) ? data : [];
      setTransfers(safeData);
      setSelectedTransferId((current) => current || safeData[0]?.id || "");
    } catch (err) {
      setTransfers([]);
      setSelectedTransferId("");
      setError(
        err?.response?.data?.message || "Không thể tải danh sách phiếu chuyển kho"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const filteredTransfers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return transfers;

    return transfers.filter((transfer) =>
      [
        transfer.code,
        transfer.voucherNo,
        transfer.note,
        transfer.status,
        transfer.fromBranch?.name,
        transfer.toBranch?.name,
        transfer.fromBranchId,
        transfer.toBranchId,
        transfer.transporterName,
        transfer.carrierName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchKeyword, transfers]);

  const selectedTransfer =
    filteredTransfers.find((transfer) => transfer.id === selectedTransferId) ||
    filteredTransfers[0] ||
    null;

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setSelectedTransferId("");
  };

  return (
    <div className="min-h-screen bg-cyan-50 sm:p-2">
      <div className="mx-auto flex max-w-[1800px] min-w-0 flex-col overflow-hidden border-cyan-200 bg-white shadow-sm sm:border">
        <StockTransferListToolbar
          searchKeyword={searchKeyword}
          onSearchChange={handleSearchChange}
          onCreateClick={() => navigate("/stock-transfer/create")}
          onReload={loadTransfers}
        />

        <StockTransferListTable
          transfers={filteredTransfers}
          selectedTransfer={selectedTransfer}
          onSelectTransfer={setSelectedTransferId}
          loading={loading}
          error={error}
        />

        <StockTransferDetailPanel transfer={selectedTransfer} />
      </div>
    </div>
  );
}
