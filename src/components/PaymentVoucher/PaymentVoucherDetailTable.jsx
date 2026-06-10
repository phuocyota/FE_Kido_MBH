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
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-blue-50 z-10 border-b border-gray-300">
              <tr>
                <th className="p-3 text-center w-16">
                  STT
                </th>

                <th className="p-3 text-left">
                  Diễn giải
                </th>

                <th className="p-3 text-left w-64">
                  Mục chi
                </th>

                <th className="p-3 text-right w-52">
                  Số tiền
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-3 text-center">
                  1
                </td>

                <td className="p-3">
                  -
                </td>

                <td className="p-3">
                  -
                </td>

                <td className="p-3 text-right">
                  0
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-400 px-4 py-4 flex justify-between lg:justify-end gap-5 lg:gap-12 bg-gray-50">
        <span className="font-semibold">
          TỔNG TIỀN
        </span>

        <span className="font-bold text-lg">
          0
        </span>
      </div>
    </div>
  );
}