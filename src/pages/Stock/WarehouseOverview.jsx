import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  CircleCheck,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import StockHeader from "../../components/Stock/StockHeader";
import { useWarehouseData } from "../../hooks/useWarehouseData";
import {
  Panel,
  Empty,
  RequestState,
} from "../../components/Warehouse/WarehouseUI";
import {
  number,
  money,
  date,
  inputClass,
  rangeDays,
  movementSeries,
} from "../../components/Warehouse/warehouseFormat";

const chartColors = [
  "#4f46e5",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
  "#64748b",
  "#94a3b8",
];
const axis = { fontSize: 10, fill: "#94a3b8" };
const shortMoney = (value) =>
  Number(value).toLocaleString("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

export default function WarehouseOverview() {
  const [days, setDays] = useState(30);
  const [refresh, setRefresh] = useState(0);
  const { data, loading, error } = useWarehouseData(
    "overview",
    rangeDays(days),
    refresh,
  );
  const reload = () => setRefresh((value) => value + 1);
  return (
    <main className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
      <StockHeader activeTab="overview" onRefresh={reload} />
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tổng quan kho</h2>
          <p className="mt-1 text-xs text-slate-500">
            Số dư hiện tại và diễn biến vận hành của chi nhánh.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs text-slate-500">
            Biểu đồ
          </span>
          <select
            aria-label="Khoảng thời gian biểu đồ"
            className={`${inputClass} !w-auto min-w-[110px]`}
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          >
            <option value={7}>7 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
        </div>
      </div>
      <RequestState loading={loading} error={error} retry={reload} />
      {data && !loading && !error && <Dashboard data={data} />}
    </main>
  );
}

function Dashboard({ data }) {
  const [unitChoice, setUnitChoice] = useState("");
  const [consumptionChoice, setConsumptionChoice] = useState("");
  const summary = data.summary;
  const units = [...new Set(data.movementTrend.map((row) => row.unit))];
  const unit = units.includes(unitChoice) ? unitChoice : units[0] || "";
  const consumptionUnits = [
    ...new Set(data.consumption.map((row) => row.unit)),
  ];
  const consumptionUnit = consumptionUnits.includes(consumptionChoice)
    ? consumptionChoice
    : consumptionUnits[0] || "";
  const consumption = data.consumption
    .filter((row) => row.unit === consumptionUnit)
    .slice(0, 8)
    .map((row) => ({ ...row, quantity: Number(row.quantity) }));
  const quantities = data.quantityByUnit.map(
    (row) => `${number(row.quantity)} ${row.unit}`,
  );
  const totalQuantity =
    quantities.length === 1
      ? quantities[0]
      : quantities.length
        ? `${quantities.length} nhóm đơn vị`
        : "0";
  const stats = [
    [
      "Tổng mặt hàng",
      number(summary.totalProducts),
      "Mặt hàng có số dư được theo dõi trong kho.",
      "/warehouse/inventory",
    ],
    [
      "Tổng số lượng tồn",
      totalQuantity,
      quantities.join(" · ") || "Chưa có tồn kho.",
      "/warehouse/inventory",
    ],
    [
      "Giá trị tồn kho",
      money(summary.inventoryValue),
      "Ước tính theo giá vốn hiện tại, gồm tồn đã hết hạn; chưa tính hàng thiếu giá vốn.",
      "/warehouse/inventory",
    ],
    [
      "Lô đang hoạt động",
      number(summary.activeLots),
      "Lô còn tồn và chưa hết hạn.",
      "/stock-lots?status=AVAILABLE",
    ],
    [
      "Lô sắp hết hạn",
      number(summary.expiringLots),
      "Còn tồn, hết hạn trong 7 ngày kể cả hôm nay.",
      "/stock-lots?status=EXPIRING",
      "warning",
    ],
    [
      "Lô đã hết hạn",
      number(summary.expiredLots),
      "Lô còn tồn đã qua ngày hết hạn UTC+7.",
      "/stock-lots?status=EXPIRED",
      "danger",
    ],
    [
      "Hàng dưới định mức",
      Number(summary.configuredMinimumProducts)
        ? number(summary.lowStockProducts)
        : "—",
      Number(summary.configuredMinimumProducts)
        ? "So với định mức đã cấu hình, áp dụng từng kho."
        : "Chưa có định mức. Thiết lập trong Danh mục hàng hóa.",
      "/warehouse/inventory?status=LOW",
      "warning",
    ],
    [
      "Phiếu nhập chờ xử lý",
      number(summary.pendingImports),
      "Phiếu nhập ở trạng thái DRAFT; công nợ không phải trạng thái chờ xử lý.",
      "/stock-in",
    ],
    [
      "Phiếu xuất chờ xử lý",
      number(summary.pendingExports),
      "Phiếu xuất ở trạng thái DRAFT, gồm xuất bán nháp nếu có.",
      "/stock-out",
    ],
  ];
  const alerts = [
    [
      summary.lowStockProducts,
      "mặt hàng dưới định mức tồn",
      "/warehouse/inventory?status=LOW",
      false,
    ],
    [
      summary.expiringLots,
      "lô hàng sắp hết hạn",
      "/stock-lots?status=EXPIRING",
      false,
    ],
    [
      summary.expiredLots,
      "lô hàng đã hết hạn",
      "/stock-lots?status=EXPIRED",
      true,
    ],
    [summary.pendingImports, "phiếu nhập chưa hoàn tất", "/stock-in", false],
    [summary.pendingExports, "phiếu xuất chưa hoàn tất", "/stock-out", false],
  ].filter(([count]) => Number(count) > 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(([label, value, hint, href, tone]) => (
          <Link
            key={label}
            to={href}
            title={hint}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-300"
          >
            <div className="flex items-start justify-between gap-2 text-[11px] font-medium text-slate-500">
              {label}
              <Info size={13} className="shrink-0 text-slate-300" />
            </div>
            <div
              className={`mt-2 break-words text-xl font-bold tracking-tight ${tone === "danger" && Number(value) > 0 ? "text-red-600" : tone === "warning" && Number(value) > 0 ? "text-amber-600" : "text-slate-900"}`}
            >
              {value}
            </div>
            {label === "Tổng số lượng tồn" && (
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-400">
                {quantities.join(" · ")}
              </p>
            )}
          </Link>
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Panel
          title="Biến động nhập xuất kho"
          description={`Tổng lượng biến động theo ngày · ${date(data.from)} – ${date(data.to)}. Chọn từng đơn vị để so sánh.`}
          action={
            <UnitSelect
              label="Đơn vị biến động"
              units={units}
              value={unit}
              onChange={setUnitChoice}
            />
          }
        >
          {data.movementTrend.length ? (
            <div className="h-64 p-3">
              <ResponsiveContainer>
                <BarChart
                  data={movementSeries(
                    data.movementTrend,
                    data.from,
                    data.to,
                    unit,
                  )}
                >
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={axis}
                    tickFormatter={(day) =>
                      day.slice(5).split("-").reverse().join("/")
                    }
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={axis}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    labelFormatter={date}
                    formatter={(value) => `${number(value)} ${unit}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="incoming"
                    name="Nhập"
                    fill="#4f46e5"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="outgoing"
                    name="Xuất"
                    fill="#94a3b8"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty text="Chưa có biến động nhập xuất trong khoảng ngày này." />
          )}
        </Panel>
        <Panel
          title="Cảnh báo kho"
          description="Dựa trên số dư và chứng từ hiện tại."
        >
          <div className="space-y-2 p-3">
            {alerts.length ? (
              alerts.map(([count, text, href, danger]) => (
                <Link
                  key={text}
                  to={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs ${danger ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}
                >
                  <AlertTriangle size={17} className="shrink-0" />
                  <span className="flex-1">
                    <strong>{number(count)}</strong> {text}
                  </span>
                  <ArrowRight size={14} />
                </Link>
              ))
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                <CircleCheck size={18} />
                Không có cảnh báo từ dữ liệu hiện có.
              </div>
            )}
            {!Number(summary.configuredMinimumProducts) && (
              <Link
                to="/products"
                className="block rounded-lg border border-slate-100 p-3 text-xs leading-5 text-slate-500"
              >
                Chưa thiết lập định mức tồn tối thiểu.{" "}
                <span className="font-semibold text-indigo-600">
                  Cấu hình hàng hóa →
                </span>
              </Link>
            )}
            {Number(summary.missingCostRows) > 0 && (
              <p className="p-2 text-xs text-amber-700">
                {number(summary.missingCostRows)} dòng tồn thiếu giá vốn, chưa
                được tính vào giá trị.
              </p>
            )}
          </div>
        </Panel>
        <Panel
          title="Giá trị tồn kho theo thời gian"
          description="Tái dựng số dư cuối ngày từ biến động kho, định giá bằng giá vốn hiện tại. Chưa phải giá trị sổ sách lịch sử."
        >
          {data.valueHistory.some((row) => row.value !== null) ? (
            <div className="h-60 p-3">
              <ResponsiveContainer>
                <AreaChart
                  data={data.valueHistory.map((row) => ({
                    ...row,
                    value: row.value === null ? null : Number(row.value),
                  }))}
                >
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={axis}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(day) =>
                      day.slice(5).split("-").reverse().join("/")
                    }
                    minTickGap={24}
                  />
                  <YAxis
                    tick={axis}
                    tickFormatter={shortMoney}
                    width={55}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip formatter={money} labelFormatter={date} />
                  <Area
                    dataKey="value"
                    name="Giá trị ước tính"
                    type="monotone"
                    stroke="#4f46e5"
                    fill="#eef2ff"
                    strokeWidth={2}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty text="Chưa có sổ biến động để tái dựng giá trị trong khoảng này." />
          )}
          <p className="px-4 pb-3 text-[10px] text-slate-400">
            {data.coverage?.firstMovementAt
              ? `Sổ biến động bắt đầu ${date(data.coverage.firstMovementAt)}; ngày trước đó không có giá trị tái dựng.`
              : "Chưa có dữ liệu biến động."}
          </p>
        </Panel>
        <Panel
          title="Tỷ trọng tồn kho theo nhóm hàng"
          description="Theo giá trị tồn dương, cùng cơ sở giá vốn hiện tại."
        >
          {data.categoryShare.length ? (
            <>
              <div className="h-44">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.categoryShare.map((row) => ({
                        ...row,
                        value: Number(row.value),
                      }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={3}
                    >
                      {data.categoryShare.map((row, index) => (
                        <Cell
                          key={row.name + index}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={money} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 px-4 pb-4">
                {data.categoryShare.map((row, index) => (
                  <div
                    key={row.name + index}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: chartColors[index % chartColors.length],
                      }}
                    />
                    <span
                      className="flex-1 truncate text-slate-600"
                      title={row.name}
                    >
                      {row.name}
                    </span>
                    <strong className="text-slate-700">
                      {money(row.value)}
                    </strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Empty text="Chưa có tồn kho có giá vốn để tính tỷ trọng." />
          )}
        </Panel>
        <Panel
          title="Top nguyên liệu tiêu thụ"
          description="Lượng xuất thực tế cho mẻ chế biến và phiên tiêu hao bếp trong khoảng ngày đã chọn."
          action={
            <UnitSelect
              label="Đơn vị tiêu thụ"
              units={consumptionUnits}
              value={consumptionUnit}
              onChange={setConsumptionChoice}
            />
          }
        >
          {consumption.length ? (
            <div className="h-64 p-3">
              <ResponsiveContainer>
                <BarChart
                  data={consumption}
                  layout="vertical"
                  margin={{ left: 5, right: 15 }}
                >
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    tick={axis}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={125}
                    tick={{ ...axis, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => `${number(value)} ${consumptionUnit}`}
                  />
                  <Bar
                    dataKey="quantity"
                    name="Đã tiêu thụ"
                    fill="#818cf8"
                    radius={[0, 3, 3, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty text="Chưa có nguyên liệu được ghi nhận xuất cho chế biến." />
          )}
        </Panel>
        <Panel
          title="Số lô sắp hết hạn"
          description="Lô còn tồn, hạn dùng từ hôm nay đến 7 ngày tới."
        >
          {data.expiryDistribution.length ? (
            <div className="h-64 p-3">
              <ResponsiveContainer>
                <BarChart data={data.expiryDistribution}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={axis}
                    tickFormatter={date}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={axis}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip labelFormatter={date} />
                  <Bar
                    dataKey="lots"
                    name="Số lô"
                    fill="#d97706"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty text="Không có lô sắp hết hạn trong 7 ngày tới." />
          )}
        </Panel>
      </div>
      <Panel
        title="Ưu tiên xử lý hạn dùng"
        description="Tối đa 12 lô hết hạn hoặc sắp hết hạn, xếp hạn dùng gần nhất trước."
        action={
          <Link
            to="/stock-lots"
            className="text-xs font-semibold text-indigo-600"
          >
            Xem tất cả →
          </Link>
        }
      >
        {data.expiringLots.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                <tr>
                  {["Hàng hóa / lô", "Kho", "Còn tồn", "Hạn dùng", ""].map(
                    (label) => (
                      <th key={label} className="px-4 py-3">
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.expiringLots.map((lot) => (
                  <tr key={lot.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-700">{lot.name}</p>
                      <p
                        className="mt-1 max-w-[350px] truncate text-[10px] text-slate-400"
                        title={lot.lotCode}
                      >
                        {lot.lotCode}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {lot.stockName}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {number(lot.quantity)} {lot.unit}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${lot.expiresAt < rangeDays(1).to ? "text-red-600" : "text-amber-700"}`}
                    >
                      {date(lot.expiresAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="font-semibold text-indigo-600"
                        to={`/warehouse/trace?lotId=${lot.id}`}
                      >
                        Truy xuất
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text="Không có lô cần cảnh báo hạn dùng." />
        )}
      </Panel>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
        <span>
          Cập nhật {new Date(data.generatedAt).toLocaleString("vi-VN")}. Tồn
          khác đơn vị được thống kê riêng.
        </span>
        <Link
          to="/stock-in"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600"
        >
          <ArrowDownToLine size={12} />
          Tạo phiếu nhập kho
        </Link>
      </div>
    </div>
  );
}
function UnitSelect({ label, units, value, onChange }) {
  return units.length ? (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} !w-auto`}
      title="Các số lượng chỉ được so sánh trong cùng đơn vị"
    >
      {units.map((unit) => (
        <option key={unit} value={unit}>
          {unit}
        </option>
      ))}
    </select>
  ) : null;
}
