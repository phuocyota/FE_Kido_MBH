import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

export default function StockProductPicker({ onSelect, loadProducts }) {
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const searchDelayRef = useRef(0);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updatePosition = (anchor) => {
    const input = anchor?.getBoundingClientRect ? anchor : inputRef.current;
    const rect = input?.getBoundingClientRect();
    if (!rect) return;
    const margin = 8;
    const below = window.innerHeight - rect.bottom - margin - 4;
    const above = rect.top - margin - 4;
    const upwards = below < 240 && above > below;
    const maxHeight = Math.max(0, Math.min(360, upwards ? above : below));
    const width = Math.min(
      Math.max(rect.width, 480),
      window.innerWidth - margin * 2,
    );
    setPosition({
      position: "fixed",
      width,
      maxHeight,
      left: Math.max(
        margin,
        Math.min(rect.left, window.innerWidth - width - margin),
      ),
      ...(upwards
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (
        !inputRef.current?.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await loadProducts(query);
        if (!cancelled) {
          setProducts(data);
          setActiveIndex(0);
        }
      } catch {
        if (!cancelled) setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, searchDelayRef.current);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, query, retry, loadProducts]);

  const openPicker = (event) => {
    searchDelayRef.current = 0;
    // autoFocus can fire before React attaches inputRef. Use the event target.
    updatePosition(event.currentTarget);
    setOpen(true);
  };

  const chooseProduct = (product) => {
    setOpen(false);
    onSelect(product);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      updatePosition();
      if (!open) searchDelayRef.current = 0;
      setOpen(true);
      const next = Math.max(
        0,
        Math.min(
          products.length - 1,
          activeIndex + (event.key === "ArrowDown" ? 1 : -1),
        ),
      );
      setActiveIndex(next);
      panelRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (!loading && !error && products[activeIndex])
        chooseProduct(products[activeIndex]);
    }
  };

  return (
    <div className="relative w-full">
      <Search
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        ref={inputRef}
        autoFocus
        type="text"
        role="combobox"
        aria-label="Tìm sản phẩm theo mã hoặc tên"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          open && !loading && !error && products[activeIndex]
            ? `${listId}-${activeIndex}`
            : undefined
        }
        placeholder="Tìm theo mã hoặc tên sản phẩm..."
        value={query}
        onFocus={openPicker}
        onClick={openPicker}
        onChange={(event) => {
          searchDelayRef.current = 50;
          setQuery(event.target.value);
          setLoading(true);
          setOpen(true);
          updatePosition();
        }}
        onKeyDown={handleKeyDown}
        className="h-11 w-full rounded-lg border border-blue-300 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={position}
            className="z-[100] overflow-y-auto rounded-xl border border-blue-200 bg-white shadow-xl"
          >
            <div className="sticky top-0 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-normal text-slate-500">
              Tìm theo mã hoặc tên · ↑ ↓ di chuyển · Enter chọn · Esc đóng
            </div>
            <div
              id={listId}
              role="listbox"
              aria-label="Sản phẩm"
              aria-busy={loading}
            >
              {loading ? (
                <p
                  role="status"
                  className="p-4 text-sm font-normal text-slate-500"
                >
                  Đang tìm sản phẩm...
                </p>
              ) : error ? (
                <div
                  role="alert"
                  className="p-4 text-sm font-normal text-red-600"
                >
                  {error}{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      searchDelayRef.current = 0;
                      setLoading(true);
                      setRetry((value) => value + 1);
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              ) : products.length === 0 ? (
                <p className="p-4 text-sm font-normal text-slate-500">
                  Không tìm thấy sản phẩm
                </p>
              ) : (
                products.map((product, index) => (
                  <button
                    id={`${listId}-${index}`}
                    key={product.id}
                    data-index={index}
                    role="option"
                    aria-selected={activeIndex === index}
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => chooseProduct(product)}
                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 ${activeIndex === index ? "bg-blue-50" : "hover:bg-blue-50"}`}
                  >
                    <div className="whitespace-normal break-words text-sm font-semibold leading-6 text-slate-900">
                      {product.name}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-normal text-slate-500">
                      <span>Mã: {product.code || "—"}</span>
                      <span>ĐVT: {product.unit || "Cái"}</span>
                      <span className="font-medium text-blue-700">
                        Tồn kho hiện tại: {product.remain == null
                          ? "—"
                          : Number(product.remain).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
