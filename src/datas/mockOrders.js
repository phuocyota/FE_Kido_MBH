// =========================
// MOCK ORDERS DATA
// =========================

// Helper tạo ngày (dễ kiểm soát)
const today = new Date();

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(today.getDate() - n);
  d.setHours(10 + (n % 5)); // random giờ ăn
  return d;
};

export const mockOrders = [
  {
    id: 1,
    name: "Cơm gà",
    price: 30000,
    quantity: 1,
    status: "done",
    paymentMethod: "Ví",
    pickupType: "Tại quầy",
    note: "",
    date: daysAgo(0),
  },
  {
    id: 2,
    name: "Bún bò",
    price: 25000,
    quantity: 1,
    status: "done",
    paymentMethod: "Tiền mặt",
    pickupType: "Tại quầy",
    note: "Ít cay",
    date: daysAgo(1),
  },
  {
    id: 3,
    name: "Sữa",
    price: 10000,
    quantity: 2,
    status: "done",
    paymentMethod: "Ví",
    pickupType: "Mang đi",
    note: "",
    date: daysAgo(2),
  },
  {
    id: 4,
    name: "Mì xào",
    price: 20000,
    quantity: 1,
    status: "pending",
    paymentMethod: "Ví",
    pickupType: "Tại quầy",
    note: "",
    date: daysAgo(3),
  },
  {
    id: 5,
    name: "Cơm sườn",
    price: 35000,
    quantity: 1,
    status: "done",
    paymentMethod: "Ví",
    pickupType: "Tại quầy",
    note: "",
    date: daysAgo(4),
  },
  {
    id: 6,
    name: "Trà sữa",
    price: 20000,
    quantity: 1,
    status: "done",
    paymentMethod: "Ví",
    pickupType: "Mang đi",
    note: "Ít đá",
    date: daysAgo(5),
  },
  {
    id: 7,
    name: "Bánh mì",
    price: 15000,
    quantity: 1,
    status: "cancel",
    paymentMethod: "Tiền mặt",
    pickupType: "Tại quầy",
    note: "",
    date: daysAgo(6),
  },
  {
    id: 8,
    name: "Cơm gà",
    price: 30000,
    quantity: 2,
    status: "done",
    paymentMethod: "Ví",
    pickupType: "Tại quầy",
    note: "",
    date: daysAgo(7),
  },
];