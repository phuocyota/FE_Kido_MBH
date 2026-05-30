import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import jsQR from "jsqr";

type Props = {
    onSuccess?: (data: { type: "qr"; value: string }) => void;
};

let cachedStream: MediaStream | null = null;
let cachedFacingMode: "environment" | "user" | null = null;

const isStreamActive = (stream: MediaStream | null) =>
    Boolean(stream?.getVideoTracks().some((track) => track.readyState === "live"));

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
    const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastStatusRef = useRef("");
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("⏳ Đang khởi tạo...");
    const [cameraError, setCameraError] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">(
        "environment"
    );

    const updateStatus = useCallback((nextStatus: string) => {
        if (lastStatusRef.current === nextStatus) return;

        lastStatusRef.current = nextStatus;
        setStatus(nextStatus);
    }, []);

    const detachCamera = useCallback(() => {
        const video = videoRef.current;

        if (video && video.srcObject) {
            video.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            setCameraError(false);
            updateStatus("⏳ Đang mở camera...");
            setLoading(true);
            detachCamera();

            let stream: MediaStream;

            if (isStreamActive(cachedStream) && cachedFacingMode === facingMode) {
                stream = cachedStream as MediaStream;
            } else {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { ideal: facingMode },
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                        },
                    });
                } catch (cameraError) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                }

                cachedStream = stream;
                cachedFacingMode = facingMode;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setLoading(false);
            updateStatus("📷 Đưa QR vào khung");
        } catch (err) {
            console.error(err);
            setCameraError(true);
            setLoading(false);
            updateStatus("Kiểm tra quyền camera");
        }
    }, [detachCamera, facingMode, updateStatus]);

    const switchCamera = () => {
        setFacingMode((current) =>
            current === "environment" ? "user" : "environment"
        );
    };

    const scanQRFromVideo = useCallback((video: HTMLVideoElement) => {
        if (!video.videoWidth || !video.videoHeight) return null;

        if (!scanCanvasRef.current) {
            scanCanvasRef.current = document.createElement("canvas");
        }

        const tempCanvas = scanCanvasRef.current;
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
    }, []);

    useEffect(() => {
        startCamera();

        return () => {
            detachCamera();
        };
    }, [detachCamera, startCamera]);

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
                    updateStatus("🎫 QR detected");
                    detachCamera();

                    if (interval) {
                        clearInterval(interval);
                    }

                    onSuccess?.({
                        type: "qr",
                        value: qrData,
                    });
                } else {
                    updateStatus("📷 Đưa QR vào khung");
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
    }, [detachCamera, loading, onSuccess, scanQRFromVideo, updateStatus]);

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

                <button
                    type="button"
                    onClick={switchCamera}
                    className="
                        absolute right-3 top-3
                        flex h-11 w-11 items-center justify-center
                        rounded-full
                        bg-black/60 text-white
                        shadow-lg backdrop-blur
                        transition
                        hover:bg-black/75
                        active:scale-95
                    "
                    aria-label="Xoay camera"
                    title="Xoay camera"
                >
                    <RefreshCw size={20} />
                </button>
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
