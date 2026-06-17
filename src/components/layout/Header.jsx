import React from "react";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaBars, FaUserCircle } from "react-icons/fa";
import { authApi } from "../../api";

const menu = [
  { name: "Tổng quan", path: "/" },

  {
    name: "Hàng hóa",
    children: [
      { name: "Danh mục", path: "/products" },
      { name: "Thiết lập giá", path: "/price-book" },
      { name: "Kiểm kho", path: "/stock-takes" },
      { name: "Nhập kho", path: "/stock-in/create" },
      { name: "Chuyển kho", path: "/stock-transfer" },
      { name: "Thu chi", path: "/cash-management" },
    ],
  },

  {
    name: "Nhà cung cấp", path: "/suppliers",
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
      { name: "Kênh bán hàng", path: "/bao-cao/kenh-ban-hang" },

    ],
  },

  {
    name: "Thuế & Kế toán",
    children: [
      { name: "Thuế & Kế toán", path: "/thue" },
      { name: "Hóa đơn điện tử", path: "/hoa-don-dien-tu" },
    ],
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMobile, setOpenMobile] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const [openTabletMenu, setOpenTabletMenu] =
    useState(null);

  // biến giả lập đăng nhập
  const isLoggedIn = localStorage.getItem("isLogin") === "true";

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
              <div className="relative group">
                <div
                  onClick={() => setOpenUser(true)}
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
                    <div className="px-4 py-3 border-b font-semibold text-black">
                      0979370077
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
                <span className="font-semibold">0979370077</span>
                <button onClick={() => setOpenUser(false)}>✕</button>
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
    </>
  );
}