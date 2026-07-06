import React, { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

const renderText = (text) =>
  text.split("\n").map((line, index) => (
    <React.Fragment key={`${line}-${index}`}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

export default function NutritionAIContent({
  messages,
  suggestions,
  onSuggestionClick,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-emerald-50/70 via-white to-white">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 sm:gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-white">
                    <Bot className="h-5 w-5 text-emerald-700" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[72%] sm:px-5 sm:text-base ${
                    isUser
                      ? "rounded-br-md bg-emerald-600 text-white"
                      : "rounded-bl-md border border-emerald-100 bg-white text-slate-700"
                  }`}
                >
                  {renderText(message.text)}
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-emerald-100 bg-white/90 px-3 py-3 backdrop-blur sm:px-5 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Câu hỏi mẫu
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSuggestionClick(item)}
                className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-left text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
