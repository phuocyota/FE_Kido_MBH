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
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
            >

              <div className="relative overflow-hidden">

                <img
                  src={buildAssetUrl(item.image)}
                  alt={item.name}
                  className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-36 md:h-40"
                />

              </div>

              <div className="p-2.5 sm:p-3">

                <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800 sm:text-base">

                  {item.name}

                </h3>

                <p className="mt-1 text-sm font-bold text-red-600 sm:text-base">

                  {item.price.toLocaleString()} đ

                </p>

                <div className="mt-3 flex items-center justify-between gap-2">

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">

                    Còn {item.remain}

                  </span>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      disabled={isSoldOut}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:h-10 sm:w-10"
                      aria-label={`Thêm ${item.name}`}
                    >
                      <Plus size={18} />
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm transition hover:bg-indigo-100"
                        aria-label={`Giảm ${item.name}`}
                      >
                        <span className="text-lg leading-none">-</span>
                      </button>

                      <span className="min-w-5 text-center text-sm font-bold text-indigo-700">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQty(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
                        aria-label={`Tăng ${item.name}`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  )}

                </div>

                {qty > 0 && (
                  <button
                    type="button"
                    onClick={() => openNoteModal(cartItem)}
                    className="mt-2 w-full rounded-lg bg-slate-50 px-2.5 py-2 text-left text-xs text-gray-600 transition hover:bg-slate-100"
                  >
                    {cartItem.note ? (
                      <span className="line-clamp-1">
                        Ghi chú: {cartItem.note}
                      </span>
                    ) : (
                      <span className="font-medium text-indigo-600">
                        Thêm ghi chú
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
