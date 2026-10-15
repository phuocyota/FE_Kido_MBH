import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, MessageSquareText, Utensils, X } from "lucide-react";
import { feedbackStatuses } from "../../datas/foodFeedbackData";

export default function FeedbackDetailModal({ feedback, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const status = feedbackStatuses[feedback.status] || feedbackStatuses.pending;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby={titleId} onCancel={onClose} onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-end justify-center overflow-hidden border-0 bg-transparent p-2 pb-0 text-slate-800 open:flex sm:items-center sm:p-4 backdrop:bg-slate-950/45">
      <div className="flex max-h-[calc(100dvh-0.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl rounded-b-none bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-emerald-700 shadow-sm"><Utensils size={15} />{feedback.service === "boarding" ? "Bán trú" : "Căn tin"}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sky-700 shadow-sm"><CalendarDays size={15} />{new Date(`${feedback.date}T00:00:00+07:00`).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</span>
            </div>
            <h2 id={titleId} className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">Chi tiết phản ánh</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng chi tiết phản ánh" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"><X size={18} /></button>
        </header>
        <div className="min-h-0 space-y-5 overflow-y-auto p-4 sm:p-5">
          <div>
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
            <h3 className="mt-3 break-words text-xl font-bold">{feedback.mealName}</h3>
            <p className="mt-1 break-all text-xs text-slate-400">Mã phản ánh: {feedback.id}</p>
          </div>
          <dl className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">Loại dịch vụ</dt><dd className="mt-1 font-medium">{feedback.service === "boarding" ? "Bán trú" : "Căn tin"}</dd></div>
            <div><dt className="text-slate-500">Ngày sử dụng món ăn</dt><dd className="mt-1 font-medium">{new Date(`${feedback.date}T00:00:00+07:00`).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</dd></div>
            <div className="sm:col-span-2"><dt className="text-slate-500">Thời gian gửi</dt><dd className="mt-1 font-medium">{new Date(feedback.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</dd></div>
          </dl>
          <div><h4 className="text-sm font-semibold">Nội dung phản ánh</h4><p className="mt-1 text-sm font-medium text-blue-600">{feedback.reason}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{feedback.description}</p></div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Hình ảnh minh chứng</h4>
            {feedback.images?.length ? <div className="grid grid-cols-3 gap-2">{feedback.images.map((image, index) => <a key={index} href={image.url} target="_blank" rel="noreferrer" aria-label={`Xem ảnh minh chứng ${index + 1}`} className="rounded-xl focus-visible:outline-2 focus-visible:outline-blue-500"><img src={image.url} alt={image.name || `Minh chứng ${index + 1}`} className="aspect-square w-full rounded-xl border border-slate-100 object-cover" /></a>)}</div> : <p className="text-sm text-slate-400">Không có ảnh minh chứng.</p>}
          </div>
          <div className="rounded-xl bg-blue-50 p-4"><h4 className="flex items-center gap-2 text-sm font-semibold text-blue-700"><MessageSquareText size={16} />Phản hồi từ nhà trường</h4><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{feedback.response || "Chưa có phản hồi từ nhà trường."}</p></div>
        </div>
        <footer className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-5 sm:pb-4"><button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"><X size={16} />Đóng</button></footer>
      </div>
    </dialog>, document.body,
  );
}
