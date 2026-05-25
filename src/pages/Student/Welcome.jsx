import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../../assets/anh-can-tin-so-2.png";

import QRVerify from "../../components/FaceId/QRVerify";
import { loginByCard } from "../../api/auth";

export default function Welcome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("card");
  const scanInFlightRef = useRef(false);
  const qrInFlightRef = useRef(false);
  const scanBufferRef = useRef([]);

  const saveStudentSession = (authData) => {
  sessionStorage.setItem(
    "studentAccessToken",
    authData.accessToken
  );

  sessionStorage.setItem(
    "studentUserId",
    authData.userId
  );

  sessionStorage.setItem(
    "studentUserType",
    authData.userType
  );

  sessionStorage.setItem(
    "studentDeviceId",
    authData.deviceId
  );
};

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

      if (!authData?.accessToken) {
        throw new Error("Dang nhap the thanh cong nhung thieu accessToken");
      }

      saveStudentSession(authData);

      const student = {
        id: authData.userId,
        cardId,
        userType: authData.userType,
        name: authData.studentFullName || authData.fullName,
        avatar: authData.avatar,
        school: authData.school,
        class: authData.class,
        balance: authData.walletBalance,
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
    const cardId = normalizeCardId(value);

    if (!cardId) {
      alert("QR không hợp lệ");
      return;
    }

    if (qrInFlightRef.current) return;

    try {
      qrInFlightRef.current = true;
      const authData = await loginByCard(cardId);

      if (!authData?.accessToken) {
        throw new Error("Dang nhap QR thanh cong nhung thieu accessToken");
      }

saveStudentSession(authData);
      const student = {
        id: authData.userId,
        cardId,
        userType: authData.userType,
        name: authData.studentFullName || authData.fullName,
        avatar: authData.avatar,
        school: authData.school,
        class: authData.class,
        balance: authData.walletBalance,
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

      <div className="relative bg-blue/10 backdrop-blur-2xl border border-blue20 p-10 rounded-3xl text-center text-white w-[420px] shadow-2xl">
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
