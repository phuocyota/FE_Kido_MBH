


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";
import { getProductsFull } from "../../api/products";
import {
  addCartItem,
  completeCart,
  deleteCartItem,
  getMyCart,
  updateCartItem,
} from "../../api/cart";
import trasuaImg from "../../assets/trasua.jpg";
import cocaImg from "../../assets/coca.jpg";
import banhngotImg from "../../assets/banhngot.jpeg";
import banhmiImg from "../../assets/banhmi.jpg";
import bgImg from "../../assets/anh-can-tin-so-2.png";


import butChiImg from "../../assets/but_chi.jpg";
import butQuatImg from "../../assets/but_quat.jpg";
import butThuImg from "../../assets/but_thu.jpg";
import ghimCaiAoImg from "../../assets/ghim_cai_ao.jpg";
import keomutImg from "../../assets/keo_mut.jpg";
import keovienImg from "../../assets/keo_vien.jpg";
import mohinhLapRapImg from "../../assets/mo_hinh_lap_rap.jpg";
import nuocSuoiImg from "../../assets/nuoc_suoi.jpg";
import quatCamTayImg from "../../assets/quat_cam_tay.jpg";
import snackImg from "../../assets/snack.jpg";
import stickerImg from "../../assets/sticker.jpg";
import suachuanoImg from "../../assets/sua_chua_nho.jpg";
import tapImg from "../../assets/tap.jpg";
import thachraucauImg from "../../assets/thach_rau_cau.jpg";
import thuocConThuImg from "../../assets/thuoc_con_thu.jpg";
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

  const fallbackCategories = [
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
 const fallbackProducts = [
  // ===== 5K =====
  {
    id: 1,
    name: "Kẹo mút",
    price: 5000,
    category: "Kẹo",
    image: keomutImg,
  },
  {
    id: 2,
    name: "Kẹo viên",
    price: 5000,
    category: "Kẹo",
    image: keovienImg,
  },
  {
    id: 3,
    name: "Sticker",
    price: 5000,
    category: "Phụ kiện",
    image: stickerImg,
  },
  {
    id: 4,
    name: "Ghim cài áo",
    price: 5000,
    category: "Phụ kiện",
    image: ghimCaiAoImg,
  },

  // ===== 10K =====
  {
    id: 5,
    name: "Bánh snack",
    price: 10000,
    category: "Snack",
    image: snackImg,
  },
  {
    id: 6,
    name: "Thạch rau câu",
    price: 10000,
    category: "Ăn vặt",
    image: thachraucauImg,
  },
  {
    id: 7,
    name: "Sữa chua nhỏ",
    price: 10000,
    category: "Sữa",
    image: suachuanoImg,
  },
  {
    id: 8,
    name: "Nước suối",
    price: 10000,
    category: "Nước",
    image: nuocSuoiImg,
  },

  // ===== Học tập =====
  {
    id: 9,
    name: "Tập",
    price: 10000,
    category: "Học tập",
    image: tapImg,
  },
  {
    id: 10,
    name: "Bút chì",
    price: 10000,
    category: "Học tập",
    image: butChiImg,
  },
  {
    id: 11,
    name: "Bút thú",
    price: 10000,
    category: "Học tập",
    image: butThuImg,
  },

  // ===== Tiện ích / đồ chơi =====
  {
    id: 12,
    name: "Quạt cầm tay",
    price: 5000,
    category: "Tiện ích",
    image: quatCamTayImg,
  },
  {
    id: 13,
    name: "Bút quạt",
    price: 10000,
    category: "Tiện ích",
    image: butQuatImg,
  },
  {
    id: 14,
    name: "Mô hình lắp ráp",
    price: 10000,
    category: "Đồ chơi",
    image: mohinhLapRapImg,
  },
  {
    id: 15,
    name: "Thước con thú",
    price: 5000,
    category: "Học tập",
    image: thuocConThuImg,
  },
];

  const syncCart = (nextCart) => {
    if (Array.isArray(nextCart?.items)) {
      setCart(nextCart.items);
    }
  };

  const reloadCart = async () => {
    const nextCart = await getMyCart();
    syncCart(nextCart);
    return nextCart;
  };

  useEffect(() => {
    const loadOrderingData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const fullCategories = await getProductsFull();
        setApiCategories(fullCategories);
        setApiProducts(fullCategories.flatMap((category) => category.products || []));
        await reloadCart();
      } catch (error) {
        console.error("Không tải được dữ liệu order từ API", error);
        alert(error?.message || "Không tải được danh sách sản phẩm");
      }
    };

    loadOrderingData();
  }, []);

  const categories = apiCategories.length
    ? ["Tất cả", ...apiCategories.map((category) => category.name)]
    : fallbackCategories;

  const products = apiProducts.length ? apiProducts : fallbackProducts;

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


  const addToCart = async (item) => {
    // 👉 Nếu đang dùng QR
    if (amount) {
      if (remaining < item.price) {
        alert("❌ Bạn không đủ tiền để mua món này");
        return;
      }
    }

    try {
      await addCartItem({
        productId: item.id,
        quantity: 1,
        note: item.note || "",
      });
      await reloadCart();

      if (amount) {
        setRemaining((prev) => (prev ?? 0) - item.price);
      }
    } catch (error) {
      alert(error?.message || "Không thêm được sản phẩm vào giỏ");
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Chưa có món");
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

      if (paymentMethod !== "cash" && !amount && student && total > Number(student.balance || 0)) {
        alert("Không đủ tiền");
        return;
      }

      const result = await completeCart({
        branchId: localStorage.getItem("branchId") || import.meta.env.VITE_BRANCH_ID || "branch-id",
        posDeviceId:
          localStorage.getItem("posDeviceId") ||
          localStorage.getItem("deviceId") ||
          import.meta.env.VITE_POS_DEVICE_ID ||
          "student-app",
        paymentMethod: paymentMethod === "cash" ? "CASH" : "WALLET",
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
        await updateCartItem(item.cartItemId, { quantity: item.qty - 1 });
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
