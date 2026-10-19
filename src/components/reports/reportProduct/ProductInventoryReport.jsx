import React, { useCallback, useEffect, useRef, useState } from "react";
import { reportApi } from "../../../api";
import { filterProductReportRows } from "./productReportData";

export default function ProductInventoryReport({ branchId, branch, ...filters }) {
  const request = useRef(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const id = ++request.current;
    setLoading(true); setError("");
    try {
      const result = await reportApi.getInventory(branchId);
      if (!Array.isArray(result)) throw new Error("Dữ liệu báo cáo tồn kho không hợp lệ");
      if (id === request.current) setData(result);
    } catch (error) {
      if (id === request.current) { setData([]); setError(error.response?.data?.message || error.message); }
    } finally { if (id === request.current) setLoading(false); }
  }, [branchId]);
  useEffect(() => { load(); return () => { request.current += 1; }; }, [load]);
  const rows = filterProductReportRows(data, filters);
  return <div aria-busy={loading} className="min-w-[1000px] bg-white p-8">
    <h1 className="text-center text-3xl font-bold">Báo cáo tồn kho hiện tại</h1>
    <p className="my-3 text-center text-slate-600">{branch} · Số tồn tại thời điểm tải báo cáo</p>
    <table className="w-full border-collapse text-sm"><thead><tr className="bg-slate-100">{["STT", "Mã hàng", "Tên sản phẩm", "Đơn vị tính", "Tồn hiện tại"].map(label => <th key={label} className="border border-slate-300 p-3 text-left">{label}</th>)}</tr></thead>
      <tbody>{loading ? <tr><td colSpan={5} className="p-6 text-center">Đang tải báo cáo...</td></tr> : error ? <tr><td colSpan={5} role="alert" className="p-6 text-red-700">{error} <button onClick={load} className="underline">Thử lại</button></td></tr> : !rows.length ? <tr><td colSpan={5} className="p-6 text-center">Không có sản phẩm phù hợp</td></tr> : rows.map((row, index) => <tr key={row.productId}>
        <td className="border border-slate-300 p-3">{index + 1}</td><td className="border border-slate-300 p-3">{row.code}</td><td className="border border-slate-300 p-3">{row.name}</td><td className="border border-slate-300 p-3">{row.unit}</td><td className="border border-slate-300 p-3 text-right">{Number(row.quantity || 0).toLocaleString("vi-VN")}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
