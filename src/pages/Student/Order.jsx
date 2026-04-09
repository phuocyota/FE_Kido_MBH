// import React, { useEffect, useState } from "react";
// import { ShoppingCart } from "lucide-react";
// import banhmi from "../../assets/banhmi.jpg";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();
//   const [student, setStudent] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("Tất cả");

//   const [noteModal, setNoteModal] = useState(null);
//   const [noteValue, setNoteValue] = useState("");
//   const [confirmModal, setConfirmModal] = useState(false);
//   const [successModal, setSuccessModal] = useState(null);

//   // tạo số thứ tự không trùng lặp
//   const generateOrderNumber = () => {
//     let current = localStorage.getItem("orderNumber");

//     if (!current) {
//       current = 1;
//     } else {
//       current = parseInt(current) + 1;
//     }

//     localStorage.setItem("orderNumber", current);

//     return current;
//   };

//   const categories = ["Tất cả", "Nước", "Bánh", "Bánh mì", "Cơm", "Trái cây", "Khác", "Đồ ăn vặt", "Mì gói", "Sữa chua", "Sinh tố", "Cà phê", "Trà", "Nước ép"];

//   const products = [
//     { id: 1, name: "Trà sữa", price: 20000, category: "Nước" },
//     { id: 2, name: "Coca", price: 10000, category: "Nước" },
//     { id: 3, name: "Bánh ngọt", price: 15000, category: "Bánh" },
//     { id: 4, name: "Bánh mì thịt", price: 20000, category: "Bánh mì" },
//     { id: 5, name: "Cơm gà", price: 30000, category: "Cơm" },
//   ];

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("student"));
//     setStudent(data);
//   }, []);

//   const filteredProducts =
//     activeCategory === "Tất cả"
//       ? products
//       : products.filter((p) => p.category === activeCategory);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const exist = prev.find((p) => p.id === item.id);

//       if (exist) {
//         return prev.map((p) =>
//           p.id === item.id ? { ...p, qty: p.qty + 1 } : p
//         );
//       }

//       return [...prev, { ...item, qty: 1, note: "" }];
//     });
//   };

//   const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

//   const handlePayment = () => {
//     if (cart.length === 0) {
//       alert("Chưa có món");
//       return;
//     }

//     if (total > student.balance) {
//       alert("❌ Không đủ tiền");
//       return;
//     }

//     // 👉 chỉ mở confirm modal
//     setConfirmModal(true);
//   };

//   const handleConfirmPayment = () => {
//     const updated = { ...student, balance: student.balance - total };
//     localStorage.setItem("student", JSON.stringify(updated));
//     setStudent(updated);

//     const orderNumber = generateOrderNumber();

//     // ✅ LƯU ORDER
//     const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];

//     const newOrder = {
//       id: orderNumber,
//       items: cart,
//       total,
//       status: "pending",
//       studentId: student?.cardId || "unknown", // ✅ ĐÚNG
//     };


//     localStorage.setItem("orders", JSON.stringify([...oldOrders, newOrder]));

//     setConfirmModal(false);
//     setSuccessModal(orderNumber);
//     setCart([]);
//   };
//   if (!student) return <div className="p-6">Không có dữ liệu</div>;

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">


//       {/* HEADER */}
//       <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">

//         {/* LEFT */}
//         <div className="flex items-center gap-4">
//           <div className="text-lg font-bold whitespace-nowrap">
//             🍔 Căn Tin Số
//           </div>
// {/* 
//           <input
//             placeholder="Tìm món..."
//             className="px-4 py-2 rounded-xl text-white w-100 shadow-lg outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400"
//           /> */}
//         </div>

//         {/* RIGHT */}
//         {student && (
//           <div className="flex items-center gap-4 font-semibold">

//             {/* AVATAR */}
//             <img
//               src={student.avatar}
//               alt="avatar"
//               className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
//             />

//             {/* NAME + MONEY */}
//             <div className="flex flex-col text-sm">
//               <span>{student.name}</span>
//               <span className="text-yellow-300 font-bold">
//                 💰 {student.balance.toLocaleString()}đ
//               </span>
//             </div>

//           </div>
//         )}

//       </div>

//       {/* BODY */}

//       <div className="flex flex-1 bg-gray-200">

//         {/* LEFT */}
//         <div className="w-[60%] bg-white rounded-xl m-3 shadow flex flex-col">

//           {/* CATEGORY */}
//           <div className="p-3 flex gap-2 border-b border-gray-400">
//             <div className="flex items-center gap-2 overflow-hidden w-[70%]">

