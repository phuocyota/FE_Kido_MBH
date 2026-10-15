import { useState } from "react";
import { ChevronDown, ListFilter, MessageSquare } from "lucide-react";
import FeedbackHistoryItem from "./FeedbackHistoryItem";
import FeedbackDetailModal from "./FeedbackDetailModal";
import { feedbackStatuses } from "../../datas/foodFeedbackData";

export default function FeedbackHistory({ feedbacks = [] }) {
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const invalidRange = Boolean(fromDate && toDate && fromDate > toDate);
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(feedback.createdAt));
    const value = (type) => parts.find((part) => part.type === type).value;
    const sentDate = `${value("year")}-${value("month")}-${value("day")}`;
    return !invalidRange && (status === "all" || feedback.status === status) && (!fromDate || sentDate >= fromDate) && (!toDate || sentDate <= toDate);
  });
  return (
    <div id="feedback-content" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Lịch sử phản ánh</h2>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label htmlFor="feedback-status-filter" className="flex shrink-0 items-center gap-1.5 text-sm text-slate-500"><ListFilter size={16} />Trạng thái</label>
          <div className="relative min-w-0 flex-1">
            <select id="feedback-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="w-full appearance-none rounded-full border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44">
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(feedbackStatuses).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      <fieldset className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <legend className="px-1 text-xs font-medium text-slate-500">Khoảng thời gian gửi phản ánh</legend>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="min-w-0"><label htmlFor="feedback-from-date" className="mb-1 block text-xs text-slate-500">Từ ngày</label><input id="feedback-from-date" type="date" value={fromDate} max={toDate || undefined} aria-invalid={invalidRange} aria-describedby={invalidRange ? "feedback-date-error" : undefined} onChange={(event) => setFromDate(event.target.value)} className="min-w-0 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
          <div className="min-w-0"><label htmlFor="feedback-to-date" className="mb-1 block text-xs text-slate-500">Đến ngày</label><input id="feedback-to-date" type="date" value={toDate} min={fromDate || undefined} aria-invalid={invalidRange} aria-describedby={invalidRange ? "feedback-date-error" : undefined} onChange={(event) => setToDate(event.target.value)} className="min-w-0 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
          <button type="button" disabled={status === "all" && !fromDate && !toDate} onClick={() => { setStatus("all"); setFromDate(""); setToDate(""); }} className="rounded-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-slate-400">Xóa bộ lọc</button>
        </div>
        {invalidRange && <p id="feedback-date-error" role="alert" className="mt-2 text-xs text-red-500">Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.</p>}
      </fieldset>
      <p role="status" className="mb-3 text-xs text-slate-400">Hiển thị {filteredFeedbacks.length}/{feedbacks.length} phản ánh</p>
      {filteredFeedbacks.length > 0 ? (
        <div className="space-y-3">
          {filteredFeedbacks.map((feedback) => <FeedbackHistoryItem key={feedback.id} feedback={feedback} onViewDetail={setSelectedFeedback} />)}
        </div>
      ) : <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
        <MessageSquare size={32} className="text-zinc-500" />
        <p className="text-sm font-medium text-slate-500">{feedbacks.length ? "Không có phản ánh phù hợp với bộ lọc" : "Chưa có dữ liệu phản ánh"}</p>
        <p className="max-w-xs text-xs leading-relaxed text-slate-400">{feedbacks.length ? "Thay đổi trạng thái hoặc khoảng thời gian để xem thêm phản ánh." : "Phản ánh đã gửi sẽ được hiển thị tại đây."}</p>
      </div>}
      {selectedFeedback && <FeedbackDetailModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} />}
    </div>
  );
}
