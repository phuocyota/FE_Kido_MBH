import React from "react";

export default function CategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <div className="sticky -top-4 md:-top-6 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">

        <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">

          {categories.map((item) => {
            const Icon = item.icon;
            const active = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200

                ${
                  active
                    ? "bg-indigo-600 border-indigo-600 text-white shadow"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
              >
                <Icon size={18} />

                <span className="text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}