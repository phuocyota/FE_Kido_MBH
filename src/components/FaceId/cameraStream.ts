export type CameraFacingMode = "environment" | "user";

let cachedStream: MediaStream | null = null;
let cachedFacingMode: CameraFacingMode | null = null;
let pendingStreamPromise: Promise<MediaStream> | null = null;
let pendingFacingMode: CameraFacingMode | null = null;

export const isStreamActive = (stream: MediaStream | null) =>
    Boolean(stream?.getVideoTracks().some((track) => track.readyState === "live"));

const requestCameraStream = async (facingMode: CameraFacingMode) => {
    try {
        return await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: facingMode },
                width: { ideal: 640 },
                height: { ideal: 480 },
            },
        });
    } catch {
        return navigator.mediaDevices.getUserMedia({
            video: true,
        });
    }
};

export const getCameraStream = async (facingMode: CameraFacingMode) => {
    if (isStreamActive(cachedStream) && cachedFacingMode === facingMode) {
        return cachedStream as MediaStream;
    }

    if (pendingStreamPromise && pendingFacingMode === facingMode) {
        return pendingStreamPromise;
    }

    pendingFacingMode = facingMode;
    pendingStreamPromise = requestCameraStream(facingMode)
        .then((stream) => {
            cachedStream = stream;
            cachedFacingMode = facingMode;
            return stream;
        })
        .finally(() => {
            pendingStreamPromise = null;
            pendingFacingMode = null;
        });

    return pendingStreamPromise;
};

export const warmCameraStream = (facingMode: CameraFacingMode = "environment") => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    if (isStreamActive(cachedStream) && cachedFacingMode === facingMode) return;
    if (pendingStreamPromise && pendingFacingMode === facingMode) return;

    getCameraStream(facingMode).catch(() => {
        // The visible QR component will show the actionable camera error.
    });
};
