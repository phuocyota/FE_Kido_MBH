import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import logo from "../assets/kido.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bgLogin from "../assets/can-tin-so.png";
import { authApi } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      await authApi.login(email, password);
      localStorage.setItem("isLogin", "true");
      toast.success("Đăng nhập thành công 🎉");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu ❌";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  className="
    min-h-screen
    flex
    items-center
    justify-center
    px-4
    bg-cover
    bg-center
    bg-no-repeat
    relative
  "
  style={{
    backgroundImage: `url(${bgLogin})`,
  }}
>      
<div className="absolute inset-0 bg-black/10"></div>
      {/* CARD */}
<div
  className="
    relative
    z-10
    bg-white/95
    backdrop-blur-md
    w-full
    max-w-md
    rounded-3xl
    shadow-2xl
    p-6
    sm:p-8
  "
>
        {/* LOGO TRÒN */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow">
            <img
              src={logo}
              alt="kido"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-lg font-semibold text-gray-800 mt-3">
            Đăng nhập hệ thống
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-5">
            <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
  className="space-y-5"
>

          {/* EMAIL */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-0 top-2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email đăng nhập"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 pl-7 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-0 top-2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 pl-7 pr-10 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="absolute right-0 top-2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <span className="text-sm text-blue-600 cursor-pointer hover:underline">
              Quên mật khẩu?
            </span>
          </div>

          {/* BUTTON */}
          
  {/* inputs ở đây */}

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
  </button>
</form>

        </div>
      </div>
    </div>
  );
}