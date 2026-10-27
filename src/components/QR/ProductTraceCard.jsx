import React, { useState } from "react";
import { resolveProductImage } from "./productImage";
import TraceMilestones from "./TraceMilestones";
import productPlaceholder from "../../assets/product-placeholder.svg";

export default function ProductTraceCard({ name, params, live = false }) {
  const image = resolveProductImage(params.get("image"));
  const [failedImage, setFailedImage] = useState("");
  return (
    <article className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-white shadow-sm">
      {image && failedImage !== image ? (
        <img src={image} alt={name} onError={() => setFailedImage(image)} className="h-64 w-full object-cover" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">
          <div className="flex h-full w-full flex-col items-center justify-center pb-4">
            <img src={productPlaceholder} alt="Ảnh thay thế sản phẩm" className="min-h-0 w-full flex-1 object-contain" />
            <p>{image ? "Không thể tải hình ảnh sản phẩm" : "Chưa có hình ảnh sản phẩm"}</p>
          </div>
        </div>
      )}
      {image && failedImage !== image && params.get("imageSource") === "ILLUSTRATION" && <p className="px-5 pt-2 text-xs text-slate-500">Ảnh minh họa sản phẩm</p>}
      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs text-slate-500">Thông tin sản phẩm</p>
          <h1 className="mt-2 break-words text-2xl font-bold text-slate-900">{name}</h1>
          {params.get("lot") && <p className="mt-1 break-all text-sm text-slate-600">Lô: {params.get("lot")}</p>}
          {params.has("serial") && <p className="mt-1 break-all text-sm text-slate-600">Serial: {params.get("serial")}</p>}
        </div>
        <h2 className="font-semibold text-slate-900">Truy xuất nguồn gốc</h2>
        <TraceMilestones params={params} />
        <p className="text-xs text-slate-500">Thời gian theo múi giờ Việt Nam (UTC+7). {live ? "Thông tin được lấy từ hồ sơ truy xuất hiện tại." : "Thông tin được ghi nhận tại thời điểm tạo tem QR."}</p>
      </div>
    </article>
  );
}
