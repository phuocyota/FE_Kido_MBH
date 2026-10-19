import React from "react";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { authApi } from "../../api";
import { systemNotificationsData } from "../../datas/systemNotificationsData";

const menu = [
  { name: "Tổng quan", path: "/" },

  {
    name: "Hàng hóa",
    children: [
      { name: "Danh mục", path: "/products" },
      { name: "Thiết lập giá", path: "/price-book" },
      { name: "Kho", path: "/stock-in" },
      { name: "Thu chi", path: "/cash-management" },
    ],
  },

  {
    name: "Nhà cung cấp", path: "/suppliers",
  },
  {
    name: "Khách hàng",
    children: [
      { name: "Danh sách khách hàng", path: "/customers" },
      { name: "Lịch sử ví thành viên", path: "/wallet-transactions" },
    ],
  },

  {
    name: "Đơn hàng", path: "/orders",
  },
  {
    name: "Bán trú", path: "/boarding-orders",
  },

  // {
  //   name: "Giao dịch",
  //   children: [
  //     { name: "Hóa đơn", path: "/hoa-don" },
  //     { name: "Trả hàng", path: "/tra-hang" },
  //     { name: "Hóa đơn đầu vào", path: "/hoa-don-dau-vao" },
  //     { name: "Nhập hàng", path: "/nhap-hang" },
  //     { name: "Trả hàng nhập", path: "/tra-hang-nhap" },
  //     { name: "Xuất hủy", path: "/xuat-huy" },
  //   ],
  // },

  {
    name: "Nhân viên",
    children: [
      { name: "Danh sách nhân viên", path: "/employees" },
      { name: "Lịch làm việc", path: "/time-sheet" },
      { name: "Bảng chấm công", path: "/time-keeping" },
      { name: "Bảng lương", path: "/pay-sheet" },
    ],
  },

  // {
  //   name: "Bán Online",
  //   children: [
  //     { name: "Bán hàng Zalo", path: "/zalo" },
  //     { name: "Bán hàng Facebook", path: "/facebook" },
  //     { name: "Website bán hàng", path: "/website" },
  //   ],
  // },

  // { name: "Sổ quỹ", path: "/so-quy" },
  {
    name: "Báo cáo",
    children: [
      { name: "Cuối ngày", path: "/report-end-day" },
      { name: "Hàng hóa", path: "/report-product" },
      { name: "Nhân viên", path: "/report-employee" },
      { name: "Bán trú", path: "/report-boarding" },
      // { name: "Kênh bán hàng", path: "/bao-cao/kenh-ban-hang" },

    ],
  },

  // {
  //   name: "Thuế & Kế toán",
  //   children: [
  //     { name: "Thuế & Kế toán", path: "/thue" },
  //     { name: "Hóa đơn điện tử", path: "/hoa-don-dien-tu" },
  //   ],
  // },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMobile, setOpenMobile] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [parentReply, setParentReply] = useState("");

  const [openTabletMenu, setOpenTabletMenu] =
    useState(null);

  // biến giả lập đăng nhập
  const isLoggedIn = localStorage.getItem("isLogin") === "true";
  const user = authApi.getUserInfo();
  const unreadNotifications = systemNotificationsData.filter(
    (notification) => !notification.isRead
  );

  const isParentActive = (item) => {

    if (item.path === "/") {
      return location.pathname === "/";
    }


    if (item.path) {
      return location.pathname.startsWith(item.path);
    }


    if (item.children) {
      return item.children.some((sub) =>
        location.pathname.startsWith(sub.path)
      );
    }

    return false;
  };
  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="bg-blue-600">
        <div className="
  w-full
  max-w-[1800px]
  mx-auto
  px-3
  sm:px-4
  lg:px-5
  flex
  items-center
  justify-between
  h-14
  lg:h-16
  text-white
">          {/* LEFT */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* MOBILE BUTTON */}
            <button
              className="md:hidden text-xl"
              onClick={() => {
                setOpenMobile(true);
                setOpenUser(false);
              }}
            >
              <FaBars />
            </button>

            {/* MENU DESKTOP */}
            {/* MENU DESKTOP + TABLET */}
<div
  className="
    hidden
    md:block
    flex-1
    mx-3
    min-w-0
  "
>
  <div
    className="
      flex
      items-center
      gap-1
      lg:gap-2
      xl:gap-3
      overflow-visible
      relative
    "
  >
    {menu.map((item, i) => {

      const isTablet =
        window.innerWidth >= 768 &&
        window.innerWidth < 1280;

      const isOpen =
        openTabletMenu === i;

      return (
        <div
          key={i}
          className="
            relative
            shrink-0
            group
          "
        >

          {/* MENU CHA */}
          <div
            onClick={() => {

              // ===== TABLET / IPAD =====
              if (
                isTablet &&
                item.children
              ) {

                setOpenTabletMenu(
                  isOpen ? null : i
                );

                return;
              }

              // ===== MENU THƯỜNG =====
              if (item.path) {
                navigate(item.path);
              }
            }}
            className={`
              cursor-pointer

              px-3
              lg:px-4
              xl:px-4

              py-2

              rounded-xl
              transition-all

              whitespace-nowrap

              text-[15px]
              lg:text-[17px]
              xl:text-[18px]

              flex
              items-center
              gap-2

              ${
                isParentActive(item)
                  ? "bg-blue-800 text-white"
                  : "hover:bg-blue-800"
              }
            `}
          >
            <span>{item.name}</span>

            {item.children && (
              <span
                className={`
                  text-[10px]
                  transition-all
                  duration-200
                  ${
                    isOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              >
                ▼
              </span>
            )}
          </div>

          {/* CẦU NỐI */}
          {item.children && (
            <div
              className="
                absolute
                left-0
                top-full
                h-3
                w-full
              "
            />
          )}

          {/* DROPDOWN */}
          {item.children && (

            <div
              className={`
                absolute
                left-0
                top-full
                pt-4
                z-[9999]

                ${
                  isTablet
                    ? isOpen
                      ? "block"
                      : "hidden"
                    : "hidden group-hover:block"
                }
              `}
            >

              <div
                className="
                  bg-white
                  rounded-2xl
                  shadow-2xl
                  border
                  border-gray-200

                  w-[260px]
                  xl:w-[300px]

                  py-2

                  backdrop-blur-xl
                "
              >

                {item.children.map(
                  (sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => {

                        navigate(
                          sub.path
                        );

                        setOpenTabletMenu(
                          null
                        );
                      }}
                      className="
                        flex
                        items-center
                        justify-between

                        px-5
                        py-4

                        cursor-pointer

                        text-gray-800

                        hover:bg-gray-100

                        transition-all

                        text-[16px]
                        lg:text-[17px]
                        xl:text-[18px]
                      "
                    >
                      <span>
                        {sub.name}
                      </span>
                    </div>
                  )
                )}

              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            {!isLoggedIn ? (
              // ===== CHƯA ĐĂNG NHẬP =====
              <button
                onClick={() => navigate("/login")}
                className=" lg:text-[16px]
  xl:text-[18px] bg-white text-black px-4 py-2 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Đăng nhập
              </button>
            ) : (
              // ===== ĐÃ ĐĂNG NHẬP =====
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Thong bao he thong"
                    onClick={() => {
                      setOpenNotifications((prev) => !prev);
                      setOpenUser(false);
                    }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-yellow-300 transition-all hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-yellow-200 sm:h-11 sm:w-11"
                  >
                    <FaBell className="text-[22px] sm:text-[24px] lg:text-[26px]" />
                    {unreadNotifications.length > 0 && (
                      <span
                        className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-blue-600 bg-red-500 px-1 text-[11px] font-bold leading-none text-white"
                      >
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  {openNotifications && (
                    <div className="absolute right-[-48px] sm:right-0 mt-3 z-50 w-[calc(100vw-24px)] max-w-[380px]">
                      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b px-4 py-3 text-gray-900">
                          <div>
                            <div className="text-sm font-bold sm:text-base">Thông báo hệ thống</div>
                            <div className="text-xs text-gray-500">
                              {unreadNotifications.length} thông báo chưa đọc
                            </div>
                          </div>
                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                            Mới
                          </span>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto py-1">
                          {systemNotificationsData.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => {
                                setSelectedNotification(notification);
                                setParentReply("");
                                setOpenNotifications(false);
                              }}
                              className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition-all last:border-b-0 hover:bg-yellow-100 ${notification.isRead ? "bg-white" : "bg-yellow-50"}`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.isRead ? "bg-gray-300" : "bg-yellow-400"}`}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {notification.title}
                                    </p>
                                    <span className="shrink-0 text-[11px] text-gray-500">
                                      {notification.time}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm leading-5 text-gray-600">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                <div
                  onClick={() => {
                    setOpenUser(true);
                    setOpenNotifications(false);
                  }}
                  className="cursor-pointer"
                >
                  <FaUserCircle className="
  text-[26px]
  lg:text-[30px]
  text-white
" />
                </div>

                {/* DROPDOWN */}
                <div className="absolute right-0 mt-5 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="bg-gray-100 rounded-xl shadow-lg w-64 py-2">

                    {/* HEADER */}
                    <div className="px-4 py-3 border-b text-black">
                      <div className="font-bold text-gray-900 truncate">{user.fullName || "Admin"}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{user.email || user.role || ""}</div>
                      {user.branchName && (
                        <div className="text-[11px] font-semibold text-blue-600 mt-1.5 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block truncate max-w-full">
                          {user.branchName}
                        </div>
                      )}
                    </div>

                    {/* MENU */}
                    <div className="py-2">
                      <div
                        onClick={() => navigate("/account")}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                      >
                        Tài khoản
                      </div>
                      <div
                        onClick={() => navigate("/store-info")}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                      >
                        Thông tin gian hàng
                      </div>
                      <div
                        onClick={() => {
                          authApi.logout();
                          localStorage.removeItem("isLogin");
                          navigate("/login");
                        }}
                        className="px-4 py-2 text-red-500 cursor-pointer"
                      >
                        Đăng xuất
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ================= MOBILE MENU ================= */}
      {openMobile && (
        <div className="fixed inset-0 z-50">
          <div className="flex h-full">
            {/* SIDEBAR */}
            <div className="
  w-[85vw]
  max-w-[340px]
  bg-white
  h-full
  shadow-2xl
  flex
  flex-col
">
              {/* HEADER */}
              <div className="flex items-center gap-3 p-4 border-b">
                <button onClick={() => setOpenMobile(false)} className="cursor-pointer">←</button>
                <span className="font-semibold">Menu</span>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-3 pb-10">
                {menu.map((item, i) => (
                  <div key={i} className="mb-4">
                    <div
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path);
                          setOpenMobile(false);
                        }
                      }}
                      className={`
    font-semibold
    py-3
    px-3
    rounded-lg
    transition-all
    flex
    items-center
    justify-between

    ${item.path
                          ? "cursor-pointer hover:bg-gray-100"
                          : "cursor-default"
                        }

    ${isParentActive(item)
                          ? "bg-blue-500 text-white"
                          : "text-gray-800"
                        }
  `}
                    >
                      <span>{item.name}</span>

                      {item.children && (
                        <span className="text-sm opacity-70">›</span>
                      )}
                    </div>

                    {item.children && (

                      <div className="ml-3 space-y-2">
                        {item.children.map((sub, idx) => (
                          <div
                            key={idx}
                            onClick={() => navigate(sub.path)}
                            className={`flex justify-between items-center px-4 py-3 text-sm cursor-pointer rounded-md
  ${location.pathname === sub.path
                                ? "bg-blue-400 text-white-400 font-medium"
                                : "text-gray-800 hover:bg-gray-200"
                              }`}
                          >
                            <span>{sub.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpenMobile(false)}
            />
          </div>
        </div>
      )}

      {/* ================= USER MOBILE ================= */}
      {openUser && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="flex h-full">
            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpenUser(false)}
            />

            {/* SIDEBAR RIGHT */}
            <div className="
  w-[85vw]
  max-w-[360px]
  bg-white
  h-full
  shadow-2xl
  flex
  flex-col
">
              {/* HEADER */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{user.fullName || "Admin"}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{user.email || user.role || ""}</div>
                </div>
                <button onClick={() => setOpenUser(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              {/* MENU */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-gray-700">
                <div
                  onClick={() => {
                    navigate("/account");
                    setOpenUser(false);
                  }}
                  className="
    cursor-pointer
    p-3
    rounded-xl
    hover:bg-gray-100
    transition-all
  "
                >
                  👤 Tài khoản
                </div>
                <div
                  onClick={() => {
                    navigate("/store-info");
                    setOpenUser(false);
                  }}
                  className="
    cursor-pointer
    p-3
    rounded-xl
    hover:bg-gray-100
    transition-all
  "
                >
                  ⚙️ Thông tin gian hàng
                </div>
                {/* <div className="cursor-pointer">🏬 Quản lý mẫu in</div>
                <div className="cursor-pointer">📍 Quản lý chi nhánh</div>
                <div className="cursor-pointer">🧾 Lịch sử thao tác</div> */}
                <div className="cursor-pointer text-red-500">
                  🚪 Đăng xuất
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNotification && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/25 px-4 py-6">
          <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-300 bg-gradient-to-r from-blue-600 via-sky-500 to-yellow-400 px-5 py-5 text-white">
              <div className="min-w-0">
                <div className="inline-flex rounded-full border border-white/50 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">{selectedNotification.id}</div>
                <h2 className="mt-3 text-2xl font-bold leading-tight">{selectedNotification.title}</h2>
                <p className="mt-1 text-sm text-white/90">{selectedNotification.createdAt}</p>
              </div>
              <button type="button" onClick={() => setSelectedNotification(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl text-white transition-all hover:bg-white/30">×</button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-4 text-gray-800">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-blue-700">{selectedNotification.status}</span>
                <span className="rounded-full border border-gray-300 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">{selectedNotification.isRead ? "Đã đọc" : "Chưa đọc"}</span>
                <span className="rounded-full border border-gray-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{selectedNotification.amount}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                  <div className="text-xs font-semibold uppercase text-gray-500">Phụ huynh</div>
                  <div className="mt-1 font-semibold text-gray-900">{selectedNotification.parentName}</div>
                  <div className="mt-0.5 text-sm text-gray-600">{selectedNotification.parentPhone}</div>
                </div>
                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                  <div className="text-xs font-semibold uppercase text-gray-500">Học sinh</div>
                  <div className="mt-1 font-semibold text-gray-900">{selectedNotification.studentName}</div>
                  <div className="mt-0.5 text-sm text-gray-600">{selectedNotification.studentCode} · Lớp {selectedNotification.className}</div>
                </div>
                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                  <div className="text-xs font-semibold uppercase text-gray-500">Bữa / khu vực</div>
                  <div className="mt-1 font-semibold text-gray-900">{selectedNotification.mealSession}</div>
                  <div className="mt-0.5 text-sm text-gray-600">Trạng thái: {selectedNotification.status}</div>
                </div>
                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                  <div className="text-xs font-semibold uppercase text-gray-500">Số tiền</div>
                  <div className="mt-1 font-semibold text-gray-900">{selectedNotification.amount}</div>
                  <div className="mt-0.5 text-sm text-gray-600">{selectedNotification.isRead ? "Đã đọc" : "Chưa đọc"}</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                <div className="text-xs font-semibold uppercase text-gray-500">Thông tin món</div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Món cũ</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{selectedNotification.oldMeal || "Không có"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Món mới / món đặt</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{selectedNotification.newMeal || "Không có"}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-300 bg-yellow-50 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase text-yellow-800">Nội dung thông báo</div>
                <p className="mt-2 text-sm leading-6 text-gray-800">{selectedNotification.content}</p>
              </div>

              <div className="mt-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase text-blue-700">Phản hồi gửi phụ huynh</div>
                <textarea
                  value={parentReply}
                  onChange={(event) => setParentReply(event.target.value)}
                  placeholder="Nhập nội dung phản hồi cho phụ huynh..."
                  className="mt-3 min-h-[110px] w-full resize-none rounded-lg border border-gray-300 bg-blue-50/40 px-3 py-2 text-sm leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-300 bg-white px-5 py-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedNotification(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100">Đóng</button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Gửi phản hồi cho phụ huynh thành công");
                  setParentReply("");
                  setSelectedNotification(null);
                }}
                className="rounded-lg border border-gray-300 bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-yellow-300"
              >
                Gửi phản hồi phụ huynh
              </button>
              <button type="button" onClick={() => setSelectedNotification(null)} className="rounded-lg border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700">Xác nhận thông báo</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
