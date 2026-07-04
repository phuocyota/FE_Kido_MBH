import React, { useMemo, useState } from "react";
import { CalendarDays, Check, ListChecks, StickyNote, Utensils, X } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function BoardingMealModal({
  day,
  initialOrder,
  meal,
  onCancel,
  onSave,
  onDelete,
  options,
}) {
  const [selectedId, setSelectedId] = useState(
    initialOrder?.food?.id ?? (options[0]?.id ?? "")
  );
  const [note, setNote] = useState(initialOrder?.note ?? "");

  const uniqueOptions = useMemo(() => {
    const seen = new Set();
    return options.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [options]);

  const selectOptions = useMemo(() => {
    return uniqueOptions.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [uniqueOptions]);

  const selectedFood = useMemo(
    () => uniqueOptions.find((item) => item.id === selectedId),
    [uniqueOptions, selectedId],
  );

  const handleSave = () => {
    if (!selectedFood) return;

    onSave({
      food: selectedFood,
      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-2 sm:items-center sm:p-4">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-emerald-700 shadow-sm">
                <Utensils size={15} />
                {meal}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sky-700 shadow-sm">
                <CalendarDays size={15} />
                {day.label} - {day.dateLabel}
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">
              {initialOrder ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-4 md:grid-cols-[280px_1fr] md:gap-5 md:p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Chọn món theo buổi
            </label>

            <CustomSelect
              value={selectedId}
              onChange={setSelectedId}
              options={selectOptions}
              placeholder="Chọn món ăn"
              className="border-emerald-200"
              activeColorClass="bg-emerald-50 text-emerald-700"
              focusColorClass="focus:border-emerald-500 focus:ring-emerald-100"
            />

            <label className="mb-2 mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <StickyNote size={16} className="text-amber-600" />
              Ghi chú món ăn
            </label>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Ví dụ: ít sốt, không cay, bé dị ứng đậu phộng..."
              className="min-h-28 w-full resize-none rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 sm:min-h-32"
            />
          </div>

          <div className="min-h-64 rounded-lg border border-slate-200 bg-slate-50 p-3 md:min-h-80">
            {selectedFood ? (
              <div className="grid h-full gap-4 sm:grid-cols-[180px_1fr]">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="h-44 w-full rounded-lg object-cover shadow-sm sm:h-full"
                />

                <div className="flex min-w-0 flex-col">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedFood.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedFood.description}
                  </p>

                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <ListChecks size={16} className="text-emerald-600" />
                      Thành phần
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedFood.ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 text-center md:min-h-72">
                <Utensils size={34} className="text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Chọn một món để xem hình ảnh và thành phần
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
          <div>
            {initialOrder && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              >
                Xóa lựa chọn
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              <X size={16} />
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedFood}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <Check size={17} />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
