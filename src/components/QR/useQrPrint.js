import { useRef, useState } from "react";

export function useQrPrint(html) {
  const frame = useRef(null);
  const [loaded, setLoaded] = useState("");
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const ready = !!html && loaded === html && !printing;
  const print = async () => {
    if (!ready) return;
    setPrinting(true);
    setError("");
    try {
      await frame.current.contentDocument.fonts.ready;
      frame.current.contentWindow.focus();
      frame.current.contentWindow.print();
    } catch {
      setError("Không thể mở hộp thoại in. Vui lòng thử lại.");
    } finally {
      setPrinting(false);
    }
  };
  return { frame, ready, printing, error, print,
    clearError: () => setError(""),
    onLoad: (event) => setLoaded(event.currentTarget.srcdoc),
  };
}
