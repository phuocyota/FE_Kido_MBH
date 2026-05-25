import React, { useEffect, useRef, useState } from "react";
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
export default function QRVerify({ onSuccess }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanIntervalRef = useRef<any>(null);
    const isCompletedRef = useRef(false);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("⏳ Đang khởi tạo...");

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

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                setStatus("⏳ Đang mở camera...");
                setLoading(true);
                isCompletedRef.current = false;

                stopCamera();

                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Trình duyệt không hỗ trợ mở camera");
                }

                let stream: MediaStream;

                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: getVideoConstraints(),
                    });
                } catch (cameraError) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                }

                if (!isMounted) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    await videoRef.current.play().catch(() => undefined);
                }

                if (isMounted) {
                    setLoading(false);
                    setStatus("📷 Đưa QR vào khung");
                }
            } catch (err) {
                console.error("QR camera init error:", err);

                if (isMounted) {
                    setStatus("❌ Không mở được camera");
                }
            }
        };

        init();

        return () => {
            isMounted = false;
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (loading) return;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;

        const start = () => {
            if (
                !video.videoWidth ||
                !video.videoHeight ||
                scanIntervalRef.current
            ) {
                return;
            }

            const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
            };

            canvas.width = displaySize.width;
            canvas.height = displaySize.height;

            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawQRFrame(ctx, canvas.width, canvas.height);

            scanIntervalRef.current = setInterval(() => {
                if (isCompletedRef.current) return;

                const ctx = canvas.getContext("2d")!;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawQRFrame(ctx, canvas.width, canvas.height);

                const qrData = scanQRFromVideo(video);

                if (qrData) {
                    isCompletedRef.current = true;
                    setStatus("🎫 QR detected");
                    stopCamera();

                    if (scanIntervalRef.current) {
                        clearInterval(scanIntervalRef.current);
                        scanIntervalRef.current = null;
                    }

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
            if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
                clearInterval(waitVideo);
                start();
            }
        }, 100);

        video.addEventListener("loadedmetadata", start);
        video.addEventListener("play", start);
        start();

        return () => {
            video.removeEventListener("loadedmetadata", start);
            video.removeEventListener("play", start);

            clearInterval(waitVideo);

            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
                scanIntervalRef.current = null;
            }

            stopCamera();
        };
    }, [loading, onSuccess]);

    const scanQRFromVideo = (video: HTMLVideoElement) => {
        if (!video.videoWidth || !video.videoHeight) return null;

        const tempCanvas = document.createElement("canvas");

        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        const ctx = tempCanvas.getContext("2d");

        if (!ctx) return null;

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
                Giữ mã QR trong khung và đủ ánh sáng
            </div>
        </div>
    );
}
