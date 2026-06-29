import React, { useEffect, useState,useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, History, BarChart, CreditCard, Menu, LogOut, UtensilsCrossed } from "lucide-react";
import bg from "../../assets/anh-can-tin-so-2.png";
import { buildAssetUrl } from "../../api/client";
import { getParentHome } from "../../api/parent";
import { Pencil } from "lucide-react";

const DEFAULT_AVATAR = "https://i.pravatar.cc/100";

export default function ParentHome() {
  const [open, setOpen] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fabRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const touchOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    if (fabRef.current) {
      fabRef.current.style.transition = 'none';
      fabRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!fabRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      fabRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  };

  const handlePointerUp = (e) => {
    if (fabRef.current) {
      fabRef.current.releasePointerCapture(e.pointerId);
      
      if (isDragging.current) {
        const rect = fabRef.current.getBoundingClientRect();
        
        let newLeft = rect.left;
        let newTop = rect.top;
        
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

        fabRef.current.style.transform = 'none';
        fabRef.current.style.left = `${newLeft}px`;
        fabRef.current.style.top = `${newTop}px`;
        fabRef.current.style.right = 'auto';
        fabRef.current.style.bottom = 'auto';
      }
      
      fabRef.current.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  };

  const handleClick = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setOpen(true);
  };

const [previewAvatar, setPreviewAvatar] = useState(null);
const [avatarError, setAvatarError] = useState("");

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
  const avatarSrc = previewAvatar || buildAssetUrl(user?.avatarUrl) || DEFAULT_AVATAR;

  const menu = [
    { name: "Trang chủ", path: "", icon: Home },
   { name: "Đặt món", path: "order", icon: UtensilsCrossed,  },

    { name: "Lịch sử", path: "history", icon: History },
    { name: "Thống kê", path: "stats", icon: BarChart },
    { name: "Nạp tiền", path: "topup", icon: CreditCard },
  ];

  const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setAvatarError("");

  // Chỉ cho phép ảnh
  if (!file.type.startsWith("image/")) {
    setAvatarError("Vui lòng chọn tệp hình ảnh.");
    return;
  }

  // Giới hạn 5MB
  const MAX_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    setAvatarError("Ảnh không được vượt quá 5MB.");
    return;
  }

  // Preview ảnh
  const preview = URL.createObjectURL(file);

  setPreviewAvatar(preview);

  // ===========================
  // Sau này sẽ gọi API ở đây
  
  // ===========================
};

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full backdrop-blur-sm [mask-image:radial-gradient(circle_at_center,transparent_40%,black_100%)]" />
      </div>

      <div className="relative min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-6xl h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] flex gap-2">
          <div className="hidden md:flex w-64 bg-white rounded-2xl p-4 flex-col shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100">
            <div className="flex flex-col items-center mb-6 border-b border-gray-200 pb-4">

  <div className="relative">

    <img
      src={avatarSrc}
      alt={user?.fullName || "Student avatar"}
      className="w-16 h-16 rounded-full border-2 border-blue-500 shadow object-cover"
    />

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
    >
      <Pencil size={15} />
    </button>

    <input
      ref={fileInputRef}
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      className="hidden"
      onChange={handleAvatarChange}
    />

  </div>

  <p className="mt-3 font-semibold text-gray-800 text-center">
    {user?.fullName || (loading ? "Đang tải..." : "Học sinh")}
  </p>

  {avatarError && (
    <p className="mt-2 text-xs text-red-500 text-center">
      {avatarError}
    </p>
  )}

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
            <div className="md:hidden flex items-center p-4 border-b border-gray-300 bg-white relative shrink-0">
              <img
                src={avatarSrc}
                alt={user?.fullName || "Student avatar"}
                className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
              />
              <p className="font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">Canteen</p>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto overscroll-contain">
              <Outlet context={{ homeData, loading, error, refreshHome: fetchHome }} />
            </div>
          </div>
        </div>

        {/* Floating Speed Dial Container (Mobile Only) */}
        <div
          ref={fabRef}
          className="md:hidden touch-none fixed bottom-6 right-6 z-50 flex flex-col items-end"
          style={{ transition: "all 0.2s" }}
        >
          {/* Speed Dial Menu Items */}
          <div
            className={`flex flex-col gap-3 mb-4 transition-all duration-150 origin-bottom ${
              open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
            }`}
          >
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center gap-3 justify-end">
                  <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700 whitespace-nowrap">
                    {item.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      navigate(item.path);
                    }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 hover:bg-blue-50 active:scale-95 transition-transform"
                  >
                    <Icon size={20} />
                  </button>
                </div>
              );
            })}
            
            <div className="flex items-center gap-3 justify-end">
              <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-red-600 whitespace-nowrap">
                Đăng xuất
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  handleLogout();
                }}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-red-600 hover:bg-red-50 active:scale-95 transition-transform"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Main FAB */}
          <button
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleClick}
            className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] border-2 border-white ring-2 ring-blue-500 transition-all duration-150 overflow-hidden ${
              open ? "scale-90 opacity-80" : "hover:scale-105 active:scale-95"
            }`}
          >
            <img src="/kido.jpg" alt="Menu" className="w-full h-full object-cover pointer-events-none" />
          </button>
        </div>

        {/* Backdrop for closing speed dial */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300"
          />
        )}
      </div>
    </div>
  );
}
