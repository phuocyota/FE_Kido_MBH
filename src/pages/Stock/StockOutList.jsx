import React, { useEffect, useMemo, useState } from "react";
import { stockOutApi } from "../../api";
import StockHeader from "../../components/Stock/StockHeader";
import StockOutListTable from "../../components/StockOut/StockOutListTable";
import StockOutToolbar from "../../components/StockOut/StockOutToolbar";
import StockOutPagination from "../../components/StockOut/StockOutPagination";
import StockOutDetailTable from "../../components/StockOut/StockOutDetailTable";

export default function StockOutList() {
  const [receipts, setReceipts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadedDetailIds, setLoadedDetailIds] = useState(() => new Set());
  const [error, setError] = useState("");

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await stockOutApi.getAll();
      setReceipts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể tải danh sách phiếu xuất kho"
      );
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return receipts;

    return receipts.filter((receipt) =>
      [
        receipt.postedDate,
        receipt.voucherNo,
        receipt.description,
        receipt.receiver,
        receipt.voucherType,
        receipt.branch,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [receipts, searchKeyword]);

  useEffect(() => {
    if (!filteredReceipts.length) {
      setSelectedReceiptId(null);
      return;
    }

    const selectedStillVisible = filteredReceipts.some(
      (receipt) => receipt.id === selectedReceiptId
    );

    if (!selectedStillVisible) {
      setSelectedReceiptId(filteredReceipts[0].id);
    }
  }, [filteredReceipts, selectedReceiptId]);

  useEffect(() => {
    const selectedReceipt = receipts.find(
      (receipt) => receipt.id === selectedReceiptId
    );

    if (
      !selectedReceipt ||
      selectedReceipt.details?.length ||
      loadedDetailIds.has(selectedReceipt.id)
    ) {
      return;
    }

    let ignore = false;

    const loadDetail = async () => {
      try {
        setDetailLoading(true);
        setLoadedDetailIds((prev) => new Set(prev).add(selectedReceipt.id));
        const receiptDetail = await stockOutApi.getById(selectedReceipt.id);
        if (ignore) return;

        setReceipts((prev) =>
          prev.map((receipt) =>
            receipt.id === selectedReceipt.id
              ? { ...receipt, ...receiptDetail }
              : receipt
          )
        );
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message || "Không thể tải chi tiết phiếu xuất kho"
          );
        }
      } finally {
        if (!ignore) setDetailLoading(false);
      }
    };

    loadDetail();

    return () => {
      ignore = true;
    };
  }, [loadedDetailIds, receipts, selectedReceiptId]);

  const visibleReceipts = filteredReceipts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selectedReceipt =
    filteredReceipts.find((receipt) => receipt.id === selectedReceiptId) ||
    filteredReceipts[0] ||
    null;

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const totalAmount = useMemo(() => {
    return filteredReceipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
  }, [filteredReceipts]);

  return (
    <div className="min-h-screen bg-gray-100 py-3 md:py-4">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-5">
        <StockHeader
          activeTab="out"
          onRefresh={loadReceipts}
          totalCount={filteredReceipts.length}
          totalAmount={totalAmount}
        />

        <div className="mt-4 flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
          <StockOutToolbar
            searchKeyword={searchKeyword}
            onSearchChange={handleSearchChange}
          />

          {(loading || detailLoading || error) && (
            <div className="border-b border-gray-300 bg-white px-4 py-3 text-sm">
              {loading && (
                <span className="text-slate-500">Đang tải dữ liệu...</span>
              )}
              {!loading && detailLoading && (
                <span className="text-slate-500">Đang tải chi tiết...</span>
              )}
              {error && <span className="text-red-600">{error}</span>}
            </div>
          )}

          <StockOutListTable
            receipts={visibleReceipts}
            selectedReceipt={selectedReceipt}
            onSelectReceipt={setSelectedReceiptId}
          />

          <StockOutPagination
            total={filteredReceipts.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />

          <StockOutDetailTable receipt={selectedReceipt} />
        </div>
      </div>
    </div>
  );
}