//     {/* NÚT SCROLL TRÁI */}
//     <button
//       onClick={() => {
//         document.getElementById("category-scroll").scrollBy({
//           left: -200,
//           behavior: "smooth",
//         });
//       }}
//       className="bg-gray-200 px-2 py-1 rounded-lg cursor-pointer"
//     >
//       ◀
//     </button>

//     {/* CATEGORY LIST */}
//     <div
//       id="category-scroll"
//       className="flex gap-2 overflow-x-auto scrollbar-hide"
//     >
//       {categories.map((c) => (
//         <button
//           key={c}
//           onClick={() => setActiveCategory(c)}
//           className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer ${
//             activeCategory === c
//               ? "bg-blue-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           {c}
//         </button>
//       ))}
//     </div>

//     {/* NÚT SCROLL PHẢI */}
//     <button
//       onClick={() => {
//         document.getElementById("category-scroll").scrollBy({
//           left: 200,
//           behavior: "smooth",
//         });
//       }}
//       className="bg-gray-200 px-2 py-1 rounded-lg cursor-pointer"
//     >
//       ▶
//     </button>
//   </div>

//   {/* SEARCH INPUT */}
//   <input
//     placeholder="Tìm món..."
//     className="ml-auto px-4 py-2 rounded-xl w-[250px] shadow border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
//   />
//           </div>

//           {/* PRODUCTS */}
//           <div className="flex-1 p-2 grid grid-cols-4 gap-4 items-start content-start overflow-auto">
//             {filteredProducts.map((p) => (
//               <div
//                 key={p.id}
//                 onClick={() => addToCart(p)}
//                 className="bg-white rounded-xl border border-gray-300 hover:shadow-md transition cursor-pointer"
//               >
//                 <img
//                   src={banhmi}
//                   alt={p.name}
//                   className="w-full h-[120px] object-cover rounded-t-xl"
//                 />

//                 <div className="p-2">
//                   <p className="text-sm font-semibold">{p.name}</p>

//                   <div className="flex justify-between items-center mt-1">
//                     <span className="text-blue-600 text-sm font-bold">
//                       {p.price.toLocaleString()}đ
//                     </span>

//                     <ShoppingCart size={16} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="w-[40%] bg-white rounded-xl m-3 shadow flex flex-col p-4">

//           <h2 className="font-semibold mb-3">🛒 Giỏ hàng</h2>

//           {/* LIST */}
//           <div className="flex-1 overflow-auto space-y-3">
//             {cart.length === 0 ? (
//               <p className="text-gray-400 text-center mt-10">
//                 Chưa có món
//               </p>
//             ) : (
//               cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="border border-gray-300 rounded-xl p-3 flex flex-col gap-2"
//                 >
//                   {/* HEADER */}
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       <p className="text-blue-600 text-sm font-semibold">
//                         {item.price.toLocaleString()}đ
//                       </p>
//                     </div>

//                     <button
//                       onClick={() =>
//                         setCart(cart.filter((p) => p.id !== item.id))
//                       }
//                       className="text-red-500 text-lg cursor-pointer"
//                     >
//                       ✖
//                     </button>
//                   </div>

//                   {/* QUANTITY + NOTE (cùng hàng) */}
//                   <div className="flex justify-between items-center">

//                     {/* NOTE */}
//                     <div className="flex items-center gap-2">
//                       <p className="text-xs text-gray-500 italic">
//                         {item.note || "Chưa có ghi chú"}
//                       </p>

//                       <button
//                         onClick={() => {
//                           setNoteModal(item);
//                           setNoteValue(item.note || "");
//                         }}
//                         className="text-gray-400 cursor-pointer "
//                       >
//                         📝
//                       </button>
//                     </div>

//                     {/* QUANTITY */}
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() =>
//                           setCart((prev) =>
//                             prev.map((p) =>
//                               p.id === item.id
//                                 ? { ...p, qty: Math.max(1, p.qty - 1) }
//                                 : p
//                             )
//                           )
//                         }
//                         className="px-2 bg-gray-200 rounded cursor-pointer"
//                       >
//                         -
//                       </button>

//                       <span>{item.qty}</span>

//                       <button
//                         onClick={() =>
//                           setCart((prev) =>
//                             prev.map((p) =>
//                               p.id === item.id
//                                 ? { ...p, qty: p.qty + 1 }
//                                 : p
//                             )
//                           )
//                         }
//                         className="px-2 bg-gray-200 rounded cursor-pointer"
//                       >
//                         +
//                       </button>
//                     </div>


//                   </div>


