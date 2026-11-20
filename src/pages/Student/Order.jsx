


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";
import {
  addCartItem,
  completeCart,
  deleteCartItem,
  getMyCart,
  updateCartItem,
  // getMyCartItems,
} from "../../api/cart";
import bgImg from "../../assets/anh-can-tin-so-2.webp";
import {
  getProductsByPrice,
} from "../../api/products";

// Giá tối đa của món được hiển thị trên menu
const MAX_PRODUCT_PRICE = 100000;

// paymentMethod trên FE -> giá trị gửi lên backend
const PAYMENT_METHOD_BE = {
  card: "WALLET",
  cash: "CASH",
  momo: "MOMO",
};

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
  const [apiCategories, setApiCategories] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [noteModal, setNoteModal] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const [pickupType, setPickupType] = useState("Lấy liền");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amount, setAmount] = useState(null);
  const [remaining, setRemaining] = useState(null);

  // console.log("LOCAL TOKEN:", localStorage.getItem("accessToken"));
  // console.log("STUDENT:", localStorage.getItem("student"));

  // const syncCart = (nextCart) => {
  //   if (Array.isArray(nextCart?.items)) {
  //     setCart(nextCart.items);
  //   }
  // };
  const syncCart = (nextCart) => {

  console.log("SYNC CART:", nextCart);

  if (Array.isArray(nextCart?.items)) {
    setCart(nextCart.items);
  }
};


  // const reloadCart = async () => {
  //   const nextCart = await getMyCart();
  //   syncCart(nextCart);
  //   return nextCart;
  // };
const reloadCart = async () => {

  const nextCart = await getMyCart();

  console.log("GET MY CART:", nextCart);

  syncCart(nextCart);

  return nextCart;
};

useEffect(() => {
  if (!student) return;

  reloadCart().catch((error) => {
    console.error("LOAD CART ERROR:", error);
  });
}, [student]);

 
 

useEffect(() => {

  const loadOrderingData = async () => {

    try {


      const fullCategories =
        await getProductsByPrice(
          0,
          MAX_PRODUCT_PRICE
        );

      const normalized =
        Array.isArray(fullCategories)
          ? fullCategories
          : [];

      setApiCategories(normalized);

      setApiProducts(
        normalized.flatMap(
          (category) =>
            category.products || []
        )
      );

    } catch (error) {

      console.error(
        "LOAD PRODUCT ERROR:",
        error
      );

    }

  };

  loadOrderingData();

}, []);
  const categories = ["Tất cả", ...apiCategories.map((category) => category.name)];

  const products = apiProducts;

 

const filteredProducts =
  products.filter((p) => {

    const categoryName =
      p.category?.name ||
      p.categoryName ||
      p.category ||
      "";

    const matchCategory =
      activeCategory === "Tất cả" ||
      categoryName === activeCategory;

    return matchCategory;

  });

  useEffect(() => {

    console.log(
      "CART STATE:",
      cart
    );

  }, [cart]);

   

  const addToCart = async (item) => {

  try {

    console.log("CLICK ITEM:", item);

      // 👇 ADD API
      await addCartItem({
        productId: item.id,
        quantity: 1,
        note: "",
      });

      await reloadCart();

  } catch (error) {

    console.log(
      "ADD CART ERROR:",
      error
    );

    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Số tiền tối đa có thể trừ ví:
  // - QR: số tiền của mã QR
  // - Học sinh: số dư ví (không âm) + hạn mức nợ còn lại
  const walletAvailable = amount != null
    ? Number(amount) || 0
    : Math.max(0, Number(student?.balance) || 0) +
      Math.max(0, Number(student?.debtLimit) || 0);

  // Đơn vượt quá số tiền có thể trừ ví -> chỉ cho MoMo hoặc tiền mặt
  const canPayByWallet = total <= walletAvailable;

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Chưa có món");
      return;
    }

    setPaymentMethod(canPayByWallet ? "card" : "cash");
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



  const handleConfirmPayment = async () => {
    if (isSubmitting) return;

    if (paymentMethod === "card" && !canPayByWallet) {
      alert("Số dư ví không đủ, vui lòng chọn MoMo hoặc tiền mặt");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await completeCart({

        paymentMethod:
          PAYMENT_METHOD_BE[paymentMethod] || "CASH",

        orderType: "TAKEAWAY",

        note: pickupType,

      });

      const payload = result?.data || result;
      const order = payload?.order || payload;
      const orderNumber = order?.orderNumber || order?.code || order?.id || generateOrderNumber();

      if (paymentMethod === "card" && student) {
        const balanceBefore = Number(student.balance || 0);
        const balanceAfter = balanceBefore - total;
        const debtIncrease = Math.max(0, -balanceAfter) - Math.max(0, -balanceBefore);
        const updated = {
          ...student,
          balance: balanceAfter,
          ...(student.debtLimit != null && {
            debtLimit: Math.max(0, Number(student.debtLimit) - debtIncrease),
          }),
        };
        localStorage.setItem("student", JSON.stringify(updated));
        setStudent(updated);
      }

      setConfirmModal(false);
      setSuccessModal(orderNumber);
      setCart([]);
      setRemaining(amount);
    } catch (error) {
      alert(error?.message || "Không xác nhận được đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };


  // xử lý trường hợp công tiền hoặc xóa sản phẩm khi quét mã QR 
  const removeFromCart = async (item) => {
    try {
      if (item.cartItemId) {
        await deleteCartItem(item.cartItemId);
        await reloadCart();
      } else {
        setCart((prev) => prev.filter((p) => p.id !== item.id));
      }

      if (amount) {
        setRemaining((prev) => (prev ?? 0) + item.price * item.qty);
      }
    } catch (error) {
      alert(error?.message || "Không xóa được sản phẩm");
    }
  };

  const increaseQty = async (item) => {
    if (amount) {
      if (remaining < item.price) {
        alert("❌ Không đủ tiền");
        return;
      }
    }

    try {
      if (item.cartItemId) {
        await updateCartItem(item.cartItemId, { quantity: item.qty + 1 });
        await reloadCart();
      } else {
        setCart((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          )
        );
      }

      if (amount) {
        setRemaining((prev) => (prev ?? 0) - item.price);
      }
    } catch (error) {
      alert(error?.message || "Không cập nhật được số lượng");
    }
  };

  const decreaseQty = async (item) => {
    try {
      if (item.cartItemId) {
        if (item.qty <= 1) {
          await deleteCartItem(item.cartItemId);
        } else {
          await updateCartItem(item.cartItemId, { quantity: item.qty - 1 });
        }

        await reloadCart();
      } else {
        setCart((prev) =>
          prev
            .map((p) =>
              p.id === item.id ? { ...p, qty: p.qty - 1 } : p
            )
            .filter((p) => p.qty > 0)
        );
      }

      if (amount) {
        setRemaining((prev) => (prev ?? 0) + item.price);
      }
    } catch (error) {
      alert(error?.message || "Không cập nhật được số lượng");
    }
  };


  if (!student && !amount) return <div className="p-6">Loading...</div>;

  return (
    // <div className="h-screen flex flex-col">
    <div
      className="h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >

      <Header
        student={student}
        amount={remaining ?? amount}
      />


      <div className="flex flex-1 overflow-hidden">

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
          isSubmitting={isSubmitting}
          successModal={successModal}
          setSuccessModal={setSuccessModal}
          pickupType={pickupType}
          setPickupType={setPickupType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          canPayByWallet={canPayByWallet}
          walletAvailable={walletAvailable}
        />

      </div>
    </div>
  );

}
