import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StockInDetailTable from "../../components/StockIn/StockInDetailTable";
import StockInListTable from "../../components/StockIn/StockInListTable";
import StockInListToolbar from "../../components/StockIn/StockInListToolbar";
import StockInPagination from "../../components/StockIn/StockInPagination";
import { stockInReceiptsData } from "../../datas/stockInListData";

export default function StockInList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReceiptId, setSelectedReceiptId] = useState(
    stockInReceiptsData[0]?.id
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return stockInReceiptsData;

    // Lọc dữ liệu mẫu theo các trường người dùng thường tìm trên danh sách nhập kho.
    return stockInReceiptsData.filter((receipt) =>
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
  }, [searchKeyword]);

  const visibleReceipts = filteredReceipts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selectedReceipt =
    filteredReceipts.find((receipt) => receipt.id === selectedReceiptId) ||
    filteredReceipts[0] ||
    null;

  const handleCreateClick = () => {
    navigate("/stock-in/create");
  };

  const handleSearchChange = (value) => {
    // Khi tìm kiếm, đưa người dùng về trang đầu để luôn thấy kết quả mới nhất.
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    // Khi đổi số dòng hiển thị, reset trang để tránh rơi vào trang không còn dữ liệu.
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-cyan-50 sm:p-2">
      <div className="mx-auto flex max-w-[1800px] min-w-0 flex-col overflow-hidden border-cyan-200 bg-white shadow-sm sm:border">
        <StockInListToolbar
          searchKeyword={searchKeyword}
          onSearchChange={handleSearchChange}
          onCreateClick={handleCreateClick}
        />

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
  );
}
