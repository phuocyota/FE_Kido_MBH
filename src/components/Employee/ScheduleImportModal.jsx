import { importColumns } from "../../utils/timeSheet";

export default function ScheduleImportModal({
  rows,
  replaceExisting,
  onReplaceChange,
  importing,
  onClose,
  onImport,
}) {
  if (!rows) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Xem trước import"
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold">Xem trước import — {rows.length} lịch</h2>
        <p className="mt-2 text-sm text-gray-600">
          Dùng file xuất từ màn hình này làm mẫu. Các cột: {importColumns.join(", ")}.
          Ngày dùng YYYY-MM-DD, giờ dùng HH:mm. Chỉ nhập nhân viên đang làm việc.
          Tối đa 500 dòng/file, 5 MB.
        </p>
        <div className="overflow-auto max-h-[45vh] mt-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                {["Mã NV", "Nhân viên", "Ngày", "Ca", "Giờ", "Ghi chú"].map((label) => (
                  <th key={label} className="p-2 border">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.employeeId}:${row.workDate}`}>
                  {[
                    row.employeeCode,
                    row.employeeName,
                    row.workDate,
                    row.shift,
                    row.shift === "custom" ? `${row.startTime} - ${row.endTime}` : "",
                    row.note,
                  ].map((value, index) => (
                    <td key={index} className="p-2 border">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <label className="flex items-center gap-2 my-4">
          <input
            type="checkbox"
            checked={replaceExisting}
            disabled={importing}
            onChange={(event) => onReplaceChange(event.target.checked)}
          />
          Thay thế lịch cũ của nhân viên tại các ngày trong file
        </label>
        <div className="flex justify-end gap-3">
          <button disabled={importing} onClick={onClose} className="border rounded-xl px-4 py-2">
            Bỏ qua
          </button>
          <button
            disabled={importing}
            onClick={onImport}
            className="bg-blue-600 text-white rounded-xl px-4 py-2 disabled:opacity-50"
          >
            {importing ? "Đang nhập..." : "Nhập lịch"}
          </button>
        </div>
      </div>
    </div>
  );
}
