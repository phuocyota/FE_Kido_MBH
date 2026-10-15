import { useState } from "react";
import FeedbackStats from "../../components/FoodFeedback/FeedbackStats";
import FeedbackTabs from "../../components/FoodFeedback/FeedbackTabs";
import FeedbackForm from "../../components/FoodFeedback/FeedbackForm";
import FeedbackHistory from "../../components/FoodFeedback/FeedbackHistory";
import { foodFeedbackData } from "../../datas/foodFeedbackData";

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve({ name: file.name, url: reader.result });
  reader.onerror = () => reject(new Error("Không đọc được ảnh minh chứng"));
  reader.readAsDataURL(file);
});

export default function FoodFeedback() {
  const [activeTab, setActiveTab] = useState("create");
  const [feedbacks, setFeedbacks] = useState(foodFeedbackData);

  const handleSubmit = async (values) => {
    const images = await Promise.all(values.images.map(readImage));
    const feedback = {
      ...values,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
      images,
      response: "",
    };
    setFeedbacks((previous) => [feedback, ...previous]);
    setActiveTab("history");
  };
  return (
    <section aria-label="Phản ánh món ăn" className="min-h-full space-y-5 text-slate-800">
      <div className="mx-auto max-w-4xl space-y-4">
        <header>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Phản ánh món ăn</h1>
          <p className="mt-1 text-sm text-slate-500">Chia sẻ ý kiến để cải thiện chất lượng bữa ăn.</p>
        </header>
        <FeedbackStats total={feedbacks.length} processing={feedbacks.filter((item) => item.status === "processing").length} />
        <FeedbackTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "create" ? <FeedbackForm onSubmit={handleSubmit} /> : <FeedbackHistory feedbacks={feedbacks} />}
      </div>
    </section>
  );
}
