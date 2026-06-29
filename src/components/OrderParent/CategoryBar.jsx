import React from "react";

export default function CategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <div className="sticky -top-4 md:-top-6 z-20 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-full border px-5 py-2.5 transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-95
                ${
                  active
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white shadow-md shadow-indigo-500/20"
                    : "bg-gray-50/80 border-transparent text-gray-600 hover:bg-gray-100/80 hover:text-indigo-600"
                }`}
              >
                <Icon size={18} className={active ? "animate-pulse" : ""} />

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