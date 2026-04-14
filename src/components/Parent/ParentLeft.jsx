import React from "react";
import { NavLink } from "react-router-dom";
import { Home, History, BarChart } from "lucide-react";

export default function ParentLeft() {
  const menu = [
  { name: "Trang chủ", path: "/", icon: <Home size={18} /> },
  { name: "Lịch sử", path: "/history", icon: <History size={18} /> },
  { name: "Thống kê", path: "/stats", icon: <BarChart size={18} /> },
];

  return (
    <div className="w-[300px] bg-white h-full p-4 shadow flex flex-col rounded-xl">

      {/* 👤 PROFILE */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="https://i.pravatar.cc/100"
          className="w-16 h-16 rounded-full mb-2"
        />
        <p className="font-semibold">Nguyễn Văn A</p>
        <p className="text-sm text-gray-500">Phụ huynh</p>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition 
              ${isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

      </div>

    </div>
  );
}