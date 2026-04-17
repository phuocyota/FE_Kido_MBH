import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, History, BarChart, CreditCard, Menu } from "lucide-react";
import bg from "../../assets/anh-can-tin-so-2.png";

export default function ParentHome() {
  const [open, setOpen] = useState(false);

  const child = {
    name: "Nguyễn Văn B",
    class: "Lớp 5A",
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  const menu = [
    { name: "Trang chủ", path: "", icon: Home },
    { name: "Lịch sử", path: "history", icon: History },
    { name: "Thống kê", path: "stats", icon: BarChart },
    { name: "Nạp tiền", path: "topup", icon: CreditCard },
  ];

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* 🌫️ BLUR XUNG QUANH CENTER */}
<div className="absolute inset-0 pointer-events-none">
  <div className="w-full h-full backdrop-blur-sm 
    [mask-image:radial-gradient(circle_at_center,transparent_40%,black_100%)]
  "></div>
</div>
      {/* 🌟 NỘI DUNG */}
      <div className="relative min-h-screen flex items-center justify-center p-4">

        {/* CONTAINER */}
        <div className="w-full max-w-6xl h-[90vh] flex gap-2">

          {/* ================= DESKTOP SIDEBAR ================= */}
          <div className="hidden md:flex w-64 bg-white rounded-2xl p-4 flex-col shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100">

            {/* USER */}
            <div className="flex flex-col items-center mb-6 border-b border-gray-200 pb-4">
              <img
                src={child.avatar}
                className="w-14 h-14 rounded-full mb-2 border-2 border-blue-500 shadow"
              />
              <p className="font-semibold text-gray-800">{child.name}</p>
              <p className="text-xs text-gray-500">{child.class}</p>
            </div>

            {/* MENU */}
            <div className="flex flex-col gap-2">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === ""}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* ================= MAIN ================= */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden">

            {/* 📱 MOBILE HEADER */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-300 bg-white">
              <button onClick={() => setOpen(true)}>
                <Menu size={26} />
              </button>

              <p className="font-semibold">Canteen</p>

              <img
                src={child.avatar}
                className="w-8 h-8 rounded-full"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              <Outlet />
            </div>
          </div>

        </div>

        {/* ================= MOBILE DRAWER ================= */}
        <div
  className={`absolute top-10 left-4 w-64 bg-white z-50 shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-2xl 
  transform transition-all duration-300
  ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
>
          {/* HEADER */}
          <div className="p-4 border-b border-gray-300 flex justify-between items-center">
            <p className="font-semibold">Menu</p>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* USER */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-300">
            <img
              src={child.avatar}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{child.name}</p>
              <p className="text-xs text-gray-500">{child.class}</p>
            </div>
          </div>

          {/* MENU */}
          <div className="p-4 flex flex-col gap-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  end={item.path === ""}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* OVERLAY */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

      </div>
    </div>
  );
}