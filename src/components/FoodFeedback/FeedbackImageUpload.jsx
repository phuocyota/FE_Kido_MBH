import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ImagePreview({ file, index, onRemove }) {
  const imageRef = useRef(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200">
      <img ref={imageRef} alt={`Minh chứng ${index + 1}: ${file.name}`} className="aspect-square w-full object-cover" />
      <button type="button" aria-label={`Xóa ảnh ${index + 1}`} onClick={onRemove} className="absolute right-1 top-1 rounded-full bg-black/75 p-1.5 text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-white"><X size={16} /></button>
    </div>
  );
}

export default function FeedbackImageUpload({ images, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const addImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (images.length + files.length > 3) {
      setError("Bạn chỉ được tải lên tối đa 3 hình ảnh.");
      return;
    }
    if (files.some((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError("Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB mỗi ảnh.");
      return;
    }
    setError("");
    onChange([...images, ...files]);
  };
  return (
    <div>
      <p id="feedback-images-label" className="mb-1.5 text-sm font-semibold text-slate-600">Hình ảnh minh chứng</p>
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} multiple onChange={addImages} className="hidden" aria-label="Chọn hình ảnh minh chứng" />
      {images.length > 0 && <div className="mb-3 grid grid-cols-3 gap-3">{images.map((file, index) => <ImagePreview key={`${file.name}-${file.lastModified}-${index}`} file={file} index={index} onRemove={() => { onChange(images.filter((_, i) => i !== index)); setError(""); }} />)}</div>}
      <button type="button" onClick={() => inputRef.current?.click()} disabled={images.length >= 3} aria-labelledby="feedback-images-label" aria-describedby="feedback-images-help" className="flex min-h-20 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 px-3 py-3 text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
        <ImagePlus size={21} className="text-slate-400" />
        <span className="text-xs">Tải lên tối đa 3 hình ảnh {images.length > 0 && `(${images.length}/3)`}</span>
      </button>
      <p id="feedback-images-help" className="mt-1.5 text-xs text-slate-400">JPG, PNG, WebP · Tối đa 5 MB/ảnh</p>
      {error && <p role="alert" className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
