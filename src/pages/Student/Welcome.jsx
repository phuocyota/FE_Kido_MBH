import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/anh-can-tin-so-2.png";
import scanner from "../../assets/dau-doc-the-tu.jpeg";
import avatar1 from "../../assets/avatar.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";

export default function Welcome() {
  const navigate = useNavigate();

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
  },
  {
    name: "Trần Thị B",
    balance: 50000,
    avatar: avatar2,
  },
  {
    name: "Lê Văn C",
    balance: 50000,
    avatar: avatar3,
  },
  {
    name: "Phạm Thị D",
    balance: 50000,
    avatar: avatar4,
  },
];

 const handleScan = (cardId) => {
  console.log("📌 Card:", cardId);

  // 👉 random 1 user
  const randomStudent =
    studentsMock[Math.floor(Math.random() * studentsMock.length)];

  const student = {
    ...randomStudent,
    cardId: cardId, // 👉 vẫn lưu card thật
  };

  localStorage.setItem("student", JSON.stringify(student));

  navigate("/order");
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

        <h1 className="text-3xl font-bold mb-2">
          Căn Tin Số
        </h1>

        <p className="text-white/80 mb-6">
          Vui lòng quét thẻ học sinh để bắt đầu đặt món
        </p>

        <div className="flex justify-center">
          <img
            src={scanner}
            alt="scan"
            className="w-40 h-40 object-contain rounded-xl shadow-lg border border-white/20"
          />
        </div>

        <p className="mt-4 text-sm text-white/60">
          Đưa thẻ vào thiết bị để tiếp tục
        </p>
      </div>
    </div>
  );
}