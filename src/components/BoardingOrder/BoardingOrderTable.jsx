import React, { useMemo, useState, useEffect } from "react";
import { ChefHat } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import { boardingOrderData } from "../../datas/boardingOrderData";
import BoardingMealCell from "./BoardingMealCell";
import BoardingMealModal from "./BoardingMealModal";
import { getMealItems, selectCustomerMealItemMe, deleteCustomerMealItem } from "../../api/parent";
import { buildAssetUrl } from "../../api/client";

import banhMi from "../../assets/banhmi.jpg";
import banhNgot from "../../assets/banhngot.jpeg";
import comGaSotNam from "../../assets/comgasotnam.jpg";
import comThitKhoTrung from "../../assets/comthitkhotrung.jpg";
import traSua from "../../assets/trasua.jpg";
import yaourt from "../../assets/Yaourt.png";

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

const getWeekDays = (monday) => {
  if (!monday) return [];
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

const MEAL_PERIOD_MAP = {
  "Ăn sáng": "BREAKFAST",
  "Ăn trưa": "LUNCH",
  "Ăn xế": "AFTERNOON",
};

export default function BoardingOrderTable({ level, activeWeek }) {
  const meals = boardingOrderData[level]?.meals ?? [];
  const weekDays = useMemo(() => getWeekDays(activeWeek?.start), [activeWeek]);
  const [editingCell, setEditingCell] = useState(null);

  const [loading, setLoading] = useState(true);
  const [daysData, setDaysData] = useState([]);
  const { homeData } = useOutletContext() || {};
  const customerId = homeData?.user?.id;

  const from = weekDays[0]?.key || "";
  const to = weekDays[6]?.key || "";

  const fetchMenu = async () => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const data = await getMealItems({ from, to, level });
      setDaysData(data?.days || []);
    } catch (err) {
      console.error("Fetch meal items error:", err);
      toast.error("Không tải được thực đơn bán trú");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [from, to, level]);

  const getCellDetails = (meal, day) => {
    const period = MEAL_PERIOD_MAP[meal];
    const dayData = daysData.find((d) => d.dateKey === day.key);
    const mealData = dayData?.meals?.find((m) => m.mealPeriod === period);
    const items = mealData?.items || [];
    
    const sortedItems = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const options = sortedItems.map((item) => ({
      id: item.product.id,
      mealItemId: item.id,
      name: item.product.name,
      image: buildAssetUrl(item.product.imageUrl) || comGaSotNam,
      description: item.product.description || "Món ăn ngon miệng, bổ dưỡng.",
      ingredients: item.product.ingredients ? item.product.ingredients.split(",").map(i => i.trim()) : [],
      price: item.product.price,
      customerMealItem: item.customerMealItem,
    }));

    const selectedOption = options.find((opt) => opt.customerMealItem);
    const selection = selectedOption
      ? { food: selectedOption, note: selectedOption.customerMealItem.note }
      : null;

    const defaultFood = options[0] || null;

    return { options, selection, defaultFood };
  };

  const openMealModal = (meal, day) => {
    const { options, selection } = getCellDetails(meal, day);

    setEditingCell({
      day,
      meal,
      options,
      selection,
    });
  };

  const closeMealModal = () => {
    setEditingCell(null);
  };

  const saveMeal = async (nextOrder) => {
    if (!editingCell) return;

    try {
      await selectCustomerMealItemMe({
        mealItemId: nextOrder.food.mealItemId,
        note: nextOrder.note,
      });

      toast.success("Lưu lựa chọn món ăn thành công");
      fetchMenu();
      closeMealModal();
    } catch (error) {
      toast.error("Không thể lưu lựa chọn món ăn");
    }
  };

  const deleteMeal = async () => {
    if (!editingCell || !editingCell.selection?.food?.customerMealItem?.id) return;

    try {
      await deleteCustomerMealItem(editingCell.selection.food.customerMealItem.id);
      toast.success("Xóa lựa chọn món ăn thành công");
      fetchMenu();
      closeMealModal();
    } catch (error) {
      toast.error("Không thể xóa lựa chọn món ăn");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600" />
          <p className="text-sm font-semibold text-slate-500">Đang tải thực đơn bán trú...</p>
        </div>
      </div>
    );
  }

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
                  const { selection, defaultFood } = getCellDetails(meal, day);

                  return (
                    <div key={`${day.key}-${meal}`} className="grid grid-cols-[6rem_1fr] gap-3 p-3">
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
                          selection={selection}
                          defaultFood={defaultFood}
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
                      const { selection, defaultFood } = getCellDetails(meal, day);

                      return (
                        <td
                          key={`${day.key}-${meal}`}
                          className={`h-48 border-b border-r border-white ${day.cell} p-3 align-middle`}
                        >
                          <BoardingMealCell
                            accent={day}
                            selection={selection}
                            defaultFood={defaultFood}
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
          key={`${editingCell.day.key}-${editingCell.meal}`}
          day={editingCell.day}
          meal={editingCell.meal}
          options={editingCell.options}
          initialOrder={editingCell.selection}
          onCancel={closeMealModal}
          onSave={saveMeal}
          onDelete={deleteMeal}
        />
      )}
    </>
  );
}
