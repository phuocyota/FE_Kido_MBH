import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Mail } from "lucide-react";
import logo from "../../assets/kido.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import RegisterFace from "../../components/FaceId/RegisterFace";
import { loginByCard } from "../../api/auth";
import bgImage from "../../assets/anh-can-tin-so-2.png";
import { loginCashier } from "../../api/auth";
import { saveAuthSession } from "../../api/session";

// 👉 import component Face (bạn đã làm ở trên)

export default function Login() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("account");

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const scanBufferRef = useRef([]);
  const cardLoginInFlightRef = useRef(false);

  // nhân viên login 
  const handleLoginCashier = async () => {
  try {

    const authData = await loginCashier({ username, password });

    saveAuthSession(authData);

    toast.success("Đăng nhập thành công");

    navigate("/kitchen");

  } catch (error) {
    toast.error(error?.message || "Đăng nhập thất bại");
  }
};

  const handleCardLogin = async (cardId) => {
    const normalizedCardId = String(cardId || "").trim();

    if (!normalizedCardId || cardLoginInFlightRef.current) return;

    try {
      cardLoginInFlightRef.current = true;
      const authData = await loginByCard(normalizedCardId);

      if (!authData?.accessToken) {
        throw new Error("Dang nhap the thanh cong nhung thieu accessToken");
      }

      console.log("CARD LOGIN AUTH:", authData);


      saveAuthSession(authData);
      toast.success("Dang nhap bang the thanh cong");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "The chua duoc gan tai khoan");
    } finally {
      cardLoginInFlightRef.current = false;
    }
  };

  useEffect(() => {
    const SCAN_RESET_MS = 500;
    const MIN_CARD_LENGTH = 3;
    const CARD_KEY_PATTERN = /^[a-z0-9]$/i;

    const onKeyDown = (event) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;

      const now = Date.now();

      if (event.key === "Enter") {
        const chars = scanBufferRef.current;
        scanBufferRef.current = [];
        const cardId = chars.map((item) => item.key).join("").trim();

        if (cardId.length < MIN_CARD_LENGTH) return;

        event.preventDefault();
        event.stopPropagation();
        handleCardLogin(cardId);
        return;
      }

      if (!CARD_KEY_PATTERN.test(event.key)) return;

      const last = scanBufferRef.current[scanBufferRef.current.length - 1];
      if (last && now - last.time > SCAN_RESET_MS) {
        scanBufferRef.current = [];
      }

      scanBufferRef.current.push({ key: event.key, time: now });
    };

    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  const handleLogin = () => {
    toast.error("Vui long quet the NFC");
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
  style={{
    backgroundImage: `url(${bgImage})`,
  }}
>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-6 sm:p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow">
            <img src={logo} alt="kido" className="w-full h-full object-cover" />
          </div>
          <div className="text-lg font-semibold text-gray-800 mt-3">
            Đăng nhập hệ thống nhân viên căn tin
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

          {/* Face ID disabled: QR-only flow */}
          {/* <button
            onClick={() => setTab("face")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "face"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
              }`}
          >
            <ScanFace size={16} className="inline mr-1" />
            Face ID
          </button> */}
        </div>

        {/* ================= TAB CONTENT ================= */}

        {/* 🧑‍💻 LOGIN ACCOUNT */}
        {tab === "account" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginCashier();
            }}
            className="space-y-5"
          >
            {/* USERNAME */}
<div className="relative">
  <Mail size={18} className="absolute left-0 top-2 text-gray-400" />

  <input
    type="text"
    placeholder="Email nhân viên"
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

        {/* 😊 FACE ID disabled: QR-only flow */}
        {/* {tab === "face" && (
          <RegisterFace
            onSuccess={() => {
              toast.success("Login bằng Face thành công 🎉");
              navigate("/");
            }}
          />
        )} */}
      </div>
    </div>
  );
}
