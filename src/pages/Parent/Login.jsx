import React, { useState, useRef, useEffect } from "react";
import bg from "../../assets/anh-can-tin-so-2.jpg";
import logo from "../../assets/kido.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginStudent } from "../../api/auth"; // sửa đúng path của bạn

export default function Login() {
      const [studentId, setStudentId] = useState("");
      const [password, setPassword] = useState("");
      const [showPass, setShowPass] = useState(false);
      const [loading, setLoading] = useState(false);

      const inputRef = useRef(null);
      const navigate = useNavigate();

      // 🎯 auto focus
      useEffect(() => {
            inputRef.current?.focus();
      }, []);

      const handleLogin = async () => {
            if (!studentId || !password) {
                  toast.error("Vui lòng nhập đầy đủ thông tin");
                  return;
            }

            try {
                  setLoading(true);

                  const res = await loginStudent({
                        username: studentId,
                        password,
                        deviceId: "device-12345",
                  });

                  // console.log("Login response:", res);

                  const data = res?.data;


                  if (res?.success && data?.accessToken) {
                        localStorage.setItem("accessToken", data.accessToken);
                        // ✅ THÊM DÒNG NÀY
                        localStorage.setItem("userId", data.userId);

                        toast.success("Đăng nhập thành công 🎉");

                        navigate("/");
                  } else {
                        toast.error(res?.message || "Đăng nhập thất bại");
                  }

            } catch (error) {
                  console.error(error);
                  toast.error(error.message);
            } finally {
                  setLoading(false);
            }
      };
      return (
            <div
                  className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${bg})` }}
            >
                  {/* overlay nhẹ */}
                  <div className="absolute inset-0 bg-white/30"></div>

                  {/* CARD */}
                  <div className="relative w-[360px] bg-white rounded-3xl p-8 
        shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-white/40
        transition-all duration-300"
                  >

                        {/* LOGO */}
                        <div className="flex flex-col items-center mb-6">
                              <div className="p-2 bg-white rounded-full  ">
                                    <img src={logo} className="w-16 h-16 rounded-full" />
                              </div>

                              <h1 className="text-2xl font-bold text-gray-800 mt-3">
                                    Căn Tin Số
                              </h1>
                              <p className="text-sm text-gray-500">

                                    Hệ thống quản lý chi tiêu của học sinh
                              </p>
                        </div>

                        {/* INPUT */}
                        <div className="space-y-4">

                              {/* Mã học sinh */}
                              <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Mã học sinh"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 
              focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    onKeyDown={(e) => {
                                          if (e.key === "Enter" && !loading) {
                                                handleLogin();
                                          }
                                    }}
                              />

                              {/* Password + icon */}
                              <div className="relative">
                                    <input
                                          type={showPass ? "text" : "password"}
                                          placeholder="Mật khẩu"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-blue-500 outline-none transition pr-10"
                                          onKeyDown={(e) => {
                                                if (e.key === "Enter" && !loading) {
                                                      handleLogin();
                                                }
                                          }}
                                    />

                                    {/* 👁️ icon */}
                                    <button
                                          type="button"
                                          onClick={() => setShowPass(!showPass)}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                    >
                                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                              </div>
                        </div>

                        {/* Quên mật khẩu */}
                        <div className="text-right mt-2">
                              <button
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => toast("Liên hệ nhà trường để cấp lại mật khẩu")}
                              >
                                    Quên mật khẩu?
                              </button>
                        </div>

                        {/* BUTTON */}
                        <button
                              onClick={handleLogin}
                              disabled={loading}
                              className={`w-full mt-5 py-3 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all
            ${loading
                                          ? "bg-blue-400 cursor-not-allowed"
                                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95"
                                    }`}
                        >
                              {loading && <Loader2 className="animate-spin" size={18} />}
                              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        {/* FOOTER */}
                        <p className="text-center text-xs text-gray-400 mt-5">
                              Hệ thống quản lý căn tin học sinh
                        </p>
                  </div>
            </div>
      );
}