import React, { useState } from "react";
import momo from "../../assets/momo.jpg";
import vnpay from "../../assets/vnpay.png";
import vietqr from "../../assets/vietqr.webp";

export default function Topup() {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("momo");

  const quickAmounts = [10000, 20000, 50000, 100000];

  const methods = [
  {
    id: "momo",
    name: "Thanh toán qua MoMo",
    img: momo,
  },
  {
    id: "vnpay",
    name: "Thanh toán qua VNPay",
    img: vnpay,
  },
  {
    id: "vietqr",
    name: "Thanh toán qua VietQR",
    img: vietqr,
  },
];

  return (
    <div className="p-5 space-y-5">

      {/* HEADER */}
      <h1 className="text-xl font-bold">💰 Nạp tiền</h1>

      {/* INPUT AMOUNT */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-3">
        <p className="font-semibold text-gray-700">
          Nhập số tiền
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Nhập số tiền..."
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* QUICK SELECT */}
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-2 rounded-full text-sm border border-gray-300 ${
                amount === a
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {a.toLocaleString()}đ
            </button>
          ))}
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-3">
        <p className="font-semibold text-gray-700">
          Chọn phương thức thanh toán
        </p>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
              method === m.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* ICON */}
              <img
  src={m.img}
  alt={m.name}
  className="w-10 h-10 object-contain"
/>

              <span className="text-gray-800 font-medium">
                {m.name}
              </span>
            </div>

            {/* CHECK */}
            {method === m.id && (
              <span className="text-blue-500 font-bold">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        disabled={amount <= 0}
        className={`w-full py-3 rounded-2xl font-semibold text-white transition ${
          amount > 0
            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
            : "bg-gray-300"
        }`}
      >
        Nạp {amount.toLocaleString()}đ
      </button>

    </div>
  );
}


// import React, { useState } from "react";
// import momo from "../../assets/momo.jpg";
// import vnpay from "../../assets/vnpay.png";
// import vietqr from "../../assets/vietqr.webp";

// export default function Topup() {
//   const [amount, setAmount] = useState(20000);
//   const [method, setMethod] = useState("momo");

//   const quickAmounts = [10000, 20000, 50000, 100000];

//   const methods = [
//     { id: "momo", name: "MoMo", img: momo },
//     { id: "vnpay", name: "VNPay", img: vnpay },
//     { id: "vietqr", name: "VietQR", img: vietqr },
//   ];

//   return (
//     <div className="p-6 space-y-6">

//       {/* HEADER */}
//       <h1 className="text-xl font-bold">💰 Nạp tiền</h1>

//       {/* HERO AMOUNT */}
//       <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-3xl shadow-xl text-center">
//         <p className="text-sm opacity-80">Số tiền nạp</p>
//         <p className="text-4xl font-bold mt-2">
//           {amount.toLocaleString()}đ
//         </p>
//       </div>

//       {/* QUICK AMOUNT */}
//       <div className="grid grid-cols-4 gap-3">
//         {quickAmounts.map((a) => (
//           <button
//             key={a}
//             onClick={() => setAmount(a)}
//             className={`py-2 rounded-xl text-sm font-medium transition ${
//               amount === a
//                 ? "bg-blue-500 text-white shadow"
//                 : "bg-gray-100 hover:bg-gray-200"
//             }`}
//           >
//             {a / 1000}k
//           </button>
//         ))}
//       </div>

//       {/* INPUT */}
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(Number(e.target.value))}
//         className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
//         placeholder="Nhập số tiền..."
//       />

//       {/* PAYMENT METHODS */}
//       <div className="space-y-3">
//         <p className="font-semibold text-gray-700">
//           Phương thức thanh toán
//         </p>

//         {methods.map((m) => (
//           <div
//             key={m.id}
//             onClick={() => setMethod(m.id)}
//             className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition border ${
//               method === m.id
//                 ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
//                 : "border-gray-200 hover:shadow"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={m.img}
//                 className="w-10 h-10 object-contain"
//               />
//               <div>
//                 <p className="font-medium">{m.name}</p>
//                 <p className="text-xs text-gray-400">
//                   Thanh toán nhanh chóng
//                 </p>
//               </div>
//             </div>

//             {/* RADIO */}
//             <div
//               className={`w-5 h-5 rounded-full border flex items-center justify-center ${
//                 method === m.id
//                   ? "border-blue-500"
//                   : "border-gray-300"
//               }`}
//             >
//               {method === m.id && (
//                 <div className="w-3 h-3 bg-blue-500 rounded-full" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* BUTTON */}
//       <button
//         className="w-full py-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:scale-[1.02] transition"
//       >
//         Nạp {amount.toLocaleString()}đ 🚀
//       </button>

//     </div>
//   );
// }