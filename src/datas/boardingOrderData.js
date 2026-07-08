// Moved to public/images/ to avoid bundling (878KB)
const yaourt = "/images/Yaourt.png";

export const boardingOrderData = {
  preschool: {
    meals: ["Ăn sáng", "Ăn trưa", "Ăn xế"],
  },
  primary: {
    meals: ["Ăn trưa", "Ăn xế"],
  },
};

export const boardingMealOptions = {
  "Ăn sáng": [
    {
      id: "breakfast-banh-mi-thit",
      name: "Bánh mì thịt",
      image: "",
      description: "Khẩu phần sáng gọn nhẹ, thơm nóng và đủ năng lượng cho buổi học.",
      ingredients: ["Bánh mì", "Thịt nguội", "Dưa leo", "Rau thơm", "Sốt bơ nhẹ"],
    },
    {
      id: "breakfast-banh-ngot-sua",
      name: "Bánh ngọt sữa tươi",
      image: "",
      description: "Bữa sáng mềm, dễ ăn, phù hợp cho học sinh mầm non.",
      ingredients: ["Bánh bông lan", "Sữa tươi", "Trái cây theo mùa"],
    },
  ],
  "Ăn trưa": [
    {
      id: "lunch-com-ga",
      name: "Cơm gà sốt nấm",
      image: "",
      description: "Suất trưa cân bằng với tinh bột, đạm và rau xanh.",
      ingredients: ["Cơm trắng", "đuồi gà", "Nấm", "Cà rốt", "Rau cải"],
    },
    {
      id: "lunch-com-thit-kho",
      name: "Cơm thịt kho trứng",
      image: "",
      description: "Món trưa quen vị, dễ ăn, có thêm rau luộc và canh trong ngày.",
      ingredients: ["Cơm trắng", "Thịt heo", "Trứng cút", "Rau luộc", "Canh bí đỏ"],
    },
  ],
  "Ăn xế": [
    {
      id: "snack-banh-ngot",
      name: "Bánh ngọt mini",
      image: "",
      description: "Bữa xế nhỏ, mềm và tiện dùng sau giờ nghỉ trưa.",
      ingredients: ["Bột mì", "Sữa", "Trứng", "Bơ lạt"],
    },
    {
      id: "snack-sua-trai-cay",
      name: "Sữa trái cây",
      image: "",
      description: "Thức uống mát, bổ sung năng lượng nhẹ cho cuối ngày.",
      ingredients: ["Sữa tươi", "Trái cây", "Đường ít", "Đá sạch"],
    },
    {
      id: "snack-yogurt",
      name: "Yaourt",
      image: yaourt,
      description: "Món xế mát, dễ tiêu hóa và hợp khẩu vị trẻ nhỏ.",
      ingredients: ["Sữa chua", "Mứt trái cây", "Ngũ cốc giòn"],
    },
  ],
};
