import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, ScanFace } from "lucide-react";
import logo from "../../assets/kido.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import RegisterFace from "../../components/FaceId/RegisterFace";

// 👉 import component Face (bạn đã làm ở trên)

export default function Login() {
  const navigate = useNavigate();

  const [tab, setTab] = useState < "account" | "face" > ("account");

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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-6 sm:p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow">
            <img src={logo} alt="kido" className="w-full h-full object-cover" />
          </div>
          <div className="text-lg font-semibold text-gray-800 mt-3">
            Đăng nhập hệ thống
          </div>
        </div>

        {/* 🔥 TAB */}
        <div className="flex mb-5 border-b">
          <button
            onClick={() => setTab("account")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "account"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
              }`}
          >
            <User size={16} className="inline mr-1" />
            Tài khoản
          </button>

          <button
            onClick={() => setTab("face")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "face"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
              }`}
          >
            <ScanFace size={16} className="inline mr-1" />
            Face ID
          </button>
        </div>

        {/* ================= TAB CONTENT ================= */}

        {/* 🧑‍💻 LOGIN ACCOUNT */}
        {tab === "account" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            {/* USERNAME */}
            <div className="relative">
              <User size={18} className="absolute left-0 top-2 text-gray-400" />
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
              <Lock size={18} className="absolute left-0 top-2 text-gray-400" />

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

            <div className="text-right">
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                Quên mật khẩu?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
          </form>
        )}

        {/* 😊 FACE ID */}
        {tab === "face" && (
          <RegisterFace
            onSuccess={() => {
              toast.success("Login bằng Face thành công 🎉");
              navigate("/");
            }}
          />
        )}
      </div>
    </div>
  );
}