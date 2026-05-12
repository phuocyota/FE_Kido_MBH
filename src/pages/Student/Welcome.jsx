import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/anh-can-tin-so-2.png";
import avatar1 from "../../assets/avatar.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";

import { useState } from "react";
import FaceVerify from "../../components/FaceId/FaceVerify";

export default function Welcome() {
  const [student, setStudent] = useState();
  const navigate = useNavigate();
  const [tab, setTab] = useState("qr");
  useEffect(() => {
    let buffer = "";
    let timeout;

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
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
    };
  }, []);

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

  //  {name: "May mắn", balance: 5000, avatar: avatar1, school: "THPT Nguyễn Trãi",},

  const handleScan = (data) => {
    if (!data || !/^\d+$/.test(data)) {
      alert("QR không hợp lệ");
      return;
    }

    const randomStudent =
      studentsMock[Math.floor(Math.random() * studentsMock.length)];

    const studentData = {
      ...randomStudent,
      cardId: data,
    };

    const amount = Number(data);

    // 💰 QR tiền
    if (amount <= 20000) {
      navigate("/order", {
        state: {
          type: "qr",
          amount,
        },
      });

      return;
    }

    // 🎓 thẻ học sinh
    navigate("/order", {
      state: {
        type: "student",
        student: studentData,
      },
    });
  };




  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40"></div>


      {/* FORM */}
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
                // 🎫 QR
                if (data?.type === "qr") {
                  handleScan(data.value);
                  return;
                }

                // 😊 FACE
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