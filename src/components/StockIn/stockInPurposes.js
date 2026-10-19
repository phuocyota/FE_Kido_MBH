export const stockInPurposes = [
  {
    code: "NHNCC",
    title: "Nhập hàng",
    optionLabel: "Nhập hàng từ nhà cung cấp",
    description: "Nhập hàng mua từ nhà cung cấp để bán hoặc bổ sung tồn kho hàng hóa.",
    example: "Ví dụ: nước đóng chai, sữa hộp, bánh đóng gói.",
    action: "Tạo phiếu nhập hàng",
  },
  {
    code: "NHNNL",
    title: "Nhập nguyên, nhiên liệu",
    optionLabel: "Nhập nguyên, nhiên liệu",
    description: "Nhập nguyên liệu và nhiên liệu phục vụ chế biến. Quản lý theo lô và hạn dùng của từng mặt hàng.",
    example: "Ví dụ: thịt, rau, gạo, dầu ăn, gas bếp.",
    action: "Tạo phiếu nhập nguyên, nhiên liệu",
  },
];

export const getStockInPurpose = (code) => stockInPurposes.find((purpose) => purpose.code === code) || stockInPurposes[0];
