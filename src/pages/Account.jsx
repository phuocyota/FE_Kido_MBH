import React, { useState } from "react";
import {
  User,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Ban,
  Pencil,
} from "lucide-react";

export default function Account() {
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto">

         

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 lg:p-8">

          {/* TITLE */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Thông tin tài khoản
              </h2>

              <p className="text-sm text-gray-500">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* LEFT */}
            <div className="space-y-5">

              {/* USER NAME */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Tên người dùng
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    defaultValue="Nguyen"
                    disabled={!isEditing}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* LOGIN */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Tên đăng nhập
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    disabled
                    defaultValue="0776142018"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      bg-gray-100
                      text-gray-500
                      cursor-not-allowed
                      opacity-80
                    "
                  />
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Vai trò
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    disabled
                    defaultValue="Admin"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      bg-gray-100
                      text-gray-500
                      cursor-not-allowed
                      opacity-80
                    "
                  />
                </div>
              </div>

              {/* PASSWORD TITLE */}
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Đổi mật khẩu
                </h3>
              </div>

              {/* CURRENT PASSWORD */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Mật khẩu hiện tại
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPass ? "text" : "password"}
                    disabled={!isEditing}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-12
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />

                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => setShowPass(!showPass)}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    {showPass ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Mật khẩu mới
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showNewPass ? "text" : "password"}
                    disabled={!isEditing}
                    placeholder="Nhập mật khẩu mới"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-12
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />

                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    {showNewPass ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Điện thoại
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    disabled
                    defaultValue="+84776142018"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      bg-gray-100
                      text-gray-500
                      cursor-not-allowed
                      opacity-80
                    "
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    disabled={!isEditing}
                    placeholder="Nhập email"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              {/* ADDRESS */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Địa chỉ
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="Nhập địa chỉ"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* CITY */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Tỉnh / Thành phố
                </label>

                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="Tỉnh / Thành phố"
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    h-12
                    px-4
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    disabled:bg-gray-100
                    disabled:text-gray-500
                    disabled:cursor-not-allowed
                  "
                />
              </div>

              {/* DISTRICT */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Quận / Huyện
                </label>

                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="Quận / Huyện"
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    h-12
                    px-4
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    disabled:bg-gray-100
                    disabled:text-gray-500
                    disabled:cursor-not-allowed
                  "
                />
              </div>

              {/* BIRTHDAY */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Ngày sinh
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    disabled={!isEditing}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-2xl
                      h-12
                      pl-12
                      pr-4
                      outline-none
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* NOTE */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Ghi chú
                </label>

                <textarea
                  rows="6"
                  disabled={!isEditing}
                  placeholder="Nhập ghi chú..."
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    p-4
                    outline-none
                    resize-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    disabled:bg-gray-100
                    disabled:text-gray-500
                    disabled:cursor-not-allowed
                  "
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-10">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="
                  h-12
                  px-6
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  transition-all
                  font-medium
                  flex items-center gap-2
                "
              >
                <Pencil size={18} />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="
                    h-12
                    px-6
                    rounded-2xl
                    bg-gray-200
                    hover:bg-gray-300
                    transition-all
                    font-medium
                    flex items-center gap-2
                  "
                >
                  <Ban size={18} />
                  Bỏ qua
                </button>

                <button
                  className="
                    h-12
                    px-6
                    rounded-2xl
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    transition-all
                    font-medium
                    flex items-center gap-2
                  "
                >
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}