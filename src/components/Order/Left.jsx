import React from "react";
import banhmi from "../../assets/banhmi.jpg";
import { ShoppingCart } from "lucide-react";
import bg_left from "../../assets/left_order.png";

export default function Left({
  categories,
  activeCategory,
  setActiveCategory,
  products,
  addToCart,
  amount,        // 👈 thêm
  remaining,     // 👈 thêm
}) {
  return (
    <div className="w-[60%] bg-white rounded-xl m-3 shadow flex flex-col p-4">

      {/* CATEGORY */}
      <div className="p-3 flex gap-2 border-b border-gray-400">
        <div className="flex items-center gap-2 overflow-hidden w-[70%]">

          {/* NÚT SCROLL TRÁI */}
          <button
            onClick={() => {
              document.getElementById("category-scroll").scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className="bg-gray-200 px-2 py-1 rounded-lg cursor-pointer"
          >
            ◀
          </button>

          {/* CATEGORY LIST */}
          <div
            id="category-scroll"
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer ${activeCategory === c
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* NÚT SCROLL PHẢI */}
          <button
            onClick={() => {
              document.getElementById("category-scroll").scrollBy({
                left: 200,
                behavior: "smooth",
              });
            }}
            className="bg-gray-200 px-2 py-1 rounded-lg cursor-pointer"
          >
            ▶
          </button>
        </div>

        {/* SEARCH INPUT */}
        <input
          placeholder="Tìm món..."
          className="ml-auto px-4 py-2 rounded-xl w-[250px] shadow border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* PRODUCTS */}
      <div className="relative flex-1 overflow-hidden min-h-0">

        {/* NỀN TRẮNG */}
        <div className="absolute inset-0 bg-white" />

        {/* BG LEFT */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `url(${bg_left})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px"
          }}
        />

        {/* PRODUCTS */}
        <div className="relative z-20 p-2 grid grid-cols-4 gap-4 h-full overflow-y-auto auto-rows-[minmax(140px,auto)]">
          {products.map((item) => (
            <div
  key={item.id}
  onClick={() => {
    if (!amount || item.price <= remaining) {
      addToCart(item);
    } else {
      alert("❌ Bạn không đủ tiền để thêm món này vào giỏ");
    }
  }}
  className={`bg-white rounded-xl border border-gray-300 transition overflow-hidden flex flex-col
  ${
    amount && item.price > remaining
      ? "opacity-40 pointer-events-none"
      : "hover:shadow-md cursor-pointer"
  }`}
>
   
  {/* IMAGE */}
  <div className="w-full h-38 overflow-hidden">
    <img
      src={item.image}
      className="w-full h-full object-cover"
    />
  </div>

  {/* INFO */}
  <div className="p-2 flex flex-col gap-1">
    <p className="text-sm font-semibold line-clamp-1">
      {item.name}
    </p>

    <div className="flex justify-between items-center">
      <span className="text-blue-600 text-sm font-bold">
        {item.price.toLocaleString()}đ
      </span>

      <ShoppingCart size={16} />
    </div>
  </div>

</div> 
          ))}
        </div>

      </div>
    </div>
  );
}