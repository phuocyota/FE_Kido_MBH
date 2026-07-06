import React, { useMemo, useState } from "react";

import NutritionAIHeader from "../../components/NutritionAI/NutritionAIHeader";
import NutritionAIContent from "../../components/NutritionAI/NutritionAIContent";
import NutritionAIInput from "../../components/NutritionAI/NutritionAIInput";

import {
  answers,
  defaultAnswer,
  nutritionKnowledgeBase,
  sampleQuestions,
  todayMenuSample,
  welcomeMessage,
} from "../../datas/nutritionAIData";

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function NutritionAI() {
  const [messages, setMessages] = useState([welcomeMessage]);

  const menuSummary = useMemo(
    () =>
      todayMenuSample.meals
        .map((meal) => `${meal.name}: ${meal.items.join(", ")}`)
        .join(" | "),
    []
  );

  const findAnswer = (text) => {
    if (answers[text]) return answers[text];

    const normalizedQuestion = normalizeText(text);
    const matchedKnowledge = nutritionKnowledgeBase.find((item) =>
      item.keywords.some((keyword) =>
        normalizedQuestion.includes(normalizeText(keyword))
      )
    );

    return matchedKnowledge?.answer || defaultAnswer;
  };

  const sendMessage = (text) => {
    const question = text.trim();
    if (!question) return;

    const createdAt = Date.now();
    const userMessage = {
      id: `user-${createdAt}`,
      role: "user",
      text: question,
    };

    const assistantMessage = {
      id: `assistant-${createdAt}`,
      role: "assistant",
      text: findAnswer(question),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  return (
    <section className="mx-auto flex h-[calc(100vh-104px)] min-h-[620px] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:h-[calc(100vh-112px)] sm:rounded-[32px]">
      <NutritionAIHeader menuSummary={menuSummary} />

      <NutritionAIContent
        messages={messages}
        suggestions={sampleQuestions}
        onSuggestionClick={sendMessage}
      />

      <NutritionAIInput onSend={sendMessage} />
    </section>
  );
}
