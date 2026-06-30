import React from "react";
import {
  ChevronRight,
  ShoppingCart,
  Trash2,
} from "lucide-react";

export default function BottomCheckout({
  cart,
  total,
  onCheckout,
  onClearCart,
}) {
  if (cart.length === 0) return null;

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="sticky bottom-0 z-[60] mt-auto px-2 pt-2 sm:px-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-t-2xl border border-b-0 border-gray-200 bg-white px-3 py-2.5 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-300 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white sm:h-14 sm:w-14">
              <ShoppingCart size={22} />
            </div>

            <div className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white sm:h-6 sm:min-w-[24px] sm:text-xs">
              {totalQuantity}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 sm:text-sm">
              Đã chọn
            </p>

            <h3 className="text-base font-bold text-gray-800 sm:text-lg">
              {total.toLocaleString()} đ
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onClearCart}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-95 sm:h-12 sm:w-12"
            aria-label="Xóa giỏ hàng"
            title="Xóa giỏ hàng"
          >
            <Trash2 size={18} />
          </button>

          <button
            type="button"
            onClick={onCheckout}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
          >
            Thanh toán
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
