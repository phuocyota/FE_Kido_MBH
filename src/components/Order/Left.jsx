import React, {
  useMemo,
  useState,
} from "react";

import banhmi from "../../assets/banhmi.jpg";
import bg_left from "../../assets/left_order.png";

export default function Left({
  categories = [],
  activeCategory,
  setActiveCategory,
  products = [],
  addToCart,
}) {
  // SEARCH
  const [search, setSearch] =
    useState("");

  // FILTER PRODUCTS
  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (item) => {

          // 👇 SEARCH
          const matchSearch =
            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchSearch
          );
        }
      );

    }, [
      products,
      search,
    ]);

  return (
    <div
      className="
        w-[60%]
        bg-white
        rounded-xl
        m-3
        shadow
        flex
        flex-col
        p-4
      "
    >

      {/* CATEGORY */}
      <div
        className="
          p-3
          flex
          gap-2
          border-b
          border-gray-400
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            overflow-hidden
            w-[70%]
          "
        >

          {/* LEFT */}
          <button
            onClick={() => {
              document
                .getElementById(
                  "category-scroll"
                )
                ?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                });
            }}
            className="
              bg-gray-200
              px-2
              py-1
              rounded-lg
              cursor-pointer
            "
          >
            ◀
          </button>

          {/* CATEGORY LIST */}
          <div
            id="category-scroll"
            className="
              flex
              gap-2
              overflow-x-auto
              scrollbar-hide
            "
          >

            {categories.map((c) => (

              <button
                key={c}
                onClick={() =>
                  setActiveCategory(c)
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  whitespace-nowrap
                  cursor-pointer
                  transition
                  ${
                    activeCategory === c
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {c}
              </button>

            ))}

          </div>

          {/* RIGHT */}
          <button
            onClick={() => {
              document
                .getElementById(
                  "category-scroll"
                )
                ?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                });
            }}
            className="
              bg-gray-200
              px-2
              py-1
              rounded-lg
              cursor-pointer
            "
          >
            ▶
          </button>

        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Tìm món..."
          className="
            ml-auto
            px-4
            py-2
            rounded-xl
            w-[250px]
            shadow
            border
            border-gray-300
            outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        />

      </div>

      {/* PRODUCTS */}
      <div
        className="
          relative
          flex-1
          overflow-hidden
          min-h-0
          h-full
        "
      >

        {/* WHITE BG */}
        <div
          className="
            absolute
            inset-0
            bg-white
          "
        />

        {/* BG LEFT */}
        <div
          className="
            absolute
            inset-0
            pointer-events-none
            z-10
          "
          style={{
            backgroundImage:
              `url(${bg_left})`,
            backgroundRepeat:
              "repeat",
            backgroundSize:
              "200px",
          }}
        />

        {/* PRODUCTS */}
        <div
          className="
            relative
            z-20
            p-2
            grid
            grid-cols-4
            gap-x-4
            gap-y-2
            overflow-y-auto
            h-full
          "
        >
          {filteredProducts.length === 0 && (
            <div className="col-span-4 flex h-full items-center justify-center text-gray-500 font-medium">
              Không có món để hiển thị
            </div>
          )}

          {filteredProducts.map(
            (item) => (

              <div
                key={item.id}
                onClick={() =>
                  addToCart(item)
                }
                className="
                  bg-white
                  rounded-xl
                  border
                  border-gray-300
                  overflow-hidden
                  flex
                  flex-col
                  h-[180px]
                  cursor-pointer
                  hover:shadow-lg
                  transition
                "
              >

                {/* IMAGE */}
                <div
                  className="
                    w-full
                    h-[110px]
                    overflow-hidden
                  "
                >

                  <img
                    src={
                      item.image ||
                      banhmi
                    }
                    onError={(e) => {
                      e.target.src =
                        banhmi;
                    }}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

                {/* INFO */}
                <div
                  className="
                    p-2
                    flex
                    flex-col
                    justify-between
                    flex-1
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      line-clamp-1
                    "
                  >
                    {item.name}
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-blue-600
                        text-sm
                        font-bold
                      "
                    >
                      {Number(
                        item.price
                      ).toLocaleString()}đ
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {item.unit}
                    </span>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>
    </div>
  );
}
