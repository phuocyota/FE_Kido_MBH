import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { defaultStockInFilters, matchesStockInFilters, validateStockInFilters } from "../../components/StockIn/stockInFilters";
import { useNavigate } from "react-router-dom";
import { stockInApi } from "../../api";
import StockHeader from "../../components/Stock/StockHeader";
import StockInDetailTable from "../../components/StockIn/StockInDetailTable";
import StockInListTable from "../../components/StockIn/StockInListTable";
import StockInPurposeChoices from "../../components/StockIn/StockInPurposeChoices";
import StockInListToolbar from "../../components/StockIn/StockInListToolbar";
import StockInPagination from "../../components/StockIn/StockInPagination";
import StockSidebarFilters from "../../components/Stock/StockSidebarFilters";

export default function StockInList() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadedDetailIds, setLoadedDetailIds] = useState(() => new Set());
  const [error, setError] = useState("");
  const [isWideView, setIsWideView] = useState(false);
  const [filterDraft, setFilterDraft] = useState(defaultStockInFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultStockInFilters);
  const applyFilters = (values) => {
    const error = validateStockInFilters(values);
    if (error) { toast.error(error); return false; }
    setAppliedFilters({ ...values });
    setCurrentPage(1);
    return true;
  };
  const resetFilters = () => {
    setFilterDraft(defaultStockInFilters);
    setAppliedFilters(defaultStockInFilters);
    setCurrentPage(1);
  };

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await stockInApi.getAll();
      setReceipts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể tải danh sách phiếu nhập kho"
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

    const matchingReceipts = receipts.filter((receipt) => matchesStockInFilters(receipt, appliedFilters));
    if (!keyword) return matchingReceipts;

    return matchingReceipts.filter((receipt) =>
      [
        receipt.postedDate,
        receipt.voucherNo,
        receipt.description,
        receipt.deliverer,
        receipt.voucherType,
        receipt.branch,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [receipts, searchKeyword, appliedFilters]);

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
        const receiptDetail = await stockInApi.getById(selectedReceipt.id);
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
            err?.response?.data?.message || "Không thể tải chi tiết phiếu nhập kho"
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

  const handleCreateClick = (reasonCode) => {
    navigate(`/stock-in/create?reasonCode=${reasonCode}`);
  };

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <div
        className={`mx-auto w-full px-3 py-4 sm:px-4 lg:px-5 ${
          isWideView ? "max-w-none" : "max-w-[1600px]"
        }`}
      >
        <StockHeader
          activeTab="in"
          onRefresh={loadReceipts}
        />

        <StockInPurposeChoices onChoose={handleCreateClick} />

        <div
          className={`mt-4 grid grid-cols-1 gap-4 ${
            isWideView ? "" : "xl:grid-cols-[320px_minmax(0,1fr)]"
          }`}
        >
          {!isWideView && (
            <aside className="min-w-0">
              <StockSidebarFilters type="in" filters={filterDraft} onFiltersChange={setFilterDraft} onApplyFilters={applyFilters} onResetFilters={resetFilters} />
            </aside>
          )}

          <div className="min-w-0 flex flex-col overflow-hidden border border-gray-300 bg-white shadow-sm rounded-xl">
            <StockInListToolbar
              filters={filterDraft} onFiltersChange={setFilterDraft} onApplyFilters={applyFilters} onResetFilters={resetFilters}
              searchKeyword={searchKeyword}
              onSearchChange={handleSearchChange}
              showFilterButton={isWideView}
              isWideView={isWideView}
              onToggleWideView={() => setIsWideView((current) => !current)}
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

          <StockInListTable
            receipts={visibleReceipts}
            selectedReceipt={selectedReceipt}
            onSelectReceipt={setSelectedReceiptId}
          />

          <StockInPagination
            total={filteredReceipts.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />

            <StockInDetailTable receipt={selectedReceipt} />
          </div>
        </div>
      </div>
    </div>
  );
}
