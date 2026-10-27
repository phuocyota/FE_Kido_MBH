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
  return (
    <dl className="space-y-3 text-sm">
      {(params.get("type") === "lot" ? lotMilestones : milestones).map(([label, key]) => (
        <div key={key} className="rounded-lg bg-slate-50 p-3">
          <dt className="text-slate-500">{label}</dt>
          <dd className="mt-1 whitespace-pre-line break-words font-semibold text-slate-900">
            {!params.get(key) || params.get(key) === "—" ? "Chưa ghi nhận" : params.get(key)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
