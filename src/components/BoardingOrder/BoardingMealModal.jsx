import React, { useState } from "react";
import {
  CalendarDays,
  Check,
  ImagePlus,
  ListChecks,
  Sparkles,
  Trash2,
  Upload,
  Utensils,
  X,
} from "lucide-react";

export default function BoardingMealModal({
  context,
  fallbackImage,
  foodTemplates,
  makeFoodId,
  meals,
  onClose,
  onDelete,
  onSave,
}) {
  const initialFood = context.order?.food;
  const [draft, setDraft] = useState(() => ({
    templateId: "",
    name: initialFood?.name ?? "",
    image: initialFood?.image ?? "",
    imageName: "",
    description: initialFood?.description ?? "",
    ingredientsText: initialFood?.ingredients?.join(", ") ?? "",
    note: context.order?.note ?? "",
    applyMode: context.applyMode ?? "day",
    meal: context.meal ?? meals[0] ?? "",
  }));

  const selectedTemplate = foodTemplates.find((item) => item.id === draft.templateId);
  const previewFood = {
    name: draft.name.trim() || selectedTemplate?.name || "Tên món ăn",
    image: draft.image || selectedTemplate?.image || fallbackImage,
    description:
      draft.description.trim() ||
      selectedTemplate?.description ||
      "Mô tả món ăn sẽ hiển thị cho phụ huynh.",
    ingredients: draft.ingredientsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectTemplate = (templateId) => {
    const template = foodTemplates.find((item) => item.id === templateId);

    setDraft((current) => ({
      ...current,
      templateId,
      imageName: "",
      name: template?.name ?? current.name,
      image: template?.image ?? current.image,
      description: template?.description ?? current.description,
      ingredientsText: template?.ingredients?.join(", ") ?? current.ingredientsText,
    }));
  };

  const chooseImageFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : current.image,
        imageName: file.name,
        templateId: "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewFood.name || previewFood.name === "Tên món ăn") return;

    onSave({
      meal: draft.meal,
      applyMode: draft.applyMode,
      order: {
        food: {
          id: initialFood?.id ?? makeFoodId(previewFood.name, context.day?.key, draft.meal),
          name: previewFood.name,
          image: previewFood.image,
          description: previewFood.description,
          ingredients: previewFood.ingredients,
        },
        note: draft.note.trim(),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-2 sm:items-center sm:p-4">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-emerald-700 shadow-sm">
                <CalendarDays size={15} />
                {context.day ? `${context.day.label} - ${context.day.dateLabel}` : "Cả tuần"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sky-700 shadow-sm">
                <Utensils size={15} />
                {draft.meal || "Chọn bữa"}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">
              {context.order ? "Chỉnh sửa món bán trú" : "Thêm món bán trú"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-4 lg:grid-cols-[360px_1fr] lg:p-5">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Bữa ăn</span>
                <select
                  value={draft.meal}
                  onChange={(event) => updateDraft("meal", event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  {meals.map((meal) => (
                    <option key={meal} value={meal}>
                      {meal}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Phạm vi áp dụng</span>
                <select
                  value={draft.applyMode}
                  onChange={(event) => updateDraft("applyMode", event.target.value)}
                  className="h-11 w-full rounded-lg border border-sky-200 bg-sky-50 px-3 font-medium text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="day">Chỉ ngày đang chọn</option>
                  <option value="week">Áp dụng cả tuần</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Chọn nhanh món ăn mẫu</span>
              <select
                value={draft.templateId}
                onChange={(event) => selectTemplate(event.target.value)}
                className="h-11 w-full rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Tự nhập món mới</option>
                {foodTemplates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Tên món</span>
              <input
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                placeholder="Nhập tên món ăn"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <ImagePlus size={16} className="text-sky-600" />
                Ảnh món
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => chooseImageFile(event.target.files?.[0])}
                className="block w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-700 file:mr-4 file:h-11 file:border-0 file:bg-sky-50 file:px-4 file:text-sm file:font-bold file:text-sky-700 hover:file:bg-sky-100"
              />
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Upload size={14} />
                {draft.imageName || "Chọn ảnh từ máy tính để hiển thị cho phụ huynh."}
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Thành phần</span>
              <input
                value={draft.ingredientsText}
                onChange={(event) => updateDraft("ingredientsText", event.target.value)}
                placeholder="Ví dụ: Cơm trắng, thịt heo, rau luộc"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Mô tả</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={3}
                placeholder="Mô tả ngắn để phụ huynh xem chi tiết món"
                className="min-h-24 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Ghi chú</span>
              <textarea
                value={draft.note}
                onChange={(event) => updateDraft("note", event.target.value)}
                rows={3}
                placeholder="Ví dụ: ít sốt, không cay, suất riêng cho bé dị ứng..."
                className="min-h-24 w-full resize-none rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
              />
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <img
                src={previewFood.image}
                alt={previewFood.name}
                className="h-52 w-full object-cover sm:h-64"
              />
              <div className="p-4">
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles size={14} />
                  Xem trước bên phụ huynh
                </p>
                <h3 className="text-xl font-bold text-slate-900">{previewFood.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{previewFood.description}</p>

                <div className="mt-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <ListChecks size={16} className="text-emerald-600" />
                    Thành phần
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(previewFood.ingredients.length
                      ? previewFood.ingredients
                      : ["Chưa nhập thành phần"]
                    ).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {draft.note && (
                  <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    {draft.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex sm:justify-between sm:px-5">
          <div>
            {context.order && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 sm:w-auto"
              >
                <Trash2 size={16} />
                Xóa món
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <X size={16} />
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
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
