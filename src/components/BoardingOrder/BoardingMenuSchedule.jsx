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

function MealCard({ compact = false, day, meal, order, onOpen }) {
  if (!order) {
    return <EmptyMealButton day={day} onOpen={onOpen} />;
  }

  return (
    <div
      className={`relative rounded-lg border border-white bg-white p-2 text-left shadow-sm ring-1 ring-slate-100 ${
        compact ? "" : "min-h-40"
      }`}
    >
      <div className={compact ? "flex min-w-0 gap-2" : ""}>
        <img
          src={order.food.image}
          alt={order.food.name}
          className={
            compact
              ? "h-14 w-14 shrink-0 rounded-lg object-cover"
              : "h-24 w-full rounded-lg object-cover"
          }
        />
        <div className={compact ? "min-w-0 flex-1 pr-8" : "mt-2"}>
          <p className="text-[11px] font-bold uppercase text-emerald-600">
            {meal}
          </p>
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
            {order.food.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {order.food.ingredients?.slice(0, compact ? 2 : 3).join(", ")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-amber-100 hover:text-amber-700"
        aria-label={`Chỉnh sửa ${order.food.name}`}
      >
        <Edit3 size={15} />
      </button>
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
                          order={schedule[key]}
                          onOpen={() => onOpenMeal({ day, meal })}
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
                          className={`h-48 border-b border-r border-white ${day.cell} p-3 align-middle`}
                        >
                          <MealCard
                            day={day}
                            meal={meal}
                            order={schedule[key]}
                            onOpen={() => onOpenMeal({ day, meal })}
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
