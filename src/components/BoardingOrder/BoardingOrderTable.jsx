import React, { useMemo, useState } from "react";
import { ChefHat } from "lucide-react";

import { boardingMealOptions, boardingOrderData } from "../../datas/boardingOrderData";
import BoardingMealCell from "./BoardingMealCell";
import BoardingMealModal from "./BoardingMealModal";

const dayAccents = [
  {
    label: "Thứ 2",
    header: "from-rose-500 to-pink-500",
    cell: "bg-rose-50/70",
    button: "from-rose-400 via-pink-400 to-orange-300",
  },
  {
    label: "Thứ 3",
    header: "from-orange-500 to-amber-400",
    cell: "bg-orange-50/70",
    button: "from-orange-400 via-amber-300 to-yellow-300",
  },
  {
    label: "Thứ 4",
    header: "from-lime-500 to-emerald-500",
    cell: "bg-lime-50/70",
    button: "from-lime-400 via-emerald-400 to-teal-300",
  },
  {
    label: "Thứ 5",
    header: "from-cyan-500 to-sky-500",
    cell: "bg-cyan-50/70",
    button: "from-cyan-400 via-sky-400 to-blue-300",
  },
  {
    label: "Thứ 6",
    header: "from-blue-500 to-indigo-500",
    cell: "bg-blue-50/70",
    button: "from-blue-400 via-indigo-400 to-violet-300",
  },
  {
    label: "Thứ 7",
    header: "from-violet-500 to-fuchsia-500",
    cell: "bg-violet-50/70",
    button: "from-violet-400 via-fuchsia-400 to-pink-300",
  },
  {
    label: "Chủ nhật",
    header: "from-teal-500 to-emerald-500",
    cell: "bg-teal-50/70",
    button: "from-teal-400 via-emerald-400 to-green-300",
  },
];

const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const getWeekDays = (week) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + (week === "next" ? 7 : 0));

  return dayAccents.map((accent, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      ...accent,
      date,
      dateLabel: formatDate(date),
      key: getLocalDateKey(date),
    };
  });
};

export default function BoardingOrderTable({ level, week }) {
  const meals = boardingOrderData[level]?.meals ?? [];
  const weekDays = useMemo(() => getWeekDays(week), [week]);
  const [orders, setOrders] = useState({});
  const [editingCell, setEditingCell] = useState(null);

  const getOrderKey = (meal, day) => `${day.key}-${meal}`;

  const openMealModal = (meal, day) => {
    const orderKey = getOrderKey(meal, day);

    setEditingCell({
      day,
      meal,
      orderKey,
      order: orders[orderKey] ?? null,
    });
  };

  const closeMealModal = () => {
    setEditingCell(null);
  };

  const saveMeal = (nextOrder) => {
    if (!editingCell) return;

    setOrders((current) => ({
      ...current,
      [editingCell.orderKey]: nextOrder,
    }));
    closeMealModal();
  };

  return (
    <>
      <div className="block p-3 sm:p-4 lg:hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          {weekDays.map((day) => (
            <section
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
                  const orderKey = getOrderKey(meal, day);

                  return (
                    <div key={orderKey} className="grid grid-cols-[6rem_1fr] gap-3 p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ChefHat size={17} />
                        </span>
                        <p className="break-words text-sm font-bold leading-5 text-slate-900">
                          {meal}
                        </p>
                      </div>

                      <div className={`${day.cell} rounded-xl p-2`}>
                        <BoardingMealCell
                          compact
                          accent={day}
                          selection={orders[orderKey]}
                          onOpen={() => openMealModal(meal, day)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="hidden bg-white p-4 lg:block">
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
                {meals.map((meal, rowIndex) => (
                  <tr key={meal}>
                    <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ChefHat size={19} />
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{meal}</p>
                          <p className="text-xs text-slate-500">
                            {rowIndex === 0 ? "Chọn món phù hợp" : "Theo lịch trong tuần"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {weekDays.map((day) => {
                      const orderKey = getOrderKey(meal, day);

                      return (
                        <td
                          key={orderKey}
                          className={`h-48 border-b border-r border-white ${day.cell} p-3 align-middle`}
                        >
                          <BoardingMealCell
                            accent={day}
                            selection={orders[orderKey]}
                            onOpen={() => openMealModal(meal, day)}
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

      {editingCell && (
        <BoardingMealModal
          key={editingCell.orderKey}
          day={editingCell.day}
          meal={editingCell.meal}
          options={boardingMealOptions[editingCell.meal] ?? []}
          initialOrder={editingCell.order}
          onCancel={closeMealModal}
          onSave={saveMeal}
        />
      )}
    </>
  );
}
