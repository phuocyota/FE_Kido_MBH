import React, { useMemo, useState } from "react";
import StockOutDetailPanel from "../../components/StockOut/StockOutDetailPanel";
import StockOutListTable from "../../components/StockOut/StockOutListTable";
import StockOutToolbar from "../../components/StockOut/StockOutToolbar";
import { stockOutReceiptsData } from "../../datas/stockOutListData";

export default function StockOutList() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return stockOutReceiptsData;

    // Khi có dữ liệu thật, bộ lọc này sẽ tìm theo các trường chính trên danh sách xuất kho.
    return stockOutReceiptsData.filter((receipt) =>
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
  }, [searchKeyword]);

  return (
    <div className="min-h-screen bg-cyan-50 sm:p-2">
      <div className="mx-auto flex max-w-[1800px] min-w-0 flex-col overflow-hidden border-cyan-200 bg-white shadow-sm sm:border">
        <StockOutToolbar
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />

        <StockOutListTable receipts={filteredReceipts} />

        <StockOutDetailPanel />
      </div>
    </div>
  );
}
