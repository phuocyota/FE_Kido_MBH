import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/anh-can-tin-so-2.png";

import FaceVerify from "../../components/FaceId/FaceVerify";
import { loginByCard } from "../../api/auth";

export default function Welcome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("qr");
  const scanInFlightRef = useRef(false);

  const saveAuthSession = (authData) => {
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("isLogin", "true");

    if (authData.userId) localStorage.setItem("userId", authData.userId);
    if (authData.userType) localStorage.setItem("userType", authData.userType);
    if (authData.deviceId) localStorage.setItem("deviceId", authData.deviceId);
  };

  const handleScan = async (data) => {
    const cardId = String(data || "").trim();

    if (!cardId || scanInFlightRef.current) return;

    try {
      scanInFlightRef.current = true;
      const authData = await loginByCard(cardId);

      if (!authData?.accessToken) {
        throw new Error("Dang nhap the thanh cong nhung thieu accessToken");
      }

      saveAuthSession(authData);

      navigate("/order", {
        state: {
          type: "student",
          student: {
            id: authData.userId,
            cardId: authData.deviceId || cardId,
            userType: authData.userType,
          },
        },
      });
    } catch (error) {
      alert(error?.message || "The chua duoc gan tai khoan");
    } finally {
      scanInFlightRef.current = false;
    }
  };

  useEffect(() => {
    let buffer = "";
    let timeout;
    const CARD_KEY_PATTERN = /^[a-z0-9]$/i;

    const handleKeyDown = (e) => {
      if (CARD_KEY_PATTERN.test(e.key)) {
        buffer += e.key;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          buffer = "";
        }, 500);
      }

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          handleScan(buffer);
          buffer = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative bg-blue/10 backdrop-blur-2xl border border-blue20 p-10 rounded-3xl text-center text-white w-[420px] shadow-2xl">
        <div className="text-6xl mb-4">🍔</div>

        <div className="flex mb-5 border-b border-white/30">
          <button
            onClick={() => setTab("qr")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "qr"
              ? "border-b-2 border-white text-white"
              : "text-white/60"
              }`}
          >
            🎫 Scan QR / NFC card
          </button>

          <button
            onClick={() => setTab("face")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "face"
              ? "border-b-2 border-white text-white"
              : "text-white/60"
              }`}
          >
            😊 Face ID
          </button>
        </div>

        {(tab === "face" || tab === "qr") && (
          <div className="mt-4">
            <FaceVerify
              mode={tab}
              onSuccess={(data) => {
                if (data?.type === "qr") {
                  handleScan(data.value);
                  return;
                }

                navigate("/order", {
                  state: {
                    type: "student",
                    student: data,
                  },
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
