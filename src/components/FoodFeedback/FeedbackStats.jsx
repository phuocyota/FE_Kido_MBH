import { ClipboardList, Clock3 } from "lucide-react";

export default function FeedbackStats({ total = 0, processing = 0 }) {
  const cards = [
    { label: "Tổng phản ánh", value: total, note: "Ý kiến đã ghi nhận", icon: ClipboardList, gradient: "from-blue-600 via-blue-500 to-indigo-500", shadow: "shadow-blue-200/60" },
    { label: "Đang xử lý", value: processing, note: "Đang được xem xét", icon: Clock3, gradient: "from-amber-500 via-orange-500 to-orange-400", shadow: "shadow-orange-200/60" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {cards.map((card) => {
        const { label, value, note, icon: Icon, gradient, shadow } = card;
        return (
        <div key={label} className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg ${shadow} sm:p-5`}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-8 -z-10 h-32 w-32 rounded-full bg-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-8 -z-10 h-28 w-28 rounded-full border border-white/15" />
          <div className="flex flex-wrap-reverse items-center justify-between gap-2">
            <p className="text-xs font-medium text-white/90 sm:text-sm">{label}</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/25 sm:h-10 sm:w-10"><Icon size={20} aria-hidden="true" /></span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">{String(value).padStart(2, "0")}</p>
          <p className="mt-1.5 text-xs text-white/85">{note}</p>
        </div>
        );
      })}
    </div>
  );
}
