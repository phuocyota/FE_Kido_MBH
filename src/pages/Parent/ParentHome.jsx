import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, History, BarChart, CreditCard, Menu, LogOut } from "lucide-react";
import bg from "../../assets/anh-can-tin-so-2.png";
import { buildAssetUrl } from "../../api/client";
import { getParentHome } from "../../api/parent";

const DEFAULT_AVATAR = "https://i.pravatar.cc/100";

export default function ParentHome() {
  const [open, setOpen] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchHome = async () => {
    try {
      setError("");
      const data = await getParentHome();
      setHomeData(data);
    } catch (err) {
      console.error("Fetch parent home error:", err);
      setError(err.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const user = homeData?.user;
  const avatarSrc = buildAssetUrl(user?.avatarUrl) || DEFAULT_AVATAR;

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
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full backdrop-blur-sm [mask-image:radial-gradient(circle_at_center,transparent_40%,black_100%)]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[90vh] flex gap-2">
          <div className="hidden md:flex w-64 bg-white rounded-2xl p-4 flex-col shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100">
            <div className="flex flex-col items-center mb-6 border-b border-gray-200 pb-4">
              <img
                src={avatarSrc}
                alt={user?.fullName || "Student avatar"}
                className="w-14 h-14 rounded-full mb-2 border-2 border-blue-500 shadow object-cover"
              />

              <p className="font-semibold text-gray-800 text-center">
                {user?.fullName || (loading ? "Đang tải..." : "Học sinh")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === ""}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
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

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden">
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-300 bg-white">
              <button onClick={() => setOpen(true)}>
                <Menu size={26} />
              </button>

              <p className="font-semibold">Canteen</p>

              <img
                src={avatarSrc}
                alt={user?.fullName || "Student avatar"}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-auto">
              <Outlet context={{ homeData, loading, error, refreshHome: fetchHome }} />
            </div>
          </div>
        </div>

        <div
          className={`absolute top-10 left-4 w-64 bg-white z-50 shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-2xl transform transition-all duration-300 ${
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="p-4 border-b border-gray-300 flex justify-between items-center">
            <p className="font-semibold">Menu</p>
            <button onClick={() => setOpen(false)}>x</button>
          </div>

          <div className="p-4 flex items-center gap-3 border-b border-gray-300">
            <img
              src={avatarSrc}
              alt={user?.fullName || "Student avatar"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold">{user?.fullName || (loading ? "Đang tải..." : "Học sinh")}</p>
          </div>

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
                    `flex items-center gap-3 px-3 py-2 rounded-xl ${
                      isActive ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>

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
