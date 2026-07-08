export const nutritionAIConfig = {
  assistantName: "AI Dinh dưỡng",
  domain: "school-nutrition",
  locale: "vi-VN",
  systemPrompt:
    "Bạn là trợ lý dinh dưỡng học đường. Hãy tư vấn ngắn gọn, dễ hiểu, ưu tiên thực đơn cân bằng cho học sinh và luôn nhắc phụ huynh tham khảo chuyên gia khi có bệnh lý hoặc dị ứng.",
  safetyNote:
    "AI chỉ đưa ra gợi ý tham khảo. Với dị ứng, bệnh lý hoặc chế độ ăn đặc biệt, phụ huynh nên hỏi chuyên gia dinh dưỡng hoặc bác sĩ.",
};

export const studentNutritionProfile = {
  ageGroup: "Tiểu học",
  activityLevel: "Vận động vừa",
  allergies: [],
  goal: "Ăn đủ năng lượng, tăng rau xanh, bổ sung canxi",
};

export const todayMenuSample = {
  date: "2026-07-06",
  meals: [
    {
      name: "Bữa trưa",
      items: ["Cơm trắng", "Gà sốt nấm", "Canh rau củ", "Chuối"],
      nutritionTags: ["Tinh bột", "Đạm", "Chất xơ", "Vitamin"],
    },
    {
      name: "Bữa phụ",
      items: ["Sữa chua", "Bánh mì nhỏ"],
      nutritionTags: ["Canxi", "Tinh bột"],
    },
  ],
};

export const sampleQuestions = [
  "Thực đơn hôm nay có đủ dinh dưỡng không?",
  "Món nào giàu canxi cho học sinh?",
  "Gợi ý bữa sáng đủ năng lượng.",
  "Nếu bé không thích ăn rau thì nên làm gì?",
  "Học sinh tiểu học nên uống bao nhiêu sữa?",
];

export const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  text:
    "Xin chào, tôi là AI Dinh dưỡng. Bạn có thể hỏi về thực đơn, khẩu phần, món ăn thay thế hoặc cách cân bằng bữa ăn cho học sinh.",
};

export const nutritionKnowledgeBase = [
  {
    topic: "balanced-menu",
    keywords: ["thực đơn", "đủ dinh dưỡng", "cân bằng", "hôm nay"],
    answer:
      "Thực đơn mẫu hôm nay đã có tinh bột từ cơm, đạm từ gà, chất xơ và vitamin từ rau củ, trái cây. Bữa phụ có sữa chua giúp bổ sung canxi. Nếu học sinh vận động nhiều, có thể thêm một phần trái cây hoặc sữa ít đường.",
  },
  {
    topic: "calcium",
    keywords: ["canxi", "xương", "sữa", "chiều cao"],
    answer:
      "Các món giàu canxi phù hợp với học sinh gồm sữa, sữa chua, phô mai, đậu phụ, tôm, cá nhỏ ăn cả xương và rau lá xanh đậm. Nên ưu tiên khẩu phần vừa phải, ít đường và phù hợp với khả năng dung nạp của bé.",
  },
  {
    topic: "breakfast",
    keywords: ["bữa sáng", "năng lượng", "ăn sáng"],
    answer:
      "Một bữa sáng cân bằng có thể gồm bánh mì hoặc xôi, thêm trứng hoặc thịt nạc, một phần sữa và trái cây. Cách kết hợp này giúp có tinh bột, đạm, vitamin và năng lượng ổn định cho buổi học.",
  },
  {
    topic: "vegetables",
    keywords: ["rau", "không thích ăn rau", "chất xơ"],
    answer:
      "Nếu bé không thích rau, hãy bắt đầu bằng lượng nhỏ, chọn rau có vị dịu như bí đỏ, cà rốt, bắp cải, rồi trộn vào món quen thuộc như trứng, cơm chiên hoặc canh. Tránh ép quá mạnh vì dễ làm bé sợ rau hơn.",
  },
  {
    topic: "milk",
    keywords: ["uống bao nhiêu sữa", "sữa", "ml"],
    answer:
      "Học sinh tiểu học thường có thể dùng khoảng 400-600ml sữa hoặc sản phẩm tương đương mỗi ngày, tùy khẩu phần ăn và khả năng dung nạp. Nếu bé đã ăn nhiều sữa chua, phô mai hoặc có khuyến nghị y tế riêng thì nên điều chỉnh lại.",
  },
];

export const answers = sampleQuestions.reduce((result, question) => {
  const matchedTopic = nutritionKnowledgeBase.find((item) =>
    item.keywords.some((keyword) =>
      question.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  return {
    ...result,
    [question]: matchedTopic?.answer,
  };
}, {});

export const defaultAnswer =
  "Tôi đã ghi nhận câu hỏi của bạn. Với dữ liệu mẫu hiện tại, tôi có thể phân tích theo nhóm chất, khẩu phần và thói quen ăn uống học đường. Bạn có thể hỏi cụ thể hơn về thực đơn, canxi, bữa sáng, rau xanh hoặc lượng sữa.";
