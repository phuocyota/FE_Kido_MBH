import { useEffect, useRef, useState } from "react";
// Face verification disabled: QR-only flow.
// import * as faceapi from "face-api.js";
// import { faceApi } from "../../service/face";
import jsQR from "jsqr";

import React from "react";
type Props = {
    onSuccess?: (user: any) => void;
    mode?: "qr";
};
// Face guide disabled: QR-only flow.
// const drawGuideFrame = (ctx, width, height, isValid) => { ... };
const drawQRFrame = (ctx, width, height) => {
    const size = Math.min(width, height) * 0.6;

    const x = (width - size) / 2;
    const y = (height - size) / 2;

    // overlay tối
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);

    // lỗ trong suốt
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(x, y, size, size);

    ctx.globalCompositeOperation = "source-over";

    // khung QR
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, size, size);

    // text
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
        "Đưa mã QR vào khung",
        width / 2,
        y - 20
    );
};
// Face frame check disabled: QR-only flow.
// const isFaceInsideFrame = (faceBox: any, frame) => { ... };
export default function FaceVerify({ onSuccess, mode = "qr" }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("⏳ Đang khởi tạo...");
    // const [isLoggingIn, setIsLoggingIn] = useState(false);

    // const loggedRef = useRef(false);
    const getVideoConstraints = () => {
        return {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
        };
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
    };

    // 🚀 LOAD MODEL + CAMERA
    useEffect(() => {
        let stream: MediaStream;

        const init = async () => {
            try {
                setStatus("⏳ Đang mở camera...");
                setLoading(true);

                // Face model loading disabled: QR-only flow.
                // const MODEL_URL = "/models";
                // await Promise.all([...]);

                // 🔥 stop camera cũ trước
                stopCamera();

                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: getVideoConstraints(),
                    });
                } catch (cameraError) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    await videoRef.current.play();
                }

                setLoading(false);

                setStatus("📷 Đưa QR vào khung");
            } catch (err) {
                console.error(err);
                setStatus("❌ Không mở được camera");
            }
        };

        init();

        return () => {
            stopCamera();
        };
    }, [mode]);

    // 🎥 DETECT + LOGIN
    useEffect(() => {
        if (loading) return;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;

        let interval: any;

        const start = () => {
            const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
            };

            canvas.width = displaySize.width;
            canvas.height = displaySize.height;

            // faceapi.matchDimensions(canvas, displaySize);
            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            interval = setInterval(async () => {
                const ctx = canvas.getContext("2d")!;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // ✅ QR thì vẽ khung QR
                drawQRFrame(
                    ctx,
                    canvas.width,
                    canvas.height
                );

                const qrData = scanQRFromVideo(video);

                if (qrData) {
                    setStatus("🎫 QR detected");

                    stopCamera();
                    clearInterval(interval);

                    onSuccess?.({
                        type: "qr",
                        value: qrData,
                    });

                    return;
                }

                setStatus("📷 Đưa QR vào khung");
            }, 300);
        };

        const waitVideo = setInterval(() => {
            if (video.readyState >= 2) {
                clearInterval(waitVideo);
                start();
            }
        }, 100);

        return () => {
            clearInterval(waitVideo);
            clearInterval(interval);
        };
    }, [loading, mode]);
    const scanQRFromVideo = (video: HTMLVideoElement) => {
        if (!video.videoWidth || !video.videoHeight) return null;

        const tempCanvas = document.createElement("canvas");

        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        const ctx = tempCanvas.getContext("2d");

        if (!ctx) return null;

        // 🔥 copy frame camera
        ctx.drawImage(
            video,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
        );

        const imageData = ctx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
        );

        const code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
        );

        return code?.data || null;
    };
    return (
        <div
            className="
        flex flex-col items-center 
        px-4 py-6

        bg-black text-white
        "
        >
            {/* TITLE */}
            <p className="text-white/80 mb-6">
                Đưa mã QR vào camera để tiếp tục
            </p>

            {/* CAMERA WRAPPER */}
            <div
                className="
            relative 

            w-full 
            max-w-[500px]

            aspect-[4/3] sm:aspect-[4/3] lg:h-[350px] lg:aspect-auto
            "
            >
                {/* VIDEO */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="
                    rounded-xl shadow-lg 
                    w-full h-full 
                    object-cover
                "
                />

                {/* CANVAS */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                />
            </div>

            {/* STATUS */}
            <div
                className="
            mt-4 
            text-sm sm:text-lg 
            font-medium 
            text-center
            "
            >
                {status}
            </div>

            {/* TIP (mobile only) */}
            <div className="mt-3 text-xs text-gray-400 text-center sm:hidden">
                Giữ điện thoại ngang tầm mặt và đủ ánh sáng
            </div>
        </div>
    );
}
