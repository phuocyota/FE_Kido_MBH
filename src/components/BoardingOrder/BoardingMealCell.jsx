import React from "react";
import { Edit3, Plus, StickyNote } from "lucide-react";

export default function BoardingMealCell({ accent, compact = false, onOpen, selection, defaultFood }) {
  const isDefault = !selection;
  const finalSelection = selection || (defaultFood ? { food: defaultFood } : null);

  if (!finalSelection) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`group mx-auto flex ${compact ? "h-12 w-12" : "h-16 w-16"} items-center justify-center rounded-full bg-gradient-to-br ${accent.button} p-[3px] shadow-lg shadow-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-100`}
        aria-label="Thêm món"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
          <Plus
            size={compact ? 22 : 28}
            strokeWidth={2.8}
            className="text-slate-800 transition duration-200 group-hover:rotate-90 group-hover:scale-110"
          />
        </span>
      </button>
    );
  }

  const { food, note } = finalSelection;

  if (compact) {
    return (
      <div className="relative rounded-lg border border-white bg-white p-2 text-left shadow-sm ring-1 ring-slate-100">
        <div className="flex min-w-0 gap-2">
          <img
            src={food.image}
            alt={food.name}
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0 flex-1 pr-8">
            <h3 className="line-clamp-2 text-xs font-bold leading-4 text-slate-900">
              {food.name}
            </h3>

            <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-slate-500">
              {food.ingredients.slice(0, 2).join(", ")}
            </p>
          </div>
        </div>

        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          {isDefault && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 shadow-sm border border-slate-200">
              Mặc định
            </span>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-amber-100 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={`Chỉnh sửa ${food.name}`}
          >
            <Edit3 size={14} />
          </button>
        </div>

        {note && (
          <p className="mt-2 flex gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] leading-4 text-amber-700">
            <StickyNote size={13} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{note}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-40 rounded-lg border border-white bg-white p-2 text-left shadow-sm ring-1 ring-slate-100">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={food.image}
          alt={food.name}
          className="h-24 w-full object-cover"
        />
        {isDefault && (
          <div className="absolute left-2 top-2 flex items-center gap-1.5">
            <span className="rounded bg-slate-900/60 backdrop-blur-[2px] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Mặc định
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-amber-100 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          aria-label={`Chỉnh sửa ${food.name}`}
        >
          <Edit3 size={16} />
        </button>
      </div>

      <div className="mt-2">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
          {food.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
          {food.ingredients.slice(0, 3).join(", ")}
        </p>

        {note && (
          <p className="mt-2 flex gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs leading-5 text-amber-700">
            <StickyNote size={14} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{note}</span>
          </p>
        )}
      </div>
    </div>
  );
}
