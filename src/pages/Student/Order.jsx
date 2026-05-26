


import React, { useCallback, useEffect, useRef, useState } from "react";
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
import bgImg from "../../assets/anh-can-tin-so-2.png";
import {
  getProductsByPrice,
} from "../../api/products";

export default function Order() {
  const location = useLocation();
  const didLoadCartRef = useRef(false);

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
  const [cardPrice,setCardPrice]=useState(10000);

  // console.log("LOCAL TOKEN:", localStorage.getItem("accessToken"));
  // console.log("SESSION TOKEN:", sessionStorage.getItem("studentAccessToken"));
  // console.log("STUDENT:", localStorage.getItem("student"));

  // const syncCart = (nextCart) => {
  //   if (Array.isArray(nextCart?.items)) {
  //     setCart(nextCart.items);
  //   }
  // };
  const syncCart = useCallback((nextCart) => {

  console.log("SYNC CART:", nextCart);

  if (Array.isArray(nextCart?.items)) {
    setCart(nextCart.items);
  }
}, []);

  const originalAmount =
  Number(localStorage.getItem("amount")) || amount;

  // const reloadCart = async () => {
  //   const nextCart = await getMyCart();
  //   syncCart(nextCart);
  //   return nextCart;
  // };
  const reloadCart = useCallback(async () => {

  const nextCart = await getMyCart();

  console.log("GET MY CART:", nextCart);

  syncCart(nextCart);

  return nextCart;
}, [syncCart]);

  useEffect(() => {
    if ((!student && !amount) || didLoadCartRef.current) return;

    didLoadCartRef.current = true;
    reloadCart().catch((error) => {
      console.error("INITIAL GET CART ERROR:", error);
    });
  }, [student, amount, reloadCart]);

  // LOADING PRODUCTS
  const [loadingProducts, setLoadingProducts] =
  useState(false);
 
 

useEffect(() => {

  if (!cardPrice) return;

  if (loadingProducts) return;

  const loadOrderingData = async () => {

    try {

      setLoadingProducts(true);

      const maxPrice =
        Number(cardPrice);

      const fullCategories =
        await getProductsByPrice(
          0,
          maxPrice
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

    } finally {

      setLoadingProducts(false);

    }

  };

  loadOrderingData();

}, [cardPrice]);
  const categories = ["Tất cả", ...apiCategories.map((category) => category.name)];

  const products = apiProducts;

 

// console.log("CARD PRICE:", cardPrice);
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

    const matchPrice =
      Number(cardPrice) === 5000
        ? Number(p.price) <= 5000
        : true;

    return (
      matchCategory &&
      matchPrice
    );

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
  const isWalletBalanceInsufficient = () =>
    paymentMethod !== "cash" &&
    !amount &&
    student &&
    total > Number(student.balance || 0);

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Chưa có món");
      return;
    }

    if (isWalletBalanceInsufficient()) {
      alert("Số dư ví không đủ");
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



  const handleConfirmPayment = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isWalletBalanceInsufficient()) {
        alert("Số dư ví không đủ");
        return;
      }

      const result = await completeCart({

        paymentMethod:
          paymentMethod === "cash"
            ? "CASH"
            : "WALLET",

        orderType: "TAKEAWAY",

        note: pickupType,

      });

      const payload = result?.data || result;
      const order = payload?.order || payload;
      const orderNumber = order?.orderNumber || order?.code || order?.id || generateOrderNumber();

      if (paymentMethod !== "cash" && student) {
        const updated = { ...student, balance: Number(student.balance || 0) - total };
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

      {/* <Header student={student} amount={remaining ?? amount} setCardPrice={setCardPrice}/> */}
      <Header
  
  student={student}
  amount={remaining ?? amount}
  originalAmount={originalAmount}
  setCardPrice={setCardPrice}
/>


      <div className="flex flex-1 overflow-hidden">

        <Left
        key={cardPrice}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          products={filteredProducts}
          addToCart={addToCart}
         />

        <Right
          cart={cart}
          removeFromCart={removeFromCart}     // 👈 thêm
          increaseQty={increaseQty}           // 👈 thêm
          decreaseQty={decreaseQty}
          reloadCart={reloadCart}

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
        />

      </div>
    </div>
  );

}
