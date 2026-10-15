import { useState } from "react";
import FeedbackImageUpload from "./FeedbackImageUpload";

const REASONS = ["Món ăn không đảm bảo", "Sai món đã đặt", "Khẩu phần không đủ", "Thái độ phục vụ", "Khác"];
const fieldClass = "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const getToday = () => {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export default function FeedbackForm({ onSubmit, loading = false }) {
  const [service, setService] = useState("canteen");
  const [date, setDate] = useState(getToday);
  const [mealName, setMealName] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const busy = loading || submitting;
  const canSubmit = Boolean(onSubmit && mealName.trim() && reason && description.trim() && date && date <= getToday() && !busy);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ service, date, mealName: mealName.trim(), reason, description: description.trim(), images });
    } catch {
      setError("Không gửi được phản ánh. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="feedback-content" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold">Thông tin phản ánh</h2>
      <p className="mb-4 mt-2 text-sm text-slate-500">Chọn dịch vụ và nhập món ăn cần phản ánh</p>
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={busy}>
        <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold text-slate-600">Loại dịch vụ</legend>
            <div className="flex flex-wrap gap-6">
              {[{ id: "canteen", name: "Căn tin" }, { id: "boarding", name: "Bán trú" }].map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="feedback-service" value={item.id} checked={service === item.id} onChange={() => setService(item.id)} className="h-5 w-5 accent-blue-600" />{item.name}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="feedback-date" className="mb-1.5 block text-sm font-semibold text-slate-600">Ngày sử dụng món ăn</label>
            <input id="feedback-date" type="date" required value={date} max={getToday()} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="feedback-meal" className="mb-1.5 block text-sm font-semibold text-slate-600">Món ăn cần phản ánh</label>
            <input id="feedback-meal" type="text" required maxLength={150} value={mealName} onChange={(event) => setMealName(event.target.value)} placeholder="Nhập tên món ăn cần phản ánh..." className={fieldClass} />
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-600">Nội dung phản ánh</legend>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {REASONS.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 text-sm"><input type="radio" name="feedback-reason" required value={item} checked={reason === item} onChange={() => setReason(item)} className="h-5 w-5 shrink-0 accent-blue-600" />{item}</label>)}
            </div>
          </fieldset>
          <div>
            <label htmlFor="feedback-description" className="mb-1.5 block text-sm font-semibold text-slate-600">Mô tả chi tiết</label>
            <textarea id="feedback-description" required value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={3} placeholder="Nhập nội dung phản ánh cụ thể..." className="min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <FeedbackImageUpload images={images} onChange={setImages} />
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={!canSubmit} className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{busy ? "Đang gửi..." : "Gửi phản ánh"}</button>
        {!onSubmit && <p className="text-center text-xs text-slate-400">Chức năng gửi phản ánh đang chờ kết nối dịch vụ.</p>}
      </form>
    </div>
  );
}
