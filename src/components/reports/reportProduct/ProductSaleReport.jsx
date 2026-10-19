import React, { useCallback, useEffect, useRef, useState } from "react";
import { reportApi } from "../../../api";
import { aggregateProductSales, filterProductReportRows, validateReportDates } from "./productReportData";

const number = value => Number(value || 0).toLocaleString("vi-VN");

export default function ProductSaleReport({ fromDate, toDate, branchId, branch, ...filters }) {
  const request = useRef(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const id = ++request.current;
    setLoading(true);
    setError("");
    try {
      validateReportDates(fromDate, toDate);
      const result = await reportApi.getEndOfDay(fromDate, toDate, branchId);
      if (!Array.isArray(result?.data)) throw new Error("Dữ liệu báo cáo bán hàng không hợp lệ");
      if (id === request.current) setData(result.data);
    } catch (error) {
      if (id === request.current) { setData([]); setError(error.response?.data?.message || error.message); }
    } finally { if (id === request.current) setLoading(false); }
  }, [fromDate, toDate, branchId]);
  useEffect(() => { load(); return () => { request.current += 1; }; }, [load]);
  const rows = aggregateProductSales(filterProductReportRows(data, filters));
  return <div aria-busy={loading} className="min-w-[1000px] bg-white p-8">
    <h1 className="text-center text-3xl font-bold">Báo cáo bán hàng theo sản phẩm</h1>
    <p className="my-3 text-center text-slate-600">{branch} · Từ {fromDate} đến {toDate}</p>
    <table className="w-full border-collapse text-sm">
      <thead><tr className="bg-slate-100">{["STT", "Mã hàng", "Tên sản phẩm", "Số lượng bán", "Doanh thu"].map(label => <th key={label} className="border border-slate-300 p-3 text-left">{label}</th>)}</tr></thead>
      <tbody>
        {loading ? <tr><td colSpan={5} className="p-6 text-center">Đang tải báo cáo...</td></tr> : error ? <tr><td colSpan={5} role="alert" className="p-6 text-red-700">{error} <button onClick={load} className="underline">Thử lại</button></td></tr> : !rows.length ? <tr><td colSpan={5} className="p-6 text-center">Không có dữ liệu trong khoảng thời gian đã chọn</td></tr> : rows.map((row, index) => <tr key={row.productId || row.code || row.name}>
          <td className="border border-slate-300 p-3">{index + 1}</td><td className="border border-slate-300 p-3">{row.code}</td><td className="border border-slate-300 p-3">{row.name}</td><td className="border border-slate-300 p-3 text-right">{number(row.qty)}</td><td className="border border-slate-300 p-3 text-right">{number(row.total)}</td>
        </tr>)}
      </tbody>
      {!loading && !error && <tfoot><tr className="bg-blue-50 font-bold"><td colSpan={3} className="border border-slate-300 p-3">Tổng cộng</td><td className="border border-slate-300 p-3 text-right">{number(rows.reduce((sum, row) => sum + row.qty, 0))}</td><td className="border border-slate-300 p-3 text-right">{number(rows.reduce((sum, row) => sum + row.total, 0))}</td></tr></tfoot>}
    </table>
  </div>;
}
