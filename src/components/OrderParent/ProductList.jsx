import React from "react";
import { Plus } from "lucide-react";
import { buildAssetUrl } from "../../api/client";

export default function ProductList({
  products,
  loading = false,
  error = "",
  cart,
  addToCart,
  increaseQty,
  decreaseQty,
  openNoteModal,
}) {
  const getCartItem = (id) => {
    return cart.find((x) => x.id === id);
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 pb-4 sm:px-4 sm:py-6">

      {loading && (
        <div className="py-20 text-center text-gray-500">
          Dang tai san pham...
        </div>
      )}

      {!loading && error && (
        <div className="py-20 text-center text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          Không tìm thấy sản phẩm.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">

        {products.map((item) => {
          const cartItem = getCartItem(item.id);
          const qty = cartItem?.qty || 0;
          const isSoldOut = Number(item.remain || 0) <= 0;

          return (

            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-transparent bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={buildAssetUrl(item.image)}
                  alt={item.name}
                  className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-40 md:h-44"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-gray-800 sm:text-base group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-[15px] font-bold text-blue-600">
                  {item.price.toLocaleString()}đ
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
                    Còn {item.remain}
                  </span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      disabled={isSoldOut}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 transition-transform active:scale-90 hover:scale-105 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                      aria-label={`Thêm ${item.name}`}
                    >
                      <Plus size={20} />
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-50/80 p-1 border border-indigo-100">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm transition-transform active:scale-90 hover:bg-gray-50"
                        aria-label={`Giảm ${item.name}`}
                      >
                        <span className="text-xl leading-none font-medium mb-0.5">-</span>
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold text-indigo-700">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQty(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm transition-transform active:scale-90 hover:scale-105"
                        aria-label={`Tăng ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {qty > 0 && (
                  <button
                    type="button"
                    onClick={() => openNoteModal(cartItem)}
                    className="mt-3 w-full rounded-xl bg-gray-50 px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-100"
                  >
                    {cartItem.note ? (
                      <span className="line-clamp-1 font-medium">
                        <span className="text-gray-400 mr-1">📝</span> {cartItem.note}
                      </span>
                    ) : (
                      <span className="font-semibold text-indigo-600 flex items-center gap-1">
                        <span className="text-lg leading-none">+</span> Thêm ghi chú dặn dò
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

          );

        })}

      </div>

    </div>
  );
}
