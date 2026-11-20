import React, { useState, useEffect } from "react";
import { reportApi } from "../../api/reportApi";
import { useDashboardRefresh } from "../../hooks/useDashboardRefresh";
import { Receipt, Users, Wallet } from "lucide-react";

export default function Summary() {
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const dashboardRevision = useDashboardRefresh();

  useEffect(() => {
    let active = true;

    const fetchTodayStats = async () => {
      try {
        // Get today's date range
        const today = new Date();
        const from = today.toISOString().split('T')[0];
        const to = from;

        const [revenueRes, customers] = await Promise.all([
          reportApi.getRevenue(from, to),
          reportApi.getCustomerStats("today"),
        ]);

        // Extract data from API response wrapper { success, message, data }
        const revenue = revenueRes.data || revenueRes;

        const stats = {
          revenue: revenue.netRevenue || revenue.totalRevenue || 0,
          orders: revenue.orderCount || 0,
          customers: customers.totalCustomers || 0,
        };
        if (active) {
          setTodayStats(stats);
        }
      } catch {
        // Silent fail
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTodayStats();
    return () => {
      active = false;
    };
  }, [dashboardRevision]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value || 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="erp-panel h-[200px] animate-pulse p-5">
            <div className="h-10 w-10 rounded-xl bg-slate-100" />
            <div className="mt-5 h-4 w-1/2 rounded bg-slate-100" />
            <div className="mt-3 h-8 w-2/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const revenue = todayStats?.revenue || 0;
  const orders = todayStats?.orders || 0;
  const customers = todayStats?.customers || 0;

  const cards = [
    {
      title: "Doanh thu thuần hôm nay",
      value: formatCurrency(revenue),
      unit: "đ",
      hint: revenue > 0 ? "Phát sinh doanh thu" : "Không phát sinh doanh thu",
      icon: Wallet,
      tone: "blue",
      rows: [
        ["Giảm giá hóa đơn", 0],
        ["Trả hàng (0)", 0],
      ],
    },
    {
      title: "Số lượng đơn hôm nay",
      value: formatCurrency(orders),
      hint: orders > 0 ? "Đơn hàng phát sinh" : "Không phát sinh đơn",
      icon: Receipt,
      tone: "emerald",
      rows: [
        ["Trung bình đơn", orders > 0 && revenue > 0 ? formatCurrency(Math.round(revenue / orders)) : 0],
        ["Số khách/đơn", orders > 0 && customers > 0 ? Math.round((customers / orders) * 10) / 10 : 0],
      ],
    },
    {
      title: "Tỷ lệ phủ bàn",
      value: formatCurrency(customers),
      hint: customers > 0 ? "Khách hàng hôm nay" : "Chưa có khách hàng",
      icon: Users,
      tone: "amber",
      rows: [
        ["Đơn đang phục vụ", orders],
        ["Khách đang phục vụ", customers],
      ],
    },
  ];

  const tones = {
    blue: { icon: "bg-blue-50 text-blue-600 ring-blue-100", bar: "from-blue-500 to-indigo-500" },
    emerald: { icon: "bg-emerald-50 text-emerald-600 ring-emerald-100", bar: "from-emerald-500 to-teal-500" },
    amber: { icon: "bg-amber-50 text-amber-600 ring-amber-100", bar: "from-amber-400 to-orange-500" },
  };

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-[17px] font-bold tracking-tight text-slate-900">Bức tranh kinh doanh</h2>
        <span className="text-[12px] text-slate-400">Hôm nay · {new Date().toLocaleDateString("vi-VN")}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const tone = tones[card.tone];
          return (
            <div
              key={card.title}
              className="erp-panel group relative flex flex-col overflow-hidden p-5 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.bar}`} />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-slate-500">{card.title}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[30px] font-bold leading-none tracking-tight text-slate-900 tabular-nums sm:text-[34px]">
                      {card.value}
                    </span>
                    {card.unit && <span className="text-[15px] font-semibold text-slate-400">{card.unit}</span>}
                  </div>
                  <div className="mt-2 text-[12.5px] text-slate-400">{card.hint}</div>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tone.icon}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-[13px]">
                {card.rows.map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
