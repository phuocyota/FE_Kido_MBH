import React, { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Props = {
    onSuccess?: (data: { type: "qr"; value: string }) => void;
};

const drawQRFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    const size = Math.min(width, height) * 0.6;
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(x, y, size, size);

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, size, size);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Đưa mã QR vào khung", width / 2, y - 20);
};

export default function QRVerify({ onSuccess }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("⏳ Đang khởi tạo...");
    const [cameraError, setCameraError] = useState(false);

    const stopCamera = () => {
        const video = videoRef.current;

        if (video && video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
    };

    const startCamera = useCallback(async () => {
        try {
            setCameraError(false);
            setStatus("⏳ Đang mở camera...");
            setLoading(true);
            stopCamera();

            let stream: MediaStream;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
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
            setCameraError(true);
            setLoading(false);
            setStatus("Kiểm tra quyền camera");
        }
    }, []);

    const scanQRFromVideo = (video: HTMLVideoElement) => {
        if (!video.videoWidth || !video.videoHeight) return null;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return null;

        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        const imageData = ctx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
        );

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        return code?.data || null;
    };

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, [startCamera]);

    useEffect(() => {
        if (loading) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        let interval: ReturnType<typeof setInterval> | undefined;

        const start = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            interval = setInterval(() => {
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawQRFrame(ctx, canvas.width, canvas.height);

                const qrData = scanQRFromVideo(video);

                if (qrData) {
                    setStatus("🎫 QR detected");
                    stopCamera();

                    if (interval) {
                        clearInterval(interval);
                    }

                    onSuccess?.({
                        type: "qr",
                        value: qrData,
                    });
                } else {
                    setStatus("📷 Đưa QR vào khung");
                }
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

            if (interval) {
                clearInterval(interval);
            }
        };
    }, [loading, onSuccess]);

    return (
        <div
            className="
                flex flex-col items-center
                px-4 py-6
                bg-black text-white
            "
        >
            <p className="text-white/80 mb-6">
                Đưa mã QR vào camera để tiếp tục
            </p>

            <div
                className="
                    relative
                    w-full
                    max-w-[500px]
                    aspect-[4/3] sm:aspect-[4/3] lg:h-[350px] lg:aspect-auto
                "
            >
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

                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                />
            </div>

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

            {cameraError && (
                <button
                    type="button"
                    onClick={startCamera}
                    className="
                        mt-4
                        rounded-lg
                        bg-white
                        px-4 py-2
                        text-sm font-semibold
                        text-black
                        hover:bg-gray-100
                        active:bg-gray-200
                        transition
                    "
                >
                    Bật camera
                </button>
            )}

            <div className="mt-3 text-xs text-gray-400 text-center sm:hidden">
                {cameraError
                    ? "Nếu trình duyệt đã chặn, hãy cấp quyền camera trong thanh địa chỉ rồi bấm lại."
                    : "Giữ điện thoại ngang tầm mã QR và đủ ánh sáng"}
            </div>
        </div>
    );
}
