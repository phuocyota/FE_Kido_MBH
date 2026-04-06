import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import logo from "../../assets/kido.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
      const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleLogin = () => {
  if (username === "123" && password === "123") {
      localStorage.setItem("isLogin", "true");
    toast.success("Đăng nhập thành công 🎉");
    navigate("/");
  } else {
    toast.error("Sai tài khoản hoặc mật khẩu ❌");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* CARD */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-6 sm:p-8">

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

          {/* USERNAME */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-0 top-2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tên đăng nhập hoặc Sđt"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 pl-7 text-sm"
                  value={username}
  onChange={(e) => setUsername(e.target.value)}
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
    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
  >
    Đăng nhập
  </button>
</form>

        </div>
      </div>
    </div>
  );
}