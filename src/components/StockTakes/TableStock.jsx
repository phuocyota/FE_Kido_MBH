import React, { useState } from "react";
import StockTakeModal from "./StockTakeModal";

export default function TableStock() {
  const data = []; // hiện đang trống như UI mẫu
  const [openStockTake, setOpenStockTake] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Phiếu kiểm kho</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenStockTake(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Kiểm kho
          </button>

          <button className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            Xuất file
          </button>
          
        </div>
      </div>

     
      {/* TABLE */}
<div className="overflow-x-auto">

  <div className="min-w-[1100px]">

    <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-blue-100 sticky top-0 z-10">
        <tr>
          <th className="p-3">
            <input type="checkbox" />
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Mã kiểm kho
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Thời gian
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Ngày cân bằng
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Tổng chênh lệch
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            SL lệch tăng
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            SL lệch giảm
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Ghi chú
          </th>

          <th className="p-3 text-left whitespace-nowrap">
            Trạng thái
          </th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 && (
          <tr>
            <td
              colSpan="9"
              className="text-center py-24 text-gray-400"
            >
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-3">📦</div>

                <p className="text-base">
                  Không tìm thấy phiếu kiểm kho nào phù hợp
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>

  </div>
</div>

<StockTakeModal open={openStockTake} onClose={() => setOpenStockTake(false)} />

    </div>
  );
}