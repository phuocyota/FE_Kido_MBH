import React from "react";
import header1 from "../../assets/header1.png";
import header2 from "../../assets/header2.png";
import header3 from "../../assets/header3.png";
import header4 from "../../assets/header4.png";

export default function StaffHeader({
  fullName,
  avatar,
  onLogout,
}) {
  return (
    <div className="h-[70px] shrink-0 bg-blue-700 text-white flex items-center justify-between overflow-hidden">

      {/* Banner */}
      <div className="flex-1 overflow-hidden relative h-[70px]">
        <div className="flex animate-marquee whitespace-nowrap">
          <img src={header1} className="h-[70px] object-cover" />
          <img src={header2} className="h-[70px] object-cover" />
          <img src={header1} className="h-[70px] object-cover" />
          <img src={header2} className="h-[70px] object-cover" />
          <img src={header3} className="h-[70px] object-cover" />
          <img src={header4} className="h-[70px] object-cover" />
          <img src={header3} className="h-[70px] object-cover" />
          <img src={header4} className="h-[70px] object-cover" />
        </div>
      </div>

      {/* Nhân viên */}
      <div className="flex items-center gap-3 px-4 bg-blue-700 z-10">

        <img
          src={avatar || "https://i.pravatar.cc/150"}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
        />

        <div className="text-sm">
          <p className="font-semibold">
            {fullName || "Nhân viên"}
          </p>

          <p className="text-yellow-300 font-bold">
            Nhân viên căn tin
          </p>
        </div>

        <button
          onClick={onLogout}
          className="ml-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold"
        >
          Đăng xuất
        </button>

      </div>

    </div>
  );
}
