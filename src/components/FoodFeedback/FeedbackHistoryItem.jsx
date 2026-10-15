import { CalendarDays, ChevronRight, UtensilsCrossed } from "lucide-react";
import { feedbackStatuses } from "../../datas/foodFeedbackData";

const formatDate = (value) => new Date(value).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

export default function FeedbackHistoryItem({ feedback, onViewDetail }) {
  const status = feedbackStatuses[feedback.status] || feedbackStatuses.pending;
  return (
    <article className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-1.5 text-xs text-slate-500"><UtensilsCrossed size={13} />{feedback.service === "boarding" ? "Bán trú" : "Căn tin"}</p>
          <h3 className="break-words font-semibold text-slate-800">{feedback.mealName}</h3>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={14} />Ngày sử dụng: {formatDate(`${feedback.date}T00:00:00+07:00`)}</p>
      <p className="mt-3 text-sm font-medium text-blue-600">{feedback.reason}</p>
      <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-slate-600">{feedback.description}</p>
      <button type="button" aria-haspopup="dialog" aria-label={`Xem chi tiết phản ánh ${feedback.mealName}`} onClick={() => onViewDetail(feedback)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-500">
        Xem chi tiết<ChevronRight size={15} />
      </button>
      <p className="mt-3 text-xs text-slate-400">Đã gửi lúc {new Date(feedback.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })} · {formatDate(feedback.createdAt)}</p>
    </article>
  );
}
