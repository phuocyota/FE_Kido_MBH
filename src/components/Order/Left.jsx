import React  from "react";
import banhmi from "../../assets/banhmi.jpg";
import { ShoppingCart } from "lucide-react";

export default function Left({
  categories,
  activeCategory,
  setActiveCategory,
  products,
  addToCart,
}) {
  return (
    <div className="w-[60%] bg-white rounded-xl m-3 shadow flex flex-col">

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
          className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer ${
            activeCategory === c
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
          <div className="flex-1 p-2 grid grid-cols-4 gap-4 items-start content-start overflow-auto">
           {products.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white rounded-xl border border-gray-300 hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={banhmi}
                  alt={p.name}
                  className="w-full h-[120px] object-cover rounded-t-xl"
                />

                <div className="p-2">
                  <p className="text-sm font-semibold">{p.name}</p>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-blue-600 text-sm font-bold">
                      {p.price.toLocaleString()}đ
                    </span>

                    <ShoppingCart size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}