import React from "react";
import { Banknote, ChefHat, PackageCheck } from "lucide-react";

const themes = {
  cash: {
    icon: Banknote,
    surface: "from-orange-50 to-amber-100/80 border-orange-200/70 text-orange-950",
    iconStyle: "bg-orange-500 text-white shadow-orange-500/20",
    badge: "text-orange-700 border-orange-200/80",
  },
  pending: {
    icon: ChefHat,
    surface: "from-blue-50 to-sky-100/80 border-blue-200/70 text-blue-950",
    iconStyle: "bg-blue-500 text-white shadow-blue-500/20",
    badge: "text-blue-700 border-blue-200/80",
  },
  done: {
    icon: PackageCheck,
    surface: "from-emerald-50 to-teal-100/80 border-emerald-200/70 text-emerald-950",
    iconStyle: "bg-emerald-500 text-white shadow-emerald-500/20",
    badge: "text-emerald-700 border-emerald-200/80",
  },
};

export default function OrderColumnHeader({ variant, title, count }) {
  const theme = themes[variant];
  const Icon = theme.icon;

  return (
    <div className={`sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-gradient-to-r px-4 py-3 ${theme.surface}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md ${theme.iconStyle}`}>
          <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold leading-snug tracking-tight">{title}</h2>
      </div>
      <span aria-label={`${count} đơn hàng`} className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-xl border bg-white/85 px-2.5 text-sm font-semibold tabular-nums ${theme.badge}`}>
        {count}
      </span>
    </div>
  );
}
