import React, { useState } from "react";
import {
  UserCircle2,
  Pencil,
  UserX,
  Smartphone,
} from "lucide-react";
 
export default function EmployeeDetail({
  employee,
   onUpdate,
}) {
  const [tab, setTab] =
    useState("info");

  const tabs = [
    {
      key: "info",
      label: "Thông tin",
    },
    {
      key: "schedule",
      label: "Lịch làm việc",
    },
    {
      key: "salary",
      label: "Thiết lập lương",
    },
    {
      key: "payroll",
      label: "Phiếu lương",
    },
//     {
//       key: "debt",
//       label: "Nợ và tạm ứng",
//     },
  ];

  {/* =========================
   SCHEDULE STATES
   ========================= */}

const [currentDate, setCurrentDate] = useState(new Date());

const getWeekDays = (date) => {
  const current = new Date(date);

  const day =
    current.getDay() === 0
      ? 7
      : current.getDay();

  const monday = new Date(current);

  monday.setDate(
    current.getDate() - day + 1
  );

  return Array.from(
    { length: 7 },
    (_, index) => {
      const d = new Date(monday);

      d.setDate(
        monday.getDate() + index
      );

      return d;
    }
  );
};

const weekDays =
  getWeekDays(currentDate);

const month =
  weekDays[0].getMonth() + 1;

const year =
  weekDays[0].getFullYear();

const weekNumber =
  Math.ceil(
    weekDays[0].getDate() / 7
  );

 

  return (
    <div className="border border-blue-500 border-t-0 bg-white">

      {/* TAB */}
      <div className="flex items-center gap-8 px-6 h-[48px] border-b border-gray-200 overflow-x-auto">

        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`h-full text-[14px] whitespace-nowrap border-b-2 font-medium cursor-pointer ${
              tab === item.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">

          <div className="w-[80px] h-[80px] rounded-full bg-blue-100 flex items-center justify-center">
            <UserCircle2
              size={60}
              className="text-blue-500"
            />
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-gray-800">
              {employee.name}
            </h2>

            <p className="mt-1 text-gray-500">
              Mã nhân viên:
              <span className="ml-1 text-gray-700">
                {employee.code}
              </span>
            </p>
          </div>
        </div>

        {/* TAB THÔNG TIN */}
{tab === "info" && (
  <>
    {/* HEADER */}
    {/* <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">

      <div className="w-[80px] h-[80px] rounded-full bg-blue-100 flex items-center justify-center">
        <UserCircle2 size={60} className="text-blue-500" />
      </div>

      <div>
        <h2 className="text-[20px] font-semibold text-gray-800">
          {employee.name}
        </h2>

        <p className="mt-1 text-gray-500">
          Mã nhân viên:
          <span className="ml-1 text-gray-700">
            {employee.code}
          </span>
        </p>
      </div>
    </div> */}

    {/* INFO */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">

      <InfoItem label="Số điện thoại" value={employee.phone} />

      <InfoItem label="Chi nhánh trả lương" value="Chi nhánh trung tâm" />

      <InfoItem label="Chi nhánh làm việc" value="Chi nhánh trung tâm" />

      <InfoItem label="Phòng ban" value="" />

      <InfoItem label="Chức danh" value="" />

      <InfoItem label="Tài khoản KiotViet" value="" />

      <InfoItem label="Số CMND/CCCD" value={employee.cccd} />

      <InfoItem label="Ngày sinh" value="" />

      <InfoItem label="Giới tính" value="" />

      <InfoItem label="Địa chỉ" value="" />

      <InfoItem label="Email" value="" />

      <InfoItem label="Facebook" value="" />

      <InfoItem label="Ngày bắt đầu làm việc" value="" />

      <InfoItem label="Mã chấm công" value={employee.timekeepingCode} />

      <InfoItem label="Thiết bị di động" value="" />
    </div>

    {/* NOTE */}
    <div className="mt-8 border-t border-gray-200 pt-5">

      <div className="flex items-center gap-2 text-gray-700">
        <Pencil size={16} />

        <span className="font-medium">
          Ghi chú:
        </span>
      </div>
    </div>

     {/* FOOTER */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

          <button className="flex items-center gap-2 text-red-600 font-medium hover:opacity-80 cursor-pointer">
            <UserX size={18} />
            Ngừng làm việc
          </button>

          <div className="flex flex-wrap items-center gap-3">

            <button
  onClick={() => onUpdate("info")}
  className="h-[40px] px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
>
  ✎ Cập nhật
</button>

            {/* <button className="h-[38px] px-4 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Smartphone size={16} />
              Lấy mã xác nhận
            </button> */}
          </div>
        </div>
  </>
)}

{/* TAB LỊCH LÀM VIỆC */}
{tab === "schedule" && (
  <div>

    {/* TOP BAR */}
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

      <div className="flex items-center gap-3">

  {/* MONTH */}
  {/* <div className="h-[40px] px-4 rounded-xl border border-gray-300 bg-white flex items-center text-sm font-medium">
    Th. {month}/{year}
  </div> */}

  {/* WEEK */}
  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">

    <button
      onClick={() => {
        const prev =
          new Date(currentDate);

        prev.setDate(
          prev.getDate() - 7
        );

        setCurrentDate(prev);
      }}
      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
    >
      ❮
    </button>

    <div className="px-4 font-medium whitespace-nowrap">
      Tuần {weekNumber} - Th. {month}/{year}
    </div>

    <button
      onClick={() => {
        const next =
          new Date(currentDate);

        next.setDate(
          next.getDate() + 7
        );

        setCurrentDate(next);
      }}
      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
    >
      ❯
    </button>

  </div>

</div>
    </div>

    {/* =========================
        TABLE
       ========================= */}

    <div className="overflow-x-auto">

      <table className="min-w-[1100px] w-full border border-gray-200 rounded-2xl overflow-hidden">

        {/* =========================
            HEAD
           ========================= */}

        <thead>
          <tr className="bg-white">

            <th className="w-[220px] border-b border-r border-gray-200 px-4 py-4 text-left text-sm font-semibold">
              Ca
            </th>

            {/*  
                thêm fallback [] tránh map undefined */}
            {weekDays.map((date) => (
  <th
    key={date.toISOString()}
    className="min-w-[110px] border-b border-r border-gray-200 px-3 py-4 text-center"
  >
    <div className="flex flex-col items-center">

      <span className="text-sm text-gray-700">
        {
          [
            "Chủ nhật",
            "Thứ hai",
            "Thứ ba",
            "Thứ tư",
            "Thứ năm",
            "Thứ sáu",
            "Thứ bảy",
          ][date.getDay()]
        }
      </span>

      <div className="mt-1 w-7 h-7 rounded-full flex items-center justify-center text-sm">
        {date.getDate()}
      </div>

    </div>
  </th>
))}
          </tr>
        </thead>

        {/* =========================
            BODY
           ========================= */}

        <tbody>

          {/* =========================
              CA SÁNG
             ========================= */}

          <tr>

            <td className="border-r border-b border-gray-200 px-4 py-3">

              <div className="font-semibold text-gray-800">
                Ca sáng
              </div>

              <div className="text-gray-500 text-sm mt-1">
                08:00 - 12:00
              </div>
            </td>

            {/*  
                thêm fallback [] */}
            {weekDays.map((date) => (
  <td
    key={date.toISOString()}
    className="border-r border-b border-gray-200 h-[48px] text-center"
  />
))}
          </tr>

          {/* =========================
              CA CHIỀU
             ========================= */}

          <tr>

            <td className="border-r border-gray-200 px-4 py-3">

              <div className="font-semibold text-gray-800">
                Ca chiều
              </div>

              <div className="text-gray-500 text-sm mt-1">
                13:00 - 17:00
              </div>
            </td>

            {/*  
                thêm fallback [] */}
            {weekDays.map((date) => (
  <td
    key={date.toISOString()}
    className="border-r border-gray-200 h-[48px] text-center"
  />
))}
          </tr>

          {/* =========================
    CẢ NGÀY
   ========================= */}

<tr>

  <td className="border-r border-gray-200 px-4 py-3 border-t border-gray-200">

    <div className="font-semibold text-gray-800">
      Cả ngày
    </div>

    <div className="text-gray-500 text-sm mt-1">
      08:00 - 17:00
    </div>
  </td>

  {weekDays.map((date) => (
  <td
    key={date.toISOString()}
    className="border-r border-gray-200 h-[48px] text-center border-t border-gray-200"
  />
))}
</tr>
        </tbody>
      </table>
    </div>

    {/* =========================
        FOOTER
       ========================= */}

    <div className="mt-6 flex justify-end">

      <button
onClick={() => onUpdate("info")}
  className="h-[40px] px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
>
  ✎ Cập nhật
</button>
    </div>
  </div>
)}

{/* TAB THIẾT LẬP LƯƠNG */}
{tab === "salary" && (
  <div>

    {/* CARD */}
    <div className="bg-white border border-gray-200 rounded-2xl p-5">

      {/* LOẠI LƯƠNG */}
      <div className="flex flex-wrap items-center gap-2 text-[15px] mb-5">

        <span className="font-semibold text-gray-800">
          Loại lương:
        </span>

        <span className="text-gray-700">
          Theo ca làm việc
        </span>
      </div>

      {/* MỨC LƯƠNG */}
      <div className="flex flex-wrap items-center gap-2 text-[15px]">

        <span className="font-semibold text-gray-800">
          Mức lương:
        </span>

        <span className="text-gray-700">
          400,000/ca
        </span>
      </div>
    </div>

    {/* FOOTER */}
    <div className="mt-6 flex justify-end">

      <button
  onClick={() => onUpdate("salary")}
  className="h-[40px] px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
>
  ✎ Cập nhật
</button>
    </div>
  </div>
)}
       
{/* TAB PHIẾU LƯƠNG */}
{tab === "payroll" && (
  <div>

    {/* FILTER */}
    <div className="mb-5">

      <select className="h-[40px] min-w-[180px] rounded-xl border border-gray-300 px-4 text-sm bg-white outline-none focus:border-blue-500">

        <option>
          Tất cả trạng thái
        </option>

        <option>
          Tạm tính
        </option>

        <option>
          Đã chốt lương
        </option>

        <option>
          Đã nghỉ
        </option>
      </select>
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">

      <table className="min-w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">

        {/* HEAD */}
        <thead className="bg-gray-50">

          <tr>

            <th className="px-4 py-4 text-left text-sm font-semibold border-b border-gray-200">
              Mã phiếu
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold border-b border-gray-200">
              Kỳ làm việc
            </th>

            <th className="px-4 py-4 text-right text-sm font-semibold border-b border-gray-200">
              Tổng lương
            </th>

            <th className="px-4 py-4 text-right text-sm font-semibold border-b border-gray-200">
              Đã trả
            </th>

            <th className="px-4 py-4 text-right text-sm font-semibold border-b border-gray-200">
              Còn cần trả
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold border-b border-gray-200">
              Trạng thái
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>

          <tr className="hover:bg-gray-50 transition border-b border-gray-200">

            {/* MÃ PHIẾU */}
            <td className="px-4 py-4 border-b border-gray-100">

              <button className="text-blue-600 hover:underline text-sm font-medium">
                PL000001
              </button>
            </td>

            {/* KỲ LÀM VIỆC */}
            <td className="px-4 py-4 border-b border-gray-100 text-sm text-gray-700">
              01/05/2026 - 31/05/2026
            </td>

            {/* TỔNG LƯƠNG */}
            <td className="px-4 py-4 border-b border-gray-100 text-sm text-right text-gray-700">
              0
            </td>

            {/* ĐÃ TRẢ */}
            <td className="px-4 py-4 border-b border-gray-100 text-sm text-right text-gray-700">
              0
            </td>

            {/* CÒN CẦN TRẢ */}
            <td className="px-4 py-4 border-b border-gray-100 text-sm text-right text-gray-700">
              0
            </td>

            {/* TRẠNG THÁI */}
            <td className="px-4 py-4 border-b border-gray-100">

              <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                Tạm tính
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* FOOTER */}
    <div className="mt-6 flex justify-end">

      <button className="h-[40px] px-5 rounded-xl border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 flex items-center gap-2">

        <span className="text-[16px]">
          ⭳
        </span>

        Xuất file
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="border-b border-gray-200 pb-3 min-h-[58px]">

      <p className="text-[13px] text-gray-500 mb-2">
        {label}
      </p>

      <p className="text-[15px] text-gray-800">
        {value || ""}
      </p>
    </div>
  );
}