import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Truck,
  User,
  UserCog,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { authApi } from "../../api";
import { kitchenRecipeApi } from "../../api/kitchenRecipeApi";
import useRecipeNotifications from "../../hooks/useRecipeNotifications";
import ProductRecipeModal from "../Products/ProductRecipeModal";

/* `match` lists extra path prefixes that belong to an item (sub pages reached from it). */
const menu = [
  { name: "Tổng quan", path: "/", icon: LayoutDashboard },
  {
    name: "Hàng hóa",
    icon: Package,
    children: [
      { name: "Danh mục", path: "/products", match: ["/meal-items"] },
      { name: "Thiết lập giá", path: "/price-book" },
      {
        name: "Kho",
        path: "/warehouse",
        match: ["/stock-in", "/stock-out", "/stock-sale", "/stock-lots", "/stock-transfer", "/stock-takes"],
      },
      { name: "Thu chi", path: "/cash-management" },
    ],
  },
  { name: "Nhà cung cấp", path: "/suppliers", icon: Truck },
  {
    name: "Khách hàng",
    icon: Users,
    children: [
      { name: "Danh sách khách hàng", path: "/customers" },
      { name: "Lịch sử ví thành viên", path: "/wallet-transactions" },
    ],
  },
  { name: "Đơn hàng", path: "/orders", icon: ShoppingBag },
  { name: "Bán trú", path: "/boarding-orders", icon: UtensilsCrossed },
  {
    name: "Nhân viên",
    icon: UserCog,
    children: [
      { name: "Danh sách nhân viên", path: "/employees" },
      { name: "Lịch làm việc", path: "/time-sheet" },
      { name: "Bảng chấm công", path: "/time-keeping" },
      { name: "Bảng lương", path: "/pay-sheet" },
    ],
  },
  {
    name: "Báo cáo",
    icon: BarChart3,
    children: [
      { name: "Cuối ngày", path: "/report-end-day" },
      { name: "Hàng hóa", path: "/report-product" },
      { name: "Nhân viên", path: "/report-employee" },
      { name: "Bán trú", path: "/report-boarding" },
    ],
  },
];

const extraTitles = [
  { path: "/account", trail: ["Tài khoản"] },
  { path: "/store-info", trail: ["Thông tin gian hàng"] },
];

const COLLAPSE_KEY = "admin.sidebarCollapsed";

function matchesPath(pathname, item) {
  if (!item.path) return false;
  if (item.path === "/") return pathname === "/";
  return [item.path, ...(item.match || [])].some((p) => pathname.startsWith(p));
}

function isItemActive(pathname, item) {
  if (item.children) return item.children.some((sub) => matchesPath(pathname, sub));
  return matchesPath(pathname, item);
}

function getTrail(pathname) {
  for (const item of menu) {
    if (item.children) {
      const sub = item.children.find((s) => matchesPath(pathname, s));
      if (sub) return [item.name, sub.name];
    } else if (matchesPath(pathname, item)) {
      return [item.name];
    }
  }
  const extra = extraTitles.find((e) => pathname.startsWith(e.path));
  return extra ? extra.trail : ["Quản trị"];
}

function initialsOf(name) {
  const parts = String(name || "Admin").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function useClickOutside(ref, onOutside, enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, enabled]);
}

