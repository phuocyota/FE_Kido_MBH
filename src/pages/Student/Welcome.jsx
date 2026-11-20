import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../../assets/anh-can-tin-so-2.webp";

import QRVerify from "../../components/FaceId/QRVerify";
import { loginByCard, loginStudent } from "../../api/auth";
import { saveAuthSession } from "../../api/session";

export default function Welcome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("card");
  const [account, setAccount] = useState({ username: "", password: "" });
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState("");

  const handleAccountLogin = async (e) => {
    e.preventDefault();

    if (!account.username.trim() || !account.password) {
      setAccountError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    if (accountLoading) return;

    try {
      setAccountLoading(true);
      setAccountError("");

      const authData = await loginStudent({
        username: account.username,
        password: account.password,
      });

      saveAuthSession(authData);

      const student = {
        id: authData.userId,
        cardId: authData.cardId,
        userType: authData.userType,
        name: authData.studentFullName || authData.fullName,
        avatar: authData.avatar,
        school: authData.school,
        class: authData.class,
        balance: authData.walletBalance,
        debtLimit: authData.debtLimit,
      };

      localStorage.setItem("student", JSON.stringify(student));

      navigate("/order", {
        state: {
          type: "student",
          student,
        },
      });
    } catch (error) {
      setAccountError(error?.message || "Tài khoản hoặc mật khẩu không đúng");
    } finally {
      setAccountLoading(false);
    }
  };
  const scanInFlightRef = useRef(false);
  const qrInFlightRef = useRef(false);
  const scanBufferRef = useRef([]);

  const normalizeCardId = (value) => {
    const raw = String(value || "").trim();
    const numericValue = raw.replace(/\D/g, "");

    return numericValue;
  };

  const handleCardScan = async (data) => {
    const cardId = normalizeCardId(data);

    if (cardId.length < 6 || scanInFlightRef.current) return;

    try {
      scanInFlightRef.current = true;
      const authData = await loginByCard(cardId);

      saveAuthSession(authData);

      const student = {
        id: authData.userId,
        cardId,
        userType: authData.userType,
        name: authData.studentFullName || authData.fullName,
        avatar: authData.avatar,
        school: authData.school,
        class: authData.class,
        balance: authData.walletBalance,
        debtLimit: authData.debtLimit,
      };

      localStorage.setItem("student", JSON.stringify(student));

      navigate("/order", {
        state: {
          type: "student",
          student,
        },
      });
    } catch (error) {
      alert(
        `Thẻ ${cardId}: ${
          error?.message || "Thông tin đăng nhập không hợp lệ"
        }`
      );
    } finally {
      scanInFlightRef.current = false;
    }
  };

  const handleQrPaymentScan = async (value) => {
    const cardId = String(value || "").trim();

    if (!cardId) {
      alert("QR không hợp lệ");
      return;
    }

    if (qrInFlightRef.current) return;

    try {
      qrInFlightRef.current = true;
      const authData = await loginByCard(cardId);

      saveAuthSession(authData);
      const student = {
        id: authData.userId,
        cardId,
        userType: authData.userType,
        name: authData.studentFullName || authData.fullName,
        avatar: authData.avatar,
        school: authData.school,
        class: authData.class,
        balance: authData.walletBalance,
        debtLimit: authData.debtLimit,
      };

      localStorage.setItem("student", JSON.stringify(student));
      localStorage.removeItem("amount");

      navigate("/order", {
        state: {
          type: "student",
          student,
        },
      });
    } catch (error) {
      alert(error?.message || "QR thanh toán không hợp lệ");
    } finally {
      qrInFlightRef.current = false;
    }
  };

  // Face login disabled: QR-only flow.
  // const handleFaceLoginSuccess = (student) => {
  //   navigate("/order", {
  //     state: {
  //       type: "student",
  //       student,
  //     },
  //   });
  // };

  useEffect(() => {
    const SCAN_RESET_MS = 500;
    const MIN_CARD_LENGTH = 6;
    const CARD_KEY_PATTERN = /^[0-9]$/;

    const handleKeyDown = (e) => {
      const target = e.target;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isEditable || e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;

      if (CARD_KEY_PATTERN.test(e.key)) {
        const now = Date.now();
        const last = scanBufferRef.current[scanBufferRef.current.length - 1];

        if (last && now - last.time > SCAN_RESET_MS) {
          scanBufferRef.current = [];
        }

        scanBufferRef.current.push({ key: e.key, time: now });
        return;
      }

      if (e.key === "Enter") {
        const chars = scanBufferRef.current;
        scanBufferRef.current = [];

        if (chars.length < MIN_CARD_LENGTH) return;

        e.preventDefault();
        e.stopPropagation();
        handleCardScan(chars.map((item) => item.key).join(""));
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <div
      className="
        h-screen
        w-full
        bg-cover
        bg-center
        flex
        items-center
        justify-center
        relative
      "
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative bg-black/35 backdrop-blur-2xl border border-white/20 p-10 rounded-3xl text-center text-white w-[420px] shadow-2xl">
        <div className="text-6xl mb-4">🍔</div>

        {/* TAB */}
        <div className="flex mb-5 border-b border-white/30">

          <button
            onClick={() => setTab("card")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "card"
              ? "border-b-2 border-white text-white"
              : "text-white/60"
              }`}
          >
            🎫 Quẹt thẻ
          </button>

          <button
            onClick={() => setTab("qr")}
            className={`
              flex-1
              py-2
              text-sm
              font-medium
              ${tab === "qr"
                ? "border-b-2 border-white text-white"
                : "text-white/60"
              }
            `}
          >
            📷 QR
          </button>

          <button
            onClick={() => setTab("account")}
            className={`flex-1 py-2 text-sm font-medium ${tab === "account"
              ? "border-b-2 border-white text-white"
              : "text-white/60"
              }`}
          >
            🔑 Tài khoản
          </button>

          {/* Face ID disabled: QR-only flow */}
          {/* <button
            onClick={() => setTab("face")}
            className={`
              flex-1
              py-2
              text-sm
              font-medium
              ${tab === "face"
                ? "border-b-2 border-white text-white"
                : "text-white/60"
              }
            `}
          >
            😊 Face ID
          </button> */}

        </div>

        {tab === "card" && (
          <div className="mt-4 rounded-2xl bg-black/60 p-6">
            <div className="text-5xl mb-4">💳</div>
            <p className="text-lg font-semibold">Đưa thẻ vào máy đọc</p>
            <p className="text-sm text-white/70 mt-2">
              Hệ thống sẽ lấy chuỗi số đọc được làm cardId để đăng nhập.
            </p>
          </div>
        )}

        {tab === "qr" && (
          <div className="mt-4">

            <QRVerify
              onSuccess={(data) => {
                handleQrPaymentScan(data?.value);
              }}
            />

          </div>
        )}

        {tab === "account" && (
          <form
            onSubmit={handleAccountLogin}
            className="mt-4 rounded-2xl bg-black/60 p-6 text-left space-y-4"
          >
            <div>
              <label className="block text-sm text-white/80 mb-1">
                Tài khoản
              </label>
              <input
                type="text"
                autoComplete="username"
                value={account.username}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/60"
                placeholder="Email hoặc mã học sinh"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={account.password}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/60"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {accountError && (
              <p className="text-sm text-red-300">{accountError}</p>
            )}

            <button
              type="submit"
              disabled={accountLoading}
              className="w-full rounded-xl bg-white text-black font-semibold py-3 disabled:opacity-60"
            >
              {accountLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        )}

        {/* Face ID disabled: QR-only flow */}
        {/* {tab === "face" && (
          <div className="mt-4">
            <FaceVerify
              mode="face"
              onSuccess={handleFaceLoginSuccess}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
