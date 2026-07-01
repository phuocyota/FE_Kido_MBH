import React, { useEffect, useMemo, useState } from "react";
import { ChefHat, Clock3, Plus, RefreshCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import canteenImage from "../../assets/comthitkhotrung.jpg";
import kidoImage from "../../assets/Yaourt.png";
import testFood from "../../assets/comgasotnam.jpg";
import BoardingMealModal from "./BoardingMealModal";
import BoardingMenuSchedule from "./BoardingMenuSchedule";
import CustomSelect from "../ui/CustomSelect";
import { mealItemApi, productApi } from "../../api";

const levels = [
  { value: "preschool", label: "Mầm non", meals: ["Ăn sáng", "Ăn trưa", "Ăn xế"] },
  { value: "primary", label: "Tiểu học", meals: ["Ăn trưa", "Ăn xế"] },
];

const dayThemes = [
  { label: "Thứ 2", header: "from-rose-500 to-pink-500", cell: "bg-rose-50", button: "from-rose-400 via-pink-400 to-orange-300" },
  { label: "Thứ 3", header: "from-orange-500 to-amber-400", cell: "bg-orange-50", button: "from-orange-400 via-amber-300 to-yellow-300" },
  { label: "Thứ 4", header: "from-lime-500 to-emerald-500", cell: "bg-lime-50", button: "from-lime-400 via-emerald-400 to-teal-300" },
  { label: "Thứ 5", header: "from-cyan-500 to-sky-500", cell: "bg-cyan-50", button: "from-cyan-400 via-sky-400 to-blue-300" },
  { label: "Thứ 6", header: "from-blue-500 to-indigo-500", cell: "bg-blue-50", button: "from-blue-400 via-indigo-400 to-violet-300" },
  { label: "Thứ 7", header: "from-violet-500 to-fuchsia-500", cell: "bg-violet-50", button: "from-violet-400 via-fuchsia-400 to-pink-300" },
  { label: "Chủ nhật", header: "from-teal-500 to-emerald-500", cell: "bg-teal-50", button: "from-teal-400 via-emerald-400 to-green-300" },
];

const foodTemplates = [
  {
    id: "rice-chicken",
    name: "Cơm gà sốt nấm",
    image: testFood,
    description: "Suất trưa cân bằng tinh bột, đạm và rau xanh.",
    ingredients: ["Cơm trắng", "Ức gà", "Nấm", "Cà rốt", "Rau cải"],
  },
  {
    id: "rice-pork-egg",
    name: "Cơm thịt kho trứng",
    image: canteenImage,
    description: "Món trưa quen vị, dễ ăn, dùng kèm rau luộc và canh.",
    ingredients: ["Cơm trắng", "Thịt heo", "Trứng cút", "Rau luộc", "Canh bí đỏ"],
  },
  {
    id: "yogurt",
    name: "Yaourt trái cây",
    image: kidoImage,
    description: "Món xế mát, dễ tiêu hóa và phù hợp khẩu vị học sinh.",
    ingredients: ["Sữa chua", "Mứt trái cây", "Ngũ cốc giòn"],
  },
];

const formatDate = (date) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getWeekDays = (week) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + (week === "next" ? 7 : 0));

  return dayThemes.map((theme, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      ...theme,
      date,
      dateLabel: formatDate(date),
      key: toDateKey(date),
    };
  });
};

const makeKey = (level, dayKey, meal) => `${level}__${dayKey}__${meal}`;

const makeFoodId = (name, dayKey, meal) => {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `admin-${dayKey || "week"}-${meal || "meal"}-${slug || "food"}`;
};

const mealToEnum = {
  "Ăn sáng": "BREAKFAST",
  "Ăn trưa": "LUNCH",
  "Ăn xế": "AFTERNOON",
  "Ăn tối": "DINNER"
};

const enumToMeal = {
  BREAKFAST: "Ăn sáng",
  LUNCH: "Ăn trưa",
  AFTERNOON: "Ăn xế",
  DINNER: "Ăn tối"
};

