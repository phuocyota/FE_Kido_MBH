import React from "react";
import { ChefHat, Edit3, Plus } from "lucide-react";

function EmptyMealButton({ day, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${day.button} p-[3px] shadow-lg shadow-slate-200 transition hover:-translate-y-1 sm:h-14 sm:w-14`}
      aria-label="Thêm món"
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
        <Plus
          size={24}
          strokeWidth={2.8}
          className="text-slate-800 transition group-hover:rotate-90"
        />
      </span>
    </button>
  );
}

function MealCard({ compact = false, day, meal, options = [], onOpen }) {
  if (!options || options.length === 0) {
    return <EmptyMealButton day={day} onOpen={() => onOpen({ day, meal, optionIndex: 0 })} />;
  }

  return (
    <div className="space-y-2 w-full h-full flex flex-col justify-center">
      {options.map((opt, idx) => (
        <div
          key={opt.id || idx}
          className="relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 text-left shadow-sm hover:border-emerald-300 transition"
        >
          <img
            src={opt.food.image}
            alt={opt.food.name}
            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-slate-100"
          />
          <div className="min-w-0 flex-1 pr-6">
            <p className="text-[9px] font-bold uppercase text-emerald-600">
              Lựa chọn {idx + 1}
            </p>
            <h4 className="truncate text-xs font-bold text-slate-800" title={opt.food.name}>
              {opt.food.name}
            </h4>
            {opt.expectedQuantity > 0 && (
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Dự kiến: <span className="font-semibold text-slate-700">{opt.expectedQuantity}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpen({ day, meal, order: opt, optionIndex: idx })}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
            aria-label="Sửa lựa chọn"
          >
            <Edit3 size={12} />
          </button>
        </div>
      ))}

      {options.length < 3 && (
        <button
          type="button"
          onClick={() => onOpen({ day, meal, optionIndex: options.length })}
          className="flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition"
        >
          <Plus size={14} />
          Lựa chọn {options.length + 1}
        </button>
      )}
    </div>
  );
}

export default function BoardingMenuSchedule({
  level,
  makeKey,
  meals,
  onOpenMeal,
  schedule,
  weekDays,
}) {
  return (
    <>
      {/* Mobile / Tablet view */}
      <div className="block p-3 lg:hidden">
        <div className="grid gap-4 md:grid-cols-2">
          {weekDays.map((day) => (
            <article
              key={day.key}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className={`bg-gradient-to-br ${day.header} px-4 py-3 text-white`}>
                <p className="text-base font-bold">{day.label}</p>
                <p className="mt-1 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {day.dateLabel}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {meals.map((meal) => {
                  const key = makeKey(level, day.key, meal);
                  return (
                    <div key={key} className="grid grid-cols-[6rem_1fr] gap-3 p-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ChefHat size={17} />
                        </span>
                        <p className="text-sm font-bold leading-5 text-slate-900">{meal}</p>
                      </div>
                      <div className={`${day.cell} rounded-xl p-2`}>
                        <MealCard
                          compact
                          day={day}
                          meal={meal}
                          options={schedule[key]}
                          onOpen={onOpenMeal}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden p-4 lg:block">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 w-44 border-b border-r border-slate-200 bg-slate-900 px-4 py-4 text-left text-white">
                    <div className="flex items-center gap-2">
                      <ChefHat size={18} />
                      <span>Bữa ăn</span>
                    </div>
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.key}
                      className={`min-w-40 border-b border-r border-white bg-gradient-to-br ${day.header} px-4 py-4 text-center text-white`}
                    >
                      <div className="text-base font-bold">{day.label}</div>
                      <div className="mt-1 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                        {day.dateLabel}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal}>
                    <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ChefHat size={19} />
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{meal}</p>
                          <p className="text-xs text-slate-500">Tạo món theo lịch</p>
                        </div>
                      </div>
                    </td>

                    {weekDays.map((day) => {
                      const key = makeKey(level, day.key, meal);
                      return (
                        <td
                          key={key}
                          className={`border-b border-r border-white ${day.cell} p-3 align-middle`}
                        >
                          <MealCard
                            day={day}
                            meal={meal}
                            options={schedule[key]}
                            onOpen={onOpenMeal}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
