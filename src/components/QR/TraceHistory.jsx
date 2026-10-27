import React from "react";
import { formatLabelDate } from "../Stock/lotLabelPrint";

export default function TraceHistory({ movements, inputs }) {
  return <>
    {inputs.length > 0 && <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 font-semibold text-slate-900">Nguyên liệu của mẻ</h3>
      <ul className="divide-y divide-slate-100 text-sm">{inputs.map((input, index) => <li key={input.lotId || index} className="py-3">
        <p className="font-semibold">{input.origin?.product?.name || "Nguyên liệu"}</p>
        <p className="mt-1 break-all text-slate-500">Lô: {input.origin?.lot?.code || input.lotId || "Chưa ghi nhận"}</p>
      </li>)}</ul>
    </section>}
    {movements.length > 0 && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <h3 className="border-b border-slate-100 p-5 font-semibold text-slate-900">Lịch sử xuất nhập</h3>
      <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500"><tr>{["Thời gian", "Số lượng", "Kho"].map((label) => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{movements.map((move, index) => <tr key={move.id || index}>
          <td className="p-3">{formatLabelDate(move.at || move.createdAt)}</td>
          <td className="p-3">{move.quantity ?? "Chưa ghi nhận"}</td>
          <td className="p-3">{move.stockName || "Chưa ghi nhận"}</td>
        </tr>)}</tbody>
      </table></div>
    </section>}
  </>;
}
