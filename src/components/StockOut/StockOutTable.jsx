import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import stockOutData from "../../datas/stockOutData";

export default function StockOutTable() {
  const [rows] = useState(stockOutData);

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-3">
        Hàng tiền
      </h3>

      <div className="overflow-hidden rounded-lg border border-cyan-200">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gradient-to-b from-cyan-200 to-cyan-100 text-slate-800">
        <th className="w-10 border-r border-cyan-300 px-2 py-2 text-center font-semibold">
          #
        </th>

        <th className="w-44 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          Mã hàng
        </th>

        <th className="border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          Tên hàng
        </th>

        <th className="w-32 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          Kho
        </th>

        <th className="w-28 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          TK Nợ
        </th>

        <th className="w-28 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          TK Có
        </th>

        <th className="w-28 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          ĐVT
        </th>

        <th className="w-40 border-r border-cyan-300 px-3 py-2 text-right font-semibold">
          Số lượng
        </th>

        <th className="w-40 border-r border-cyan-300 px-3 py-2 text-right font-semibold">
          Đơn giá
        </th>

        <th className="w-40 border-r border-cyan-300 px-3 py-2 text-right font-semibold">
          Thành tiền
        </th>

        <th className="w-40 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          Số lô
        </th>

        <th className="w-40 border-r border-cyan-300 px-3 py-2 text-left font-semibold">
          Hạn sử dụng
        </th>

        <th className="w-12"></th>
      </tr>
    </thead>

    <tbody>
      {rows.map((item) => (
        <tr
          key={item.id}
          className="bg-yellow-50 hover:bg-yellow-100"
        >
          <td className="border-r border-dashed border-cyan-300 px-2 py-1 text-center">
            {item.id}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1"></td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1"></td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1"></td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1">
            {item.debit}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1">
            {item.credit}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1">
            {item.unit}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1 text-right">
            {Number(item.quantity).toLocaleString("vi-VN", {
              minimumFractionDigits: 2,
            })}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1 text-right">
            {Number(item.price).toLocaleString("vi-VN", {
              minimumFractionDigits: 2,
            })}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1 text-right">
            {Number(item.amount).toLocaleString("vi-VN")}
          </td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1"></td>

          <td className="border-r border-dashed border-cyan-300 px-3 py-1"></td>

          <td className="text-center">
            <button className="text-gray-400 hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>

    <tfoot>
      <tr className="bg-gray-200 font-bold">
        <td colSpan={7}></td>

        <td className="px-3 py-1 text-right">
          1,00
        </td>

        <td></td>

        <td className="px-3 py-1 text-right">
          0
        </td>

        <td colSpan={3}></td>
      </tr>
    </tfoot>
  </table>
</div>

      <div className="mt-3 flex gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg">
          Thêm dòng
        </button>

        <button className="px-4 py-2 border border-gray-300 rounded-lg">
          Thêm ghi chú
        </button>

        <button className="px-4 py-2 border border-gray-300 rounded-lg">
          Xóa hết dòng
        </button>
      </div>
    </div>
  );
}