import React, { useState } from "react";
import { SendHorizonal, Paperclip } from "lucide-react";
import { nutritionAIConfig } from "../../datas/nutritionAIData";

export default function NutritionAIInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text) return;

    onSend(text);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-emerald-100 bg-white px-3 py-3 sm:px-5 sm:py-4 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 rounded-[24px] border border-emerald-200 bg-white p-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 sm:gap-3 sm:p-3">
          <button
            type="button"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 sm:flex"
            aria-label="Đính kèm dữ liệu thực đơn"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            placeholder="Nhập câu hỏi về dinh dưỡng cho học sinh..."
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="Gửi câu hỏi"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-center text-xs leading-5 text-slate-400">
          {nutritionAIConfig.safetyNote}
        </p>
      </div>
    </form>
  );
}
