


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";
import bgImg from "../../assets/anh-can-tin-so-2.png";

const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

export default function Order() {
  const location = useLocation();
   
useEffect(() => {
  const state = location.state;

  if (state?.type === "qr") {
    setAmount(state.amount);
    setRemaining(state.amount);
    setStudent(null);
  } else if (state?.type === "student") {
    setStudent(state.student);
    setAmount(null);
  } else {
    // 🔥 fallback localStorage (chỉ khi reload)
    const data = JSON.parse(localStorage.getItem("student") || "null");
    const qrAmount = localStorage.getItem("amount");

    if (qrAmount) {
      const amountNumber = Number(qrAmount);
      setAmount(amountNumber);
      setRemaining(amountNumber);
    } else if (data) {
      setStudent(data);
    } else {
      console.warn("Không có dữ liệu");
    }
  }
}, []);

  // THÊM CÁC STATE NÀY
  const [student, setStudent] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const [noteModal, setNoteModal] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const [pickupType, setPickupType] = useState("Lấy liền");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amount, setAmount] = useState(null);
  const [remaining, setRemaining] = useState(null);

  const categories = [
  "Tất cả",
  "Kẹo",
  "Phụ kiện",
  "Snack",
  "Ăn vặt",
  "Sữa",
  "Nước",
  "Học tập",
  "Tiện ích",
  "Đồ chơi",
];

  const products = [
  // ===== 5K =====
  {
    id: 1,
    name: "Kẹo mút",
    price: 5000,
    category: "Kẹo",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    name: "Kẹo viên",
    price: 5000,
    category: "Kẹo",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 3,
    name: "Sticker",
    price: 5000,
    category: "Phụ kiện",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 4,
    name: "Ghim cài áo",
    price: 5000,
    category: "Phụ kiện",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },

  // ===== 10K =====
  {
    id: 5,
    name: "Bánh snack",
    price: 10000,
    category: "Snack",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 6,
    name: "Thạch rau câu",
    price: 10000,
    category: "Ăn vặt",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 7,
    name: "Sữa chua nhỏ",
    price: 10000,
    category: "Sữa",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 8,
    name: "Nước suối",
    price: 10000,
    category: "Nước",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },

  // ===== Học tập =====
  {
    id: 9,
    name: "Tập",
    price: 10000,
    category: "Học tập",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 10,
    name: "Bút chì",
    price: 10000,
    category: "Học tập",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 11,
    name: "Bút thú",
    price: 10000,
    category: "Học tập",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },

  // ===== Tiện ích / đồ chơi =====
  {
    id: 12,
    name: "Quạt cầm tay",
    price: 5000,
    category: "Tiện ích",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 13,
    name: "Bút quạt",
    price: 10000,
    category: "Tiện ích",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 14,
    name: "Mô hình lắp ráp",
    price: 10000,
    category: "Đồ chơi",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
  {
    id: 15,
    name: "Thước con thú",
    price: 5000,
    category: "Học tập",
    image: PRODUCT_PLACEHOLDER_IMAGE,
  },
];


//   useEffect(() => {
//   const data = JSON.parse(localStorage.getItem("student") || "null");
//   const qrAmount = localStorage.getItem("amount");

//   if (qrAmount) {
//     const amountNumber = Number(qrAmount);

//     setAmount(amountNumber);        
//     setRemaining(amountNumber);    
//     setStudent(null);
//   } else if (data) {
//     setStudent(data);
//     setAmount(null);
//   } else {
    
//     console.warn("Không có dữ liệu từ scan");
//   }
// }, []);

  const filteredProducts = products.filter((p) => {
    // 👉 lọc theo category
    const matchCategory =
      activeCategory === "Tất cả" || p.category === activeCategory;

    // 👉 lọc theo tiền QR
    const matchPrice =
      !amount || p.price <= Number(amount);

    return matchCategory && matchPrice;
  });

  
  const addToCart = (item) => {
    // 👉 Nếu đang dùng QR
    if (amount) {
      if (remaining < item.price) {
        alert("❌ Bạn không đủ tiền để mua món này");
        return;
      }

      setRemaining((prev) => (prev ?? 0) - item.price);
    }

    // 👉 thêm vào giỏ như bình thường
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePayment = () => {
  if (cart.length === 0) {
    alert("Chưa có món");
    return;
  }

  // 🔥 Nếu dùng QR → bỏ check student
  if (!amount && student && total > student.balance) {
    alert("Không đủ tiền");
    return;
  }

  setConfirmModal(true);
};
  const generateOrderNumber = () => {
    let current = localStorage.getItem("orderNumber");

    if (!current) {
      current = 1;
    } else {
      current = parseInt(current) + 1;
    }

    localStorage.setItem("orderNumber", current);

    return current;
  };



  const handleConfirmPayment = () => {

    const isCash = paymentMethod === "cash";

    // ✅ CHỈ TRỪ TIỀN NẾU KHÔNG PHẢI TIỀN MẶT
    if (!isCash && student) {
      const updated = { ...student, balance: student.balance - total };
      localStorage.setItem("student", JSON.stringify(updated));
      setStudent(updated);

      // nếu bạn dùng thêm bảng students
      const students = JSON.parse(localStorage.getItem("students")) || [];

      const updatedStudents = students.map(s => {
        if (s.id === student.id) {
          return {
            ...s,
            balance: s.balance - total
          };
        }
        return s;
      });

      localStorage.setItem("students", JSON.stringify(updatedStudents));
    }

    const orderNumber = generateOrderNumber();

    const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      orderKey: Date.now() + Math.random(),
      id: orderNumber,
      items: cart,
      total,
      studentId: String(student?.cardId),
      studentName: student?.name,

      status: paymentMethod === "cash" ? "cash" : "pending",
      paymentMethod: paymentMethod,

      isRefunded: false,
      pickupType: pickupType,
      createdAt: Date.now(),
    };

    localStorage.setItem("orders", JSON.stringify([...oldOrders, newOrder]));

    setConfirmModal(false);
    setSuccessModal(orderNumber);
    setCart([]);
  };


  // xử lý trường hợp công tiền hoặc xóa sản phẩm khi quét mã QR 
  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((p) => p.id !== item.id));

    // 👉 trả tiền lại nếu dùng QR
    if (amount) {
      setRemaining((prev) => (prev ?? 0) + item.price * item.qty);
    }
  };

  const increaseQty = (item) => {
    if (amount) {
      if (remaining < item.price) {
        alert("❌ Không đủ tiền");
        return;
      }
      setRemaining((prev) => (prev ?? 0) - item.price);
    }

    setCart((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  const decreaseQty = (item) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === item.id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter((p) => p.qty > 0)
    );

    if (amount) {
      setRemaining((prev) => (prev ?? 0) + item.price);
    }
  };


  if (!student && !amount) return <div className="p-6">Loading...</div>;

  return (
    // <div className="h-screen flex flex-col">
    <div
      className="h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >

      <Header student={student} amount={remaining ?? amount} />


      <div className="flex flex-1 overflow-hidden">

        <Left
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          products={filteredProducts}
          addToCart={addToCart}
          amount={amount}           // 👈 thêm
          remaining={remaining}
        />

        <Right
          cart={cart}
          setCart={setCart}
          removeFromCart={removeFromCart}     // 👈 thêm
          increaseQty={increaseQty}           // 👈 thêm
          decreaseQty={decreaseQty}

          total={total}

          student={student}

          noteModal={noteModal}
          setNoteModal={setNoteModal}
          noteValue={noteValue}
          setNoteValue={setNoteValue}

          handlePayment={handlePayment}
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmPayment={handleConfirmPayment}
          successModal={successModal}
          setSuccessModal={setSuccessModal}
          pickupType={pickupType}
          setPickupType={setPickupType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

      </div>
    </div>
  );

}
