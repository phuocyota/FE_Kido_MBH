 

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../../assets/anh-can-tin-so-2.png";

import avatar1 from "../../assets/avatar.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";

import FaceVerify from "../../components/FaceId/FaceVerify";

// ✅ IMPORT API
import { loginStudent } from "../../api/student";

export default function Welcome() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("qr");

  const [student, setStudent] = useState(null);

  // ================= MOCK STUDENT =================
  const studentsMock = [
    {
      name: "Nguyễn Văn A",
      balance: 50000,
      avatar: avatar1,
      school: "THPT Nguyễn Trãi",
      class: "12A1",
    },
    {
      name: "Trần Thị B",
      balance: 50000,
      avatar: avatar2,
      school: "THPT Lê Quý Đôn",
      class: "11A2",
    },
    {
      name: "Lê Văn C",
      balance: 50000,
      avatar: avatar3,
      school: "THPT Trần Hưng Đạo",
      class: "10A3",
    },
    {
      name: "Phạm Thị D",
      balance: 50000,
      avatar: avatar4,
      school: "THPT Gia Định",
      class: "12A4",
    },
  ];

  // ================= QUÉT NFC / QR =================
  useEffect(() => {

    let buffer = "";

    let timeout;

    const handleKeyDown = (e) => {

      // nhập số
      if (e.key >= "0" && e.key <= "9") {

        buffer += e.key;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          buffer = "";
        }, 500);
      }

      // enter = scan xong
      if (e.key === "Enter") {

        if (buffer.length > 0) {

          handleScan(buffer);

          buffer = "";
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, []);

  // ================= HANDLE SCAN =================
  const handleScan = async (data) => {

  console.log("SCAN:", data);

  if (!data || !/^\d+$/.test(data)) {
    alert("❌ QR không hợp lệ");
    return;
  }

  localStorage.removeItem("student");
  localStorage.removeItem("amount");
  localStorage.removeItem("token");

  const isQRMoney =
    data === "5000" ||
    data === "10000";

  let user = {};

  try {

    const res = await loginStudent(data);

    console.log("LOGIN SUCCESS:", res);

    user = res?.data || {};

  } catch (apiError) {

    console.error("API ERROR:", apiError);

    // QR vẫn cho vào menu
    if (!isQRMoney) {

      alert("❌ Đăng nhập thất bại");

      return;
    }
  }

  const studentData = {

    cardId: data,

    id:
      user.userId ||
      `QR_${data}`,

    name:
      user.fullName ||
      `QR ${data}`,

    avatar:
      user.avatar
        ? `https://be.kidocanteen.kidoedu.vn/${user.avatar}`
        : avatar1,

    balance:
      isQRMoney
        ? Number(data)
        : Number(user.walletBalance || 0),

    school:
      user.school ||
      "KIDO School",

    class:
      user.class ||
      "N/A",

    accessToken:
      user.accessToken || "",

    isQR: isQRMoney,
  };

  localStorage.setItem(
    "student",
    JSON.stringify(studentData)
  );

  localStorage.setItem(
    "accessToken",
    user.accessToken || ""
  );

  if (isQRMoney) {

    localStorage.setItem(
      "amount",
      String(data)
    );
  }

  navigate("/order", {
    replace: true,
    state: {
      type: "student",
      student: studentData,
      amount:
        isQRMoney
          ? Number(data)
          : null,
    },
  });
};
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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* FORM */}
      <div
        className="
          relative
          bg-blue/10
          backdrop-blur-2xl
          border
          border-blue20
          p-10
          rounded-3xl
          text-center
          text-white
          w-[420px]
          shadow-2xl
        "
      >

        <div className="text-6xl mb-4">
          🍔
        </div>

        {/* TAB */}
        <div className="flex mb-5 border-b border-white/30">

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
            🎫 Scan QR / NFC card
          </button>

          <button
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
          </button>

        </div>

        {/* FACE / QR */}
        {(tab === "face" || tab === "qr") && (

          <div className="mt-4">

            <FaceVerify
              mode={tab}

              onSuccess={(data) => {

                // QR
                if (data?.type === "qr") {

                  handleScan(data.value);

                  return;
                }

                // FACE
                navigate("/order", {
                  replace: true,
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