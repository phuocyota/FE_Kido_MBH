export default function FeedbackTabs({ activeTab, onChange }) {
  return (
    <div aria-label="Quản lý phản ánh" className="grid grid-cols-2 gap-2">
      {[{ id: "create", label: "Gửi phản ánh" }, { id: "history", label: "Lịch sử phản ánh" }].map(({ id, label }) => (
        <button key={id} type="button" aria-pressed={activeTab === id} aria-controls="feedback-content" onClick={() => onChange(id)} className={`rounded-full px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${activeTab === id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
