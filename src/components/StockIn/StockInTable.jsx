import React from "react";

export default function StockInTable({ items }) {
  return (
    <div className="flex-1 p-4 overflow-auto">

      <h2 className="font-semibold mb-3">
        CHI TIẾT
      </h2>

      <div className="flex-1 overflow-auto border rounded">
  <div className="min-w-[2400px]">

        <table className="w-full text-sm">

          <thead className="sticky top-0 bg-gray-100 z-10">
  <tr className="text-xs whitespace-nowrap">

    <th className="border p-2 min-w-[110px]">Mã hàng hóa</th>

    <th className="border p-2 min-w-[180px]">Tên hàng hóa</th>

    <th className="border p-2 min-w-[120px]">Kho</th>

    <th className="border p-2 min-w-[120px]">Vị trí lưu kho</th>

    <th className="border p-2 min-w-[90px]">Đơn vị tính</th>

    <th className="border p-2 min-w-[90px]">Số lượng</th>

    <th className="border p-2 min-w-[100px]">Đơn giá</th>

    <th className="border p-2 min-w-[110px]">Thành tiền</th>

    <th className="border p-2 min-w-[90px]">% chiết khấu</th>

    <th className="border p-2 min-w-[110px]">Tiền chiết khấu</th>

    <th className="border p-2 min-w-[90px]">Thuế suất</th>

    <th className="border p-2 min-w-[100px]">Tiền thuế</th>

    <th className="border p-2 min-w-[120px]">Tiền thanh toán</th>

    <th className="border p-2 min-w-[120px]">Chi phí mua hàng</th>

    <th className="border p-2 min-w-[120px]">Giá trị nhập kho</th>

    <th className="border p-2 min-w-[140px]">Đơn giá vốn trước thuế</th>

    <th className="border p-2 min-w-[140px]">Đơn giá vốn sau thuế</th>

  </tr>
</thead>

          <tbody>
  {items.map((item) => (
    <tr key={item.id} className="text-sm">

      <td className="border p-2"></td>

      <td className="border p-2"></td>

      <td className="border p-2">Kho mặc định</td>

      <td className="border p-2">--</td>

      <td className="border p-2">--</td>

      <td className="border p-2 text-center">1</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2">0%</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

      <td className="border p-2 text-right">0</td>

    </tr>
  ))}
</tbody>

          <tfoot className="sticky bottom-0 bg-gray-100 font-semibold">
  <tr>

    <td colSpan={7}></td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td></td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

    <td className="border p-2 text-right">0</td>

  </tr>
</tfoot>

        </table>

      </div>
      </div>
    </div>
  );
}