function SidebarNav({ pathname, collapsed, onNavigate, onExpandRequest }) {
  // User toggles override the default (a group is open when it holds the active page).
  const [openGroups, setOpenGroups] = useState({});

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-hide">
      {menu.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item);
        const open = openGroups[item.name] ?? active;

        const baseRow = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${
          collapsed ? "justify-center" : ""
        }`;

        if (!item.children) {
          return (
            <button
              key={item.name}
              type="button"
              title={collapsed ? item.name : undefined}
              onClick={() => onNavigate(item.path)}
              className={`${baseRow} ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </button>
          );
        }

        return (
          <div key={item.name}>
            <button
              type="button"
              title={collapsed ? item.name : undefined}
              onClick={() => {
                if (collapsed) {
                  onExpandRequest();
                  setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
                  return;
                }
                setOpenGroups((prev) => ({ ...prev, [item.name]: !open }));
              }}
              className={`${baseRow} ${
                active ? "text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              } ${active && collapsed ? "bg-blue-600" : ""}`}
            >
              <Icon size={19} className={`shrink-0 ${active && !collapsed ? "text-blue-400" : ""}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">{item.name}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {!collapsed && open && (
              <div className="ml-[22px] mt-1 space-y-0.5 border-l border-slate-700/70 pl-3">
                {item.children.map((sub) => {
                  const subActive = matchesPath(pathname, sub);
                  return (
                    <button
                      key={sub.path}
                      type="button"
                      onClick={() => onNavigate(sub.path)}
                      className={`relative flex w-full items-center rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors cursor-pointer ${
                        subActive
                          ? "bg-white/10 font-semibold text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`}
                    >
                      {subActive && (
                        <span className="absolute -left-[13px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-blue-500" />
                      )}
                      <span className="truncate">{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-5 ${collapsed ? "justify-center px-0" : ""}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/40">
        <Store size={18} />
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[15px] font-bold tracking-tight text-white">Kido Canteen</div>
          <div className="truncate text-[11px] font-medium text-slate-400">Hệ thống quản trị</div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [openMobile, setOpenMobile] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState(null);
  const [shortageNotification, setShortageNotification] = useState(null);

  const userRef = useRef(null);
  const notiRef = useRef(null);
  useClickOutside(userRef, () => setOpenUser(false), openUser);
  useClickOutside(notiRef, () => setOpenNotifications(false), openNotifications);

  const user = authApi.getUserInfo();
  const notifications = useRecipeNotifications(user);
  const trail = useMemo(() => getTrail(pathname), [pathname]);

  const go = (path) => {
    setOpenMobile(false);
    setOpenUser(false);
    setOpenNotifications(false);
    navigate(path);
  };

  const toggleCollapsed = (value) => {
    const next = typeof value === "boolean" ? value : !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem("isLogin");
    navigate("/login");
  };

  async function openRecipeNotification(notification) {
    setOpenNotifications(false);
    if (notification.type === "STOCK_SHORTAGE") setShortageNotification(notification);
    else
      setNotificationProduct({
        id: notification.productId,
        name: notification.productName,
        branchId: notification.branchId,
      });
    if (!notification.isRead) {
      try {
        await kitchenRecipeApi.readNotification(notification.id);
        await notifications.reload();
      } catch {
        toast.error("Chưa đánh dấu được thông báo đã đọc. Vui lòng thử lại.");
      }
    }
  }

  const sidebarWidth = collapsed ? "lg:w-[76px]" : "lg:w-[264px]";
  const contentOffset = collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]";

  return (
    <div className="admin-shell min-h-screen bg-[#f3f5f9]">
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-900 transition-[width] duration-200 lg:flex print:hidden ${sidebarWidth}`}
      >
        <Brand collapsed={collapsed} />
        <SidebarNav
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={go}
          onExpandRequest={() => toggleCollapsed(false)}
        />
        <div className="border-t border-white/5 p-3">
          <button
            type="button"
            onClick={() => toggleCollapsed()}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Thu gọn menu</span>}
          </button>
        </div>
      </aside>

      {/* ============ MOBILE / TABLET DRAWER ============ */}
      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={() => setOpenMobile(false)} />
          <aside className="relative flex h-full w-[86vw] max-w-[300px] flex-col bg-slate-900 shadow-2xl animate-[admin-slide-in_.2s_ease-out]">
            <div className="flex items-center justify-between pr-3">
              <Brand collapsed={false} />
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setOpenMobile(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarNav pathname={pathname} collapsed={false} onNavigate={go} onExpandRequest={() => {}} />
            <div className="border-t border-white/5 p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ============ MAIN ============ */}
      <div className={`transition-[padding] duration-200 print:pl-0 ${contentOffset}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md print:hidden">
          <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setOpenMobile(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / title */}
            <div className="min-w-0 flex-1">
              {trail.length > 1 && (
                <div className="hidden items-center gap-1 text-[12px] font-medium text-slate-400 sm:flex">
                  <span>{trail[0]}</span>
                  <ChevronRight size={12} />
                </div>
              )}
              <div className="truncate text-[16px] font-bold tracking-tight text-slate-900 sm:text-[17px]">
                {trail[trail.length - 1]}
              </div>
            </div>

            {user.branchName && (
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12.5px] font-medium text-slate-600 md:flex">
                <Building2 size={14} className="text-blue-600" />
                <span className="max-w-[200px] truncate">{user.branchName}</span>
              </div>
            )}

            {/* Notifications */}
            <div className="relative" ref={notiRef}>
              <button
                type="button"
                aria-label="Thông báo hệ thống"
                onClick={() => {
                  setOpenNotifications((prev) => !prev);
                  notifications.reload();
                  setOpenUser(false);
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  openNotifications ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Bell size={20} />
                {notifications.unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {notifications.unreadCount > 99 ? "99+" : notifications.unreadCount}
                  </span>
                )}
              </button>

              {openNotifications && (
                <div className="absolute right-[-52px] top-full z-50 mt-2 w-[calc(100vw-24px)] max-w-[400px] sm:right-0">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <div>
                        <div className="text-[14px] font-bold text-slate-900">Thông báo hệ thống</div>
                        <div className="text-[12px] text-slate-500">
                          {notifications.unreadCount} thông báo chưa đọc
                        </div>
                      </div>
                      {notifications.unreadCount > 0 && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          Mới
                        </span>
                      )}
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                      {notifications.loading && (
                        <p role="status" className="px-4 py-3 text-sm text-slate-500">
                          Đang tải thông báo…
                        </p>
                      )}
                      {notifications.error && (
                        <p role="alert" className="px-4 py-3 text-sm text-red-600">
                          {String(notifications.error)}{" "}
                          <button type="button" onClick={notifications.reload} className="underline">
                            Thử lại
                          </button>
                        </p>
                      )}
                      {!notifications.loading && !notifications.error && !notifications.items.length && (
                        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Bell size={20} />
                          </div>
                          <p className="text-sm text-slate-500">Chưa có thông báo phản hồi từ bếp.</p>
                        </div>
                      )}
                      {notifications.items.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => openRecipeNotification(notification)}
                          className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50 ${
                            notification.isRead ? "bg-white" : "bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead ? "bg-slate-300" : "bg-blue-500"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="truncate text-sm font-semibold text-slate-900">{notification.title}</p>
                                <span className="shrink-0 text-[11px] text-slate-400">
                                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[13px] leading-5 text-slate-600">{notification.message}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenNotifications(false);
                }}
                className={`flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors cursor-pointer ${
                  openUser ? "bg-slate-100" : "hover:bg-slate-100"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[12px] font-bold text-white">
                  {initialsOf(user.fullName)}
                </span>
                <span className="hidden min-w-0 text-left leading-tight sm:block">
                  <span className="block max-w-[150px] truncate text-[13px] font-semibold text-slate-800">
                    {user.fullName || "Admin"}
                  </span>
                  <span className="block max-w-[150px] truncate text-[11px] text-slate-500">
                    {user.role || "Quản trị viên"}
                  </span>
                </span>
                <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
              </button>

              {openUser && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="truncate font-semibold text-slate-900">{user.fullName || "Admin"}</div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">{user.email || user.role || ""}</div>
                    {user.branchName && (
                      <div className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        <Building2 size={12} />
                        {user.branchName}
                      </div>
                    )}
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => go("/account")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <User size={16} className="text-slate-400" />
                      Tài khoản
                    </button>
                    <button
                      type="button"
                      onClick={() => go("/store-info")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Store size={16} className="text-slate-400" />
                      Thông tin gian hàng
                    </button>
                    <div className="my-1 h-px bg-slate-100" />
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>

      {notificationProduct && (
        <ProductRecipeModal
          key={notificationProduct.id}
          product={notificationProduct}
          onClose={() => setNotificationProduct(null)}
        />
      )}
      {shortageNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortage-notification-title"
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 text-slate-900 shadow-xl"
          >
            <h2 id="shortage-notification-title" className="text-xl font-bold">
              Bếp yêu cầu bổ sung nguyên liệu
            </h2>
            <p className="text-sm text-slate-600">
              {shortageNotification.branchName} · Ngày {shortageNotification.date.split("-").reverse().join("/")}
            </p>
            <p className="rounded-xl bg-red-50 p-4 font-semibold text-red-700">
              Thiếu{" "}
              {Number(shortageNotification.shortageQuantity).toLocaleString("vi-VN", { maximumFractionDigits: 4 })}{" "}
              {shortageNotification.unit} {shortageNotification.productName}
            </p>
            <p className="text-sm">
              Người gửi: {shortageNotification.requestedByName}. Vui lòng kiểm tra kho và bổ sung nguyên liệu cho bếp.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setShortageNotification(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() => {
                  setShortageNotification(null);
                  navigate("/warehouse");
                }}
              >
                Mở kho
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