export default function BoardingOrderAdmin() {
  const [level, setLevel] = useState("preschool");
  const [week, setWeek] = useState("this");
  const [schedule, setSchedule] = useState({});
  const [modalContext, setModalContext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentLevel = levels.find((item) => item.value === level) ?? levels[0];
  const meals = currentLevel.meals;
  const weekDays = useMemo(() => getWeekDays(week), [week]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const data = await mealItemApi.getAll({ status: "ACTIVE" });
      const newSchedule = {};

      data.forEach(item => {
        if (!item.product) return;

        const meal = enumToMeal[item.mealPeriod];
        const dateKey = item.dateKey;
        const itemLevel = item.level;
        
        if (meal && dateKey && itemLevel === level) {
            newSchedule[makeKey(itemLevel, dateKey, meal)] = {
                id: item.id,
                food: {
                    id: item.product.id,
                    name: item.product.name,
                    image: item.product.imageUrl || "",
                    description: item.product.description || "",
                    ingredients: [], 
                },
                note: item.note || "",
                scope: "day",
                dateKey: dateKey,
                meal,
                level: itemLevel,
            };
        }
      });
      setSchedule(newSchedule);
    } catch (err) {
      toast.error("Không thể tải dữ liệu thực đơn");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [level, week]);

  const filledCount = weekDays.reduce(
    (count, day) =>
      count + meals.filter((meal) => Boolean(schedule[makeKey(level, day.key, meal)])).length,
    0,
  );
  const totalSlots = weekDays.length * meals.length;

  const openModal = ({ day = weekDays[0], meal = meals[0], applyMode = "day" } = {}) => {
    const key = makeKey(level, day.key, meal);

    setModalContext({
      day,
      meal,
      applyMode,
      order: schedule[key],
    });
  };

  const saveMeal = async ({ meal, applyMode, order }) => {
    if (!modalContext?.day) return;
    const targetDays = applyMode === "week" ? weekDays : [modalContext.day];
    
    setIsLoading(true);
    try {
      let productId = order.food.id;
      
      const isTemplate = foodTemplates.some(t => t.id === productId);
      if (!isTemplate && String(productId).startsWith("admin-")) {
          let finalImageUrl = order.food.image;
          if (order.food.imageFile) {
              try {
                  const res = await productApi.uploadImage(order.food.imageFile);
                  finalImageUrl = res.imageUrl;
              } catch (err) {
                  toast.error("Không thể tải ảnh món ăn lên");
              }
          }

          const newProduct = await productApi.create({
              categoryId: null,
              name: order.food.name,
              description: order.food.description,
              imageUrl: finalImageUrl,
              price: 0,
              isActive: true,
              isCanteenItem: false
          });
          productId = newProduct.id;
      }

      await Promise.all(targetDays.map(async (day) => {
          const existing = schedule[makeKey(level, day.key, meal)];
          if (existing?.id) {
              await mealItemApi.delete(existing.id).catch(() => {});
          }

          return mealItemApi.create({
              productId,
              mealPeriod: mealToEnum[meal],
              level,
              dayOfWeek: day.date.getDay(),
              dateKey: day.key,
              note: order.note,
              status: "ACTIVE"
          });
      }));
      
      toast.success("Lưu thực đơn thành công");
      await fetchSchedule();
      setModalContext(null);
    } catch (err) {
      toast.error("Có lỗi xảy ra khi lưu thực đơn");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async () => {
    if (!modalContext?.day || !modalContext?.meal) return;
    
    const key = makeKey(level, modalContext.day.key, modalContext.meal);
    const existing = schedule[key];
    
    if (existing?.id) {
        setIsLoading(true);
        try {
            await mealItemApi.delete(existing.id);
            toast.success("Xóa món thành công");
            await fetchSchedule();
            setModalContext(null);
        } catch (err) {
            toast.error("Không thể xóa món");
        } finally {
            setIsLoading(false);
        }
    } else {
        setSchedule((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
        setModalContext(null);
    }
  };

  const clearWeek = async () => {
    setIsLoading(true);
    try {
        const promises = [];
        weekDays.forEach((day) => {
            meals.forEach((meal) => {
                const existing = schedule[makeKey(level, day.key, meal)];
                if (existing?.id) {
                    promises.push(mealItemApi.delete(existing.id).catch(() => {}));
                }
            });
        });
        await Promise.all(promises);
        toast.success("Đã làm mới tuần");
        await fetchSchedule();
    } catch (err) {
        toast.error("Có lỗi xảy ra");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-4 lg:grid-cols-[1fr_auto] lg:items-center lg:p-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                <ChefHat size={16} />
                Quản lý bán trú
              </p>
              <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Thiết lập món ăn hằng ngày và hằng tuần
                {isLoading && <Loader2 className="animate-spin text-emerald-600" size={24} />}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Thực đơn được lưu theo ngày, bữa ăn và khối lớp để phụ huynh xem đúng lịch trong trang đặt món bán trú.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <button
                type="button"
                onClick={() => openModal({ applyMode: "week" })}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
              >
                <Plus size={17} />
                Thêm cả tuần
              </button>
              <button
                type="button"
                onClick={clearWeek}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCcw size={16} />
                Làm mới tuần
              </button>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-200 p-4 sm:grid-cols-2 xl:grid-cols-[220px_220px_1fr] xl:items-end xl:p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Khối lớp</span>
              <CustomSelect 
                value={level}
                onChange={setLevel}
                options={levels}
                themeColor="emerald"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Tuần áp dụng</span>
              <CustomSelect 
                value={week}
                onChange={setWeek}
                options={[
                  { value: "this", label: "Tuần này" },
                  { value: "next", label: "Tuần tới" }
                ]}
                themeColor="sky"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-bold uppercase text-emerald-700">Đã thêm</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {filledCount}/{totalSlots}
                </p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                <p className="text-xs font-bold uppercase text-sky-700">Số bữa</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{meals.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                <ChefHat size={18} className="text-emerald-600" />
                Lịch thực đơn
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Bấm dấu cộng để thêm theo ngày, hoặc chọn áp dụng cả tuần trong popup.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              <Clock3 size={14} />
              Lưu tự động trên thiết bị
            </span>
          </div>

          <BoardingMenuSchedule
            level={level}
            meals={meals}
            schedule={schedule}
            weekDays={weekDays}
            makeKey={makeKey}
            onOpenMeal={openModal}
          />
        </section>
      </div>

      {modalContext && (
        <BoardingMealModal
          context={modalContext}
          fallbackImage={canteenImage}
          foodTemplates={foodTemplates}
          makeFoodId={makeFoodId}
          meals={meals}
          onClose={() => setModalContext(null)}
          onDelete={deleteMeal}
          onSave={saveMeal}
        />
      )}
    </div>
  );
}
