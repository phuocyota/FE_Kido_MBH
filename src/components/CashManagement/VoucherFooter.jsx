import React, { useId, useRef } from "react";
import { Paperclip, X } from "lucide-react";

export default function VoucherFooter({
  onCancel,
  onSave,
  onChangeFile,
  selectedFile,
  onClearFile,
  isSaving,
}) {
  const fileInput = useRef(null);
  const fileStatusId = useId();
  return (
    <div className="border-t border-gray-300 bg-gray-50 px-4 py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={isSaving}
              aria-describedby={fileStatusId}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Paperclip size={17} aria-hidden="true" />
              {selectedFile ? "Đổi file đính kèm" : "Chọn file đính kèm"}
            </button>
            <div
              id={fileStatusId}
              role="status"
              className="flex min-w-0 items-center gap-2 text-sm text-slate-600"
            >
              <span className="max-w-64 truncate" title={selectedFile?.name}>
                {selectedFile?.name || "Chưa chọn file"}
              </span>
              {selectedFile && (
                <button
                  type="button"
                  aria-label={`Bỏ chọn file ${selectedFile.name}`}
                  onClick={() => {
                    if (fileInput.current) fileInput.current.value = "";
                    onClearFile();
                  }}
                  disabled={isSaving}
                  className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            aria-label="Chọn file đính kèm"
            onChange={onChangeFile}
            disabled={isSaving}
            className="hidden"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !onSave}
            className="px-6 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