//                 </div>
//               ))
//             )}
//           </div>

//           {/* TOTAL */}
//           <div className="border-t border-gray-300 pt-3 mt-2">
//             <div className="flex justify-between font-bold">
//               <span>Tổng tiền:</span>
//               <span>{total.toLocaleString()}đ</span>
//             </div>

//             <button
//               onClick={handlePayment}
//               className="w-full mt-3 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 cursor-pointer transition"
//             >
//               Thanh toán
//             </button>
//           </div>
//         </div>
//       </div>


// {/* NOTE MODAL */}
// {noteModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//     <div className="bg-white rounded-xl p-6 w-[350px]">
//       <h2 className="font-semibold mb-3">Nhập ghi chú</h2>

//       <textarea
//         value={noteValue}
//         onChange={(e) => setNoteValue(e.target.value)}
//         className="w-full border border-gray-300 rounded p-2 h-24 outline-none"
//         placeholder="Ví dụ: ít đá, không đường..."
//       />

//       <div className="flex justify-end gap-2 mt-4">
//         <button
//           onClick={() => setNoteModal(null)}
//           className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
//         >
//           Hủy
//         </button>

//         <button
//           onClick={() => {
//             setCart((prev) =>
//               prev.map((p) =>
//                 p.id === noteModal.id
//                   ? { ...p, note: noteValue }
//                   : p
//               )
//             );

//             setNoteModal(null);
//           }}
//           className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
//         >
//           Lưu
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {/* SUCCESS MODAL */}
// {successModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//     <div className="bg-white rounded-2xl p-6 w-[350px] text-center">

//       <h2 className="text-xl font-bold text-green-600 mb-2">
//         🎉 Thanh toán thành công
//       </h2>

//       <p className="text-gray-600 mb-4">
//         Số thứ tự của bạn
//       </p>

//       <div className="text-4xl font-bold text-blue-600 mb-6">
//         #{successModal}
//       </div>

//       <button
//         onClick={() => {
//           setSuccessModal(null);
//           navigate("/");
//         }}
//         className="w-full bg-blue-600 text-white py-3 rounded-xl"
//       >
//         OK
//       </button>
//     </div>
//   </div>
// )}

// {/* confirm modal */}
// {confirmModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//     <div className="bg-white rounded-2xl p-6 w-[400px]">

//       <h2 className="text-lg font-bold mb-3">
//         🧾 Xác nhận đơn hàng
//       </h2>

//       {/* LIST MÓN */}
//       <div className="max-h-60 overflow-auto space-y-2 mb-4">
//         {cart.map((item) => (
//           <div key={item.id} className="flex justify-between text-sm">
//             <span>
//               {item.name} x{item.qty}
//             </span>
//             <span>
//               {(item.price * item.qty).toLocaleString()}đ
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* TOTAL */}
//       <div className="flex justify-between font-bold mb-4 border-t border-gray-300 pt-3">
//         <span>Tổng:</span>
//         <span className="text-blue-600">
//           {total.toLocaleString()}đ
//         </span>
//       </div>

//       {/* BUTTON */}
//       <div className="flex gap-2  ">
//         <button
//           onClick={() => setConfirmModal(false)}
//           className="flex-1 bg-gray-200 py-2 rounded cursor-pointer"
//         >
//           Hủy
//         </button>

//         <button
//           onClick={handleConfirmPayment}
//           className="flex-1 bg-blue-600 text-white py-2 rounded cursor-pointer"
//         >
//           Xác nhận
//         </button>
//       </div>

//     </div>
//   </div>
// )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";

import Header from "../../components/Order/Header";
import Left from "../../components/Order/Left";
import Right from "../../components/Order/Right";


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
    { id: 1, name: "Trà sữa", price: 20000, category: "Nước" },
    { id: 2, name: "Coca", price: 10000, category: "Nước" },
    { id: 3, name: "Bánh ngọt", price: 15000, category: "Bánh" },
    { id: 4, name: "Bánh mì", price: 20000, category: "Bánh mì" },
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("student"));
    setStudent(data);
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
    id: orderNumber,
    items: cart,
    total,
    studentId: student?.id,
    studentName: student?.name,
    status: isCash ? "cash" : "pending",
    createdAt: Date.now(),
  };

  localStorage.setItem("orders", JSON.stringify([...oldOrders, newOrder]));

  setConfirmModal(false);
  setSuccessModal(orderNumber);
  setCart([]);
};

  

  if (!student) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-screen flex flex-col">

      <Header student={student} />

      <div className="flex flex-1 bg-gray-200">

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
