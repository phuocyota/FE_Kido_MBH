import React from "react";
import { Plus } from "lucide-react";

export default function PaymentVoucherDetailTable({
  expenseType,
}) {
  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-400 flex items-center justify-between">
        <h2 className="font-semibold">
          Chi tiết phiếu chi
        </h2>

         
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[900px]">
          <div className="overflow-x-auto rounded-xl border border-gray-300">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gradient-to-r from-indigo-50 to-blue-200">
        <th className="border-b border-indigo-200 px-4 py-3 text-center w-16 text-xs font-semibold uppercase tracking-wide text-indigo-900">
          STT
        </th>

        <th className="border-b border-indigo-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
          Diễn giải
        </th>

        <th className="border-b border-indigo-200 px-4 py-3 text-left w-64 text-xs font-semibold uppercase tracking-wide text-indigo-900">
          Mục chi
        </th>

        <th className="border-b border-indigo-200 px-4 py-3 text-right w-52 text-xs font-semibold uppercase tracking-wide text-indigo-900">
          Số tiền
        </th>
      </tr>
    </thead>

    <tbody>
      <tr className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors">
        <td className="px-4 py-3 text-center font-medium">
          1
        </td>

        <td className="px-4 py-3 text-gray-700">
          Thanh toán tiền điện tháng 06
        </td>

        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Chi phí vận hành
          </span>
        </td>

        <td className="px-4 py-3 text-right font-semibold text-red-600">
          5.000.000 ₫
        </td>
      </tr>

      <tr className="border-b border-gray-300 hover:bg-indigo-50/60 transition-colors">
        <td className="px-4 py-3 text-center font-medium">
          2
        </td>

        <td className="px-4 py-3 text-gray-700">
          Thanh toán internet
        </td>

        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Chi phí dịch vụ
          </span>
        </td>

        <td className="px-4 py-3 text-right font-semibold text-red-600">
          800.000 ₫
        </td>
      </tr>

      <tr className="bg-gray-50">
        <td
          colSpan={3}
          className="px-4 py-4 text-right font-bold text-gray-800"
        >
          Tổng cộng
        </td>

        <td className="px-4 py-4 text-right text-lg font-bold text-red-600">
          5.800.000 ₫
        </td>
      </tr>
    </tbody>
  </table>
</div>
        </div>
      </div>

      
    </div>
  );
}