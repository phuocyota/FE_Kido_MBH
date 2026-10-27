import React from "react";

const milestones = [
  ["In stock · Nhập kho nguyên liệu", "stock"],
  ["Make · Bắt đầu chế biến", "make"],
  ["Ready · Chế biến xong", "ready"],
  ["Completed · Hoàn thành", "completed"],
  ["Expired · Hạn sử dụng", "expires"],
];

const lotMilestones = [
  ["Ngày sản xuất", "manufactured"],
  ["In stock · Nhập kho", "stock"],
  ["Expired · Hạn sử dụng", "expires"],
];

export default function TraceMilestones({ params }) {
  const valueFor = (key) => {
    const value = params.get(key);
    if (!value || value === "—") return "Chưa ghi nhận";
    if (key === "stock" && params.get("type") !== "lot" && params.get("stockFormat") !== "name-date") {
      // Older printed QR codes append a lot code in parentheses before each date.
      return value.replace(/\s+\([^()\n]*\)(?=:\s*(?:\d{2}\/\d{2}\/\d{4}|—))/g, "");
    }
    return value;
  };
  return (
    <dl className="space-y-3 text-sm">
      {(params.get("type") === "lot" ? lotMilestones : milestones).map(([label, key]) => (
        <div key={key} className="rounded-lg bg-slate-50 p-3">
          <dt className="text-slate-500">{label}</dt>
          <dd className="mt-1 whitespace-pre-line break-words font-semibold text-slate-900">
            {valueFor(key)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
