
import React  from "react";
import header1 from "../../assets/header1.png";
import header2 from "../../assets/header2.png";
import header3 from "../../assets/header3.png";
import header4 from "../../assets/header4.webp";

export default function Header({ student, amount }) {
  return (
    <div className="bg-blue-700 text-white flex items-center justify-between overflow-hidden">

      {/* LEFT: Banner chạy */}
      <div className="flex-1 overflow-hidden relative h-[70px]">

        <div className="flex animate-marquee whitespace-nowrap">
          <img src={header1} className="h-[70px] object-cover" />
          <img src={header2} className="h-[70px] object-cover" />

          {/* lặp lại để chạy mượt */}
          <img src={header1} className="h-[70px] object-cover" />
          <img src={header2} className="h-[70px] object-cover" />

          <img src={header3} className="h-[70px] object-cover" />
          <img src={header4} className="h-[70px] object-cover" />

          {/* lặp lại để chạy mượt */} 

          <img src={header3} className="h-[70px] object-cover" />
          <img src={header4} className="h-[70px] object-cover" />
        </div>

      </div>

      {/* RIGHT: Thông tin học sinh */}
{/* RIGHT */}
<div className="flex items-center gap-3 px-4 bg-blue-700 z-10">

  {/* 👉 TRƯỜNG HỢP QUÉT QR */}
  {amount != null && !isNaN(amount) && (
  <div className="text-yellow-300 font-bold text-lg">
    💰 Bạn có: {Number(amount).toLocaleString()}đ
  </div>
)}

  {/* 👉 TRƯỜNG HỢP QUẸT THẺ */}
  {student && student.balance != null && (
  <>
    <img
      src={student.avatar}
      alt=""
      className="w-10 h-10 rounded-full border-2 border-white"
    />

    <div className="grid grid-cols-2 gap-x-4 text-sm">
      <p className="font-semibold">{student.name}</p>
      <p className="text-gray-200 font-bold">{student.school}</p>

      <p className="text-yellow-300 font-bold">
        💰 {Number(student.balance).toLocaleString()}đ
      </p>

      <p className="text-gray-200 font-bold">
        Lớp: {student.class}
      </p>
    </div>
  </>
)}

</div>
    </div>
  );
}