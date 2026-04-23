import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/anh-can-tin-so-2.png";
import scanner from "../../assets/dau-doc-the-tu.jpeg";
import avatar1 from "../../assets/avatar.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";

import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

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

  const handleScan = (data) => {
    // console.log("📌 Scan:", data);

    // 👉 nếu là QR (ví dụ: chỉ có số tiền nhỏ)
    if (Number(data) <= 20000) {
      // 👉 QR mode
      localStorage.setItem("amount", data);
      localStorage.removeItem("student"); // 🔥 XÓA student cũ
    } else {
      // 👉 thẻ học sinh
      const randomStudent =
        studentsMock[Math.floor(Math.random() * studentsMock.length)];

      const student = {
        ...randomStudent,
        cardId: data,
      };

      localStorage.setItem("student", JSON.stringify(student));
      localStorage.removeItem("amount");
    }

    navigate("/order");
  };

  // quét mã QR
  const [showQR, setShowQR] = useState(false);
  const [qrInstance, setQrInstance] = useState(null);

  const startQRScan = async () => {
    setShowQR(true);

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        alert("❌ Không tìm thấy camera");
        return;
      }

      // 👉 ưu tiên camera sau
      const backCamera =
        devices.find((d) =>
          d.label.toLowerCase().includes("back")
        ) || devices[0];

      const qr = new Html5Qrcode("qr-reader");
      setQrInstance(qr);

      await qr.start(
  backCamera.id,
  {
    fps: 20,
    qrbox: { width: 280, height: 280 },

    // 🔥 QUAN TRỌNG
    disableFlip: false,
    aspectRatio: 1.777,

    // 👇 thêm cái này
    // formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
  },
        (decodedText) => {
          handleScan(decodedText);

          qr.stop().then(() => {
            setShowQR(false);
          });
        },
        () => { }
      );

      // 🔥 FIX ĐEN (rất quan trọng)
      setTimeout(() => {
        const region = document.querySelector("#qr-reader__scan_region");
        if (region) {
          region.style.background = "transparent";
        }
      }, 300);

    } catch (err) {
      console.error("❌ CAMERA ERROR:", err);
      alert("Không mở được camera");
    }
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

        {/* ✅ BUTTON QR (thêm đúng yêu cầu) */}
        <button
          onClick={startQRScan}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold"
        >
          📷 Quét mã QR để bắt đầu đặt món
        </button>

        {/* ✅ CAMERA QR */}
        {showQR && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">

    {/* TITLE */}
    <p className="text-white text-lg mb-5 font-semibold tracking-wide">
      📷 Đưa mã QR vào khung
    </p>

    {/* CAMERA WRAPPER */}
    <div className="relative w-[320px] h-[320px]">

      {/* CAMERA */}
      <div
        id="qr-reader"
        className="w-full h-full rounded-2xl overflow-hidden bg-black"
      />

      {/* OVERLAY TỐI XUNG QUANH */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/10 rounded-2xl" />

        {/* LỖ TRONG SUỐT Ở GIỮA */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[260px] h-[260px] border-2 border-transparent rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
        </div>
      </div>

      {/* KHUNG SCAN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[260px] h-[260px] border-4 border-green-400 rounded-xl" />
      </div>

      {/* LINE SCAN */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[260px] h-1 bg-green-400 animate-scan" />

    </div>

    {/* BUTTON */}
    <button
      onClick={async () => {
        if (qrInstance) await qrInstance.stop();
        setShowQR(false);
      }}
      className="mt-6 bg-red-500 hover:bg-red-600 transition px-6 py-2 rounded-xl text-white font-semibold"
    >
      ❌ Tắt camera
    </button>

  </div>
)}

      </div>
    </div>
  );
}