import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import React from "react";
import { faceApi } from "../../service/face";


let modelsLoaded = false;

const loadBaseModels = async () => {
    if (modelsLoaded) return;

    const MODEL_URL = "/models";

    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
};

// 🎯 VẼ KHUNG GUIDE
const drawGuideFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    isValid: boolean
) => {
    const centerX = width / 2;
    const centerY = height / 2;

    const radiusX = width * 0.22;
    const radiusY = height * 0.32;

    // 🌑 overlay tối
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);

    // 🧠 clear vùng oval (focus)
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = isValid ? 5 : 3;
    // reset mode
    ctx.globalCompositeOperation = "source-over";

    // 🎯 viền oval
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

    ctx.lineWidth = 4;
    ctx.strokeStyle = isValid ? "#00ff88" : "#ff4444";
    ctx.shadowBlur = isValid ? 20 : 0;
    ctx.shadowColor = isValid ? "#00ff88" : "transparent";
    ctx.stroke();

    // ✨ text
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";


    return {
        x: centerX - radiusX,
        y: centerY - radiusY,
        frameWidth: radiusX * 2,
        frameHeight: radiusY * 2,
    };
};

// 🎯 CHECK FACE TRONG KHUNG
const isFaceInsideFrame = (faceBox: any, frame: any) => {
    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;

    return (
        faceCenterX > frame.x &&
        faceCenterX < frame.x + frame.frameWidth &&
        faceCenterY > frame.y &&
        faceCenterY < frame.y + frame.frameHeight
    );
};
type Props = {
    onSuccess?: () => void;
};
export default function RegisterFace({ onSuccess }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("⏳ Đang khởi tạo...");
    const [name, setName] = useState("");
    const validStartRef = useRef<number | null>(null);
    const submittedRef = useRef(false);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<any>(null);
    const statusRef = useRef("");
    const statusTimeRef = useRef(0);
    const descriptorsRef = useRef<number[][]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const lostFaceSinceRef = useRef<number | null>(null);
    const isFrozenRef = useRef(false);
    const updateStatus = (newStatus: string, minDuration = 800) => {
        if (isFrozenRef.current) return; // 🔥 CHẶN TOÀN BỘ

        const now = Date.now();

        if (statusRef.current === newStatus) return;
        if (now - statusTimeRef.current < minDuration) return;

        statusRef.current = newStatus;
        statusTimeRef.current = now;
        setStatus(newStatus);
    };
    // 🚀 INIT

    const handleStartIfReady = async () => {
        if (!name.trim()) {
            setStatus("⚠️ Vui lòng nhập tên");
            return;
        }

        if (!streamRef.current) {
            isFrozenRef.current = false;

            await startCamera();
        }
    };
    // 🎥 DETECT
    useEffect(() => {
        if (loading) return;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;

        const handleLoaded = () => {
            const video = videoRef.current!;
            const canvas = canvasRef.current!;

            if (!video.videoWidth || !video.videoHeight) return;

            const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
            };

            canvas.width = displaySize.width;
            canvas.height = displaySize.height;

            faceapi.matchDimensions(canvas, displaySize);

            const lostFrameCountRef = { current: 0 };
            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGuideFrame(
                ctx,
                canvas.width,
                canvas.height,
                false
            );
            intervalRef.current = setInterval(async () => {
                if (isFrozenRef.current) return;

                if (!video || video.readyState !== 4) return;


                if (!name.trim()) {
                    updateStatus("⚠️ Vui lòng nhập tên trước");
                    return;
                }

                const detections = await faceapi
                    .detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions({
                            inputSize: 224,
                            scoreThreshold: 0.6,
                        })
                    )
                    .withFaceLandmarks();

                const resized = faceapi.resizeResults(detections, displaySize);

                const ctx = canvas.getContext("2d")!;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 👉 LUÔN vẽ frame trước
                const frame = drawGuideFrame(
                    ctx,
                    canvas.width,
                    canvas.height,
                    false
                );

                let isValid = false;

                if (resized.length > 0) {
                    lostFaceSinceRef.current = null;
                    isFrozenRef.current = false;
                    const box = resized[0].detection.box;

                    // 👉 check sau khi đã có frame
                    isValid = isFaceInsideFrame(box, frame);

                    // 👉 vẽ lại frame theo trạng thái
                    drawGuideFrame(
                        ctx,
                        canvas.width,
                        canvas.height,
                        isValid
                    );

                    if (isValid) {
                        lostFrameCountRef.current = 0;

                        if (!validStartRef.current) {
                            validStartRef.current = Date.now();
                        }

                        const duration = Date.now() - validStartRef.current;
                        const step = Math.min(5, Math.floor(duration / 300));

                        updateStatus(`⏳ Đang xác nhận ${step}/5`);

                        if (duration > 1500 && !submittedRef.current) {
                            submittedRef.current = true;
                            handleAutoSubmit();
                        }

                        const faces = await faceapi.extractFaces(video, [box]);

                    } else {
                        lostFrameCountRef.current++;

                        if (lostFrameCountRef.current > 2) {
                            updateStatus("📍 Đưa mặt vào khung");


                            validStartRef.current = null;
                            submittedRef.current = false;
                        }
                    }
                } else {
                    if (!lostFaceSinceRef.current) {
                        lostFaceSinceRef.current = Date.now();
                    }

                    // chỉ reset nếu mất mặt > 1s
                    if (Date.now() - lostFaceSinceRef.current > 1000) {
                        updateStatus("❌ Không thấy khuôn mặt");
                        validStartRef.current = null;
                        submittedRef.current = false;
                    }
                }
            }, 200);
        };

        const waitVideoReady = setInterval(() => {
            const video = videoRef.current;
            if (!video) return;

            if (video.readyState === 4) {
                clearInterval(waitVideoReady);
                handleLoaded();
            }
        }, 100);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoaded);
            clearInterval(intervalRef.current);
        };
    }, [loading]);
    const startCamera = async () => {
        try {
            setStatus("📷 Đang mở camera...");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 240 },
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setStatus("⏳ Đang tải model...");
            await loadBaseModels();

            setLoading(false);
            setStatus("✅ Sẵn sàng");
        } catch (err: any) {
            setStatus("❌ Lỗi camera: " + err.message);
        }
    };
    const stopCamera = () => {
        // stop stream
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        // clear interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    const resetAll = () => {
        // 🛑 stop camera + loop
        stopCamera();

        // 🧠 reset state logic
        validStartRef.current = null;
        submittedRef.current = false;
        descriptorsRef.current = [];
        lostFaceSinceRef.current = null;
        isFrozenRef.current = false;

        // 🧾 reset status control
        statusRef.current = "";
        statusTimeRef.current = 0;

        // 🎯 reset UI
        setStatus("👉 Nhập tên để bắt đầu");

        // ⚙️ reset flags
        setIsProcessing(false);
        setLoading(true); // 🔥 cực quan trọng để re-init detect

        // 📹 clear video
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };
    // 📸 REGISTER
    const handleAutoSubmit = async () => {
        try {
            setStatus("⏳ Đang nhận diện...");

            const video = videoRef.current!;

            await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

            const detection = await faceapi
                .detectSingleFace(
                    video,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 160,
                        scoreThreshold: 0.5,
                    })
                )
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                setStatus("❌ Không nhận diện được");
                submittedRef.current = false;
                return;
            }

            const descriptor = Array.from(detection.descriptor);

            // 🔥 CALL API
            const data = await faceApi.register(descriptor, name);

            // 👉 lưu token
            localStorage.setItem("token", data.access_token);

            setStatus("🎉 Đăng ký thành công!");

            setTimeout(async () => {
                stopCamera();

                resetAll();
                /* setTimeout(() => {
                    startCamera();
                }, 300); */

            }, 1000);
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message || // BE trả về message
                err?.response?.data ||          // fallback nếu BE trả string
                err.message ||                  // axios error
                "Lỗi không xác định";

            setStatus("❌ " + errorMsg);

            setTimeout(() => {
                setStatus("👉 Đặt khuôn mặt vào khung");
                submittedRef.current = false;
            }, 2000);
        }
    };
    useEffect(() => {
        const t = setTimeout(() => {
            if (!name.trim()) {
                resetAll();
            }
        }, 300);

        return () => clearTimeout(t);
    }, [name]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            {/* CARD */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center relative">

                {/* TITLE */}
                <h1 className="text-xl font-bold mb-4">
                    📸 Đăng ký khuôn mặt
                </h1>

                {/* CAMERA */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black">
                    {!streamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white z-10">
                            👉 Nhập tên và bấm bắt đầu
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* OVERLAY tối */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* KHUNG OVAL */}


                    {/* ICON trạng thái */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        Quét khuôn mặt
                    </div>
                </div>

                {/* STATUS */}
                <div className="mt-4 text-sm font-medium text-gray-700 min-h-[24px]">
                    {status}
                </div>

                {/* INPUT */}
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleStartIfReady}
                    placeholder="Nhập tên..."
                    className="mt-3 border p-3 rounded-lg w-full 
             text-gray-800 bg-white
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-400"
                />


            </div>
        </div>
    );
}