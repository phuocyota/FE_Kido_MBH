


import React, { useEffect, useState } from "react";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";
import trasuaImg from "../../assets/trasua.jpg";
import cocaImg from "../../assets/coca.jpg";
import banhngotImg from "../../assets/banhngot.jpeg";
import banhmiImg from "../../assets/banhmi.jpg";
import bgImg from "../../assets/anh-can-tin-so-2.png";

export default function Order() {

  // 🔥 THÊM CÁC STATE NÀY
  const [student, setStudent] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const [noteModal, setNoteModal] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const [pickupType, setPickupType] = useState("Lấy liền");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const categories = ["Tất cả", "Nước", "Bánh", "Bánh mì", "Cơm"];

  const products = [
    {
      id: 1,
      name: "Trà sữa",
      price: 20000,
      category: "Nước",
      image: trasuaImg,
    },
    {
      id: 2,
      name: "Coca",
      price: 10000,
      category: "Nước",
      image: cocaImg,
    },
    {
      id: 3,
      name: "Bánh ngọt",
      price: 15000,
      category: "Bánh",
      image: banhngotImg,
    },
    {
      id: 4,
      name: "Bánh mì",
      price: 20000,
      category: "Bánh mì",
      image: banhmiImg,
    },
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("student"));
    setStudent(data);
    // console.log("ORDERS:", JSON.parse(localStorage.getItem("orders")));
  }, []);


  const filteredProducts =
    activeCategory === "Tất cả"
      ? products
      : products.filter((p) => p.category === activeCategory);


  const addToCart = (item) => {
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

    if (total > student.balance) {
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
    if (!isCash) {
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
      orderKey: Date.now() + Math.random(), // 🔥 unique thật
  id: orderNumber,
  items: cart,
  total,
  studentId: String(student?.cardId),
  studentName: student?.name,

  status: paymentMethod === "cash" ? "cash" : "pending",
  paymentMethod: paymentMethod, // "cash" hoặc "card"

  isRefunded: false,
  pickupType: pickupType,
  createdAt: Date.now(),
};

    localStorage.setItem("orders", JSON.stringify([...oldOrders, newOrder]));

    setConfirmModal(false);
    setSuccessModal(orderNumber);
    setCart([]);
  };



  if (!student) return <div className="p-6">Loading...</div>;

  return (
    // <div className="h-screen flex flex-col">
    <div
  className="h-screen flex flex-col bg-cover bg-center"
  style={{ backgroundImage: `url(${bgImg})` }}
>

      <Header student={student} />

      <div className="flex flex-1">

        <Left
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          products={filteredProducts}
          addToCart={addToCart}
        />

        <Right
          cart={cart}
          setCart={setCart}
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
