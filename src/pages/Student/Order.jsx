


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";
import trasuaImg from "../../assets/trasua.jpg";
import cocaImg from "../../assets/coca.jpg";
import banhngotImg from "../../assets/banhngot.jpeg";
import banhmiImg from "../../assets/banhmi.jpg";
import bgImg from "../../assets/anh-can-tin-so-2.png";


import keomutImg from "../../assets/keomut.jpg";
import banhquyImg from "../../assets/banhquy.jpg";
import nuocsuoiImg from "../../assets/nuocsuoi.jpg";
import trachanhImg from "../../assets/trachanh.jpg";
import banhtrungImg from "../../assets/banhtrung.png";
import xucxichImg from "../../assets/xucxich.png";
export default function Order() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    console.log(state);
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

    // ✅ thêm 3 món 5K
    {
      id: 5,
      name: "Kẹo mút",
      price: 5000,
      category: "Snack",
      image: keomutImg, // nhớ import ảnh
    },
    {
      id: 6,
      name: "Bánh quy nhỏ",
      price: 5000,
      category: "Snack",
      image: banhquyImg,
    },
    {
      id: 7,
      name: "Nước suối mini",
      price: 5000,
      category: "Nước",
      image: nuocsuoiImg,
    },
    // ✅ thêm 3 món 10K
    {
      id: 8,
      name: "Trà chanh",
      price: 10000,
      category: "Nước",
      image: trachanhImg,
    },
    {
      id: 9,
      name: "Bánh trứng",
      price: 10000,
      category: "Bánh",
      image: banhtrungImg,
    },
    {
      id: 10,
      name: "Xúc xích",
      price: 10000,
      category: "Ăn vặt",
      image: xucxichImg,
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
      items: cart | 0,
      total,
      studentId: String(student?.cardId),
      studentName: student?.name | 0,

      status: paymentMethod === "cash" ? "cash" : "pending",
      paymentMethod: paymentMethod,

      isRefunded: false,
      pickupType: pickupType,
      createdAt: Date.now(),
    };
    console.log(newOrder)
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
