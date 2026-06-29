
import React  from "react";
import header1 from "../../assets/header1.png";
import header2 from "../../assets/header2.png";
import header3 from "../../assets/header3.png";
import header4 from "../../assets/header4.png";

export default function Header({ student }) {
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
{student && (
  <div className="flex items-center gap-3 px-4 bg-blue-700 z-10">

    {/* Avatar */}
    <img
      src={student.avatar}
      alt=""
      className="w-10 h-10 rounded-full border-2 border-white"
    />

    {/* Grid 2 cột */}
    <div className="grid grid-cols-2 gap-x-4 text-sm">

      {/* Hàng 1 */}
      <p className="font-semibold">{student.name}</p>
      <p className="text-gray-200 text-sm font-bold">{student.school}</p>

      {/* Hàng 2 */}
      <p className={`font-bold ${student.balance < 0 ? 'text-red-400' : 'text-yellow-300'}`}>
        💰 {student.balance < 0 ? `Nợ: ${Math.abs(student.balance).toLocaleString()}` : student.balance.toLocaleString()}
      </p>
      <p className="text-gray-200 text-sm font-bold">Lớp: {student.class}</p>

    </div>
  </div>
)}
    </div>
  );
}