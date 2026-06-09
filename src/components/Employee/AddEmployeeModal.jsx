import React, {
  useRef,
  useState,
  useEffect,
} from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { workScheduleApi, employeeApi, branchApi } from "../../api";

const MONTH_NAMES = [
  "Th. 1", "Th. 2", "Th. 3", "Th. 4", "Th. 5", "Th. 6",
  "Th. 7", "Th. 8", "Th. 9", "Th. 10", "Th. 11", "Th. 12"
];

const generateWeeksFromScheduleData = (scheduleData, month, year) => {
  // Group schedule data by week
  const weeks = {};
  
  scheduleData.forEach(item => {
    const date = new Date(item.workDate);
    const weekNum = Math.ceil(date.getDate() / 7);
    
    if (!weeks[weekNum]) {
      weeks[weekNum] = [];
    }
    
    const dayNames = ["CN", "Th. 2", "Th. 3", "Th. 4", "Th. 5", "Th. 6", "Th. 7"];
    
    weeks[weekNum].push({
      day: dayNames[date.getDay()],
      date: String(date.getDate()).padStart(2, '0'),
      shift: item.shift,
    });
  });
  
  // Convert to array format expected by UI
  return Object.keys(weeks).map(weekNum => ({
    week: parseInt(weekNum),
    days: weeks[weekNum]
  }));
};

export default function AddEmployeeModal({
  open,
  onClose,
  defaultTab = "info",
  isEdit = false,
  employee = null,
  onSuccess,
}) {
  const [openJob, setOpenJob] = useState(false);
  const [openPersonal, setOpenPersonal] = useState(true);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    timekeepingCode: "",
    fullName: "",
    phone: "",
    cccd: "",
    debt: 0,
    note: "",
    status: "working",
  });

  const fileRef = useRef();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, open]);

  useEffect(() => {
    if (!open) return;

    const loadBranches = async () => {
      try {
        const data = await branchApi.getAll();
        setBranches(Array.isArray(data) ? data : []);
      } catch {
        setBranches([]);
      }
    };

    loadBranches();
  }, [open]);

  // Load employee data when editing
  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        code: employee.code || "",
        timekeepingCode: employee.timekeepingCode || "",
        fullName: employee.fullName || employee.name || "",
        phone: employee.phone || "",
        cccd: employee.cccd || "",
        debt: employee.debt || 0,
        note: employee.note || "",
        status: employee.status || "working",
      });
    } else {
      setFormData({
        code: "",
        timekeepingCode: "",
        fullName: "",
        phone: "",
        cccd: "",
        debt: 0,
        note: "",
        status: "working",
      });
    }
  }, [isEdit, employee, open]);

  // Fetch schedule data when month changes
  useEffect(() => {
    if (open && isEdit && employee) {
      fetchScheduleData();
    }
  }, [open, currentMonth, currentYear, isEdit, employee]);

  const fetchScheduleData = async () => {
    if (!employee) return;
    
    setLoadingSchedule(true);
    try {
      const data = await workScheduleApi.getMonthly(currentYear, currentMonth, employee.id);
      setScheduleData(data);
    } catch (error) {
      // Silently fail - schedule may not exist yet
      setScheduleData([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // chọn ảnh 
  const handleChooseImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSave = async () => {
    if (!formData.fullName) {
      toast.error("Vui lòng nhập tên nhân viên");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && employee) {
        await employeeApi.update(employee.id, formData);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await employeeApi.create(formData);
        toast.success("Thêm nhân viên thành công");
      }
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const weeks = generateWeeksFromScheduleData(scheduleData, currentMonth, currentYear);
  const currentWeekData = weeks.find(w => w.week === currentWeek) || { days: [] };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2 md:p-4">

      {/* MODAL */}
      <div className="w-full max-w-[1150px] bg-[#f5f5f5] rounded-[28px] overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="bg-white px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">

          <h2 className="text-[20px] md:text-[22px] font-semibold text-gray-800">
  {isEdit ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
</h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-3 md:p-5 max-h-[82vh] overflow-y-auto">

           
          {/* TAB */}
<div className="flex items-center gap-7 border-b border-gray-200 mb-5">

  <button
    onClick={() => setActiveTab("info")}
    className={`h-[42px] text-[14px] font-medium border-b-2 ${
      activeTab === "info"
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500"
    }`}
  >
    Thông tin
  </button>

  <button
    onClick={() => setActiveTab("salary")}
    className={`h-[42px] text-[14px] font-medium border-b-2 ${
      activeTab === "salary"
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500"
    }`}
  >
    Thiết lập lương
  </button>
</div>

{activeTab === "info" && (
  <>
  
     {/* THÔNG TIN KHỞI TẠO */}
          <div className="bg-white rounded-2xl p-4 md:p-5 mb-4">

            <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-800 mb-5">
              Thông tin khởi tạo
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-5">

              {/* LEFT */}
              <div className="space-y-4">

                <div>
                  <label className="block mb-2 text-[13px] font-medium text-gray-700">
                    Tên nhân viên
                  </label>

                  <input
                    type="text"
                    placeholder="Bắt buộc"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[13px] font-medium text-gray-700">
                    Mã nhân viên
                  </label>

                  <input
                    type="text"
                    placeholder="Tự động"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[13px] font-medium text-gray-700">
                    Số điện thoại
                  </label>

                  <input
                    type="text"
                    placeholder="Bắt buộc"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* IMAGE */}
<div className="flex justify-center lg:justify-end">

  <div className="relative w-[180px] h-[180px] rounded-full border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">

    {/* INPUT FILE */}
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      onChange={handleChooseImage}
      className="hidden"
    />

    {/* PREVIEW */}
    {preview ? (
      <img
        src={preview}
        alt="preview"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex flex-col items-center justify-center text-center p-4">

        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm flex items-center gap-2 cursor-pointer"
        >
          <Upload size={16} />
          Thêm ảnh
        </button>

        <p className="mt-4 text-[12px] text-gray-500 leading-5">
          Mỗi ảnh không vượt quá 2Mb
        </p>
      </div>
    )}

    {/* CHANGE IMAGE BUTTON */}
    {preview && (
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white border border-gray-300 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 cursor-pointer"
      >
        Đổi ảnh
      </button>
    )}
  </div>
</div>
            </div>
          </div>

         {/* LỊCH LÀM VIỆC */}
<div className="bg-white rounded-2xl overflow-hidden mb-4">

  {/* HEADER */}
  <div className="px-5 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">

    <h3 className="text-[16px] md:text-[17px] font-semibold text-gray-800">
      Lịch làm việc
    </h3>

    {/* CONTROL */}
    <div className="flex items-center gap-3">

      {/* MONTH */}
      <select
        value={currentMonth}
        onChange={(e) => {
          setCurrentMonth(Number(e.target.value));
          setCurrentWeek(1);
        }}
        className="h-[38px] rounded-xl border border-gray-300 px-3 text-sm bg-white"
      >
        {MONTH_NAMES.map((monthName, index) => (
          <option key={index + 1} value={index + 1}>
            {monthName} {currentYear}
          </option>
        ))}
      </select>

      {/* WEEK */}
      <div className="h-[38px] rounded-xl border border-gray-300 bg-white flex items-center overflow-hidden">

        <button
          onClick={() =>
            setCurrentWeek((prev) =>
              prev > 1 ? prev - 1 : prev
            )
          }
          className="w-[36px] h-full hover:bg-gray-50"
        >
          ❮
        </button>

        <div className="px-4 text-sm font-medium">
          Tuần {currentWeek}
        </div>

        <button
          onClick={() =>
            setCurrentWeek((prev) =>
              prev < 4 ? prev + 1 : prev
            )
          }
          className="w-[36px] h-full hover:bg-gray-50"
        >
          ❯
        </button>
      </div>
    </div>
  </div>

  {/* BODY */}
  <div className="p-5 overflow-x-auto">

    {loadingSchedule && (
      <div className="text-center py-8 text-gray-400">
        Đang tải lịch làm việc...
      </div>
    )}

    {!loadingSchedule && (
    <div className="min-w-[980px] grid grid-cols-7 gap-4">

      {currentWeekData?.days?.map((item, index) => (

        <div
          key={`${item.day}-${item.date}-${index}`}
          className="rounded-2xl border border-gray-200 p-4"
        >

          {/* TOP */}
          <div className="mb-4">

            <h4 className="text-[14px] font-semibold text-gray-800">
              {item.day}
            </h4>

            <p className="text-[12px] text-gray-500 mt-1">
              Ngày {item.date}
            </p>
          </div>

          {/* SHIFT */}
          <div className="space-y-3">

            {/* CA SÁNG */}
            <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-blue-400">

              <input
                type="radio"
                name={`${item.day}-shift`}
                checked={
                  item.shift === "morning"
                }
                readOnly
                className="mt-1"
              />

              <div>
                <p className="text-sm font-medium">
                  Ca sáng
                </p>

                <p className="text-[12px] text-gray-500 mt-1">
                  08:00 - 12:00
                </p>
              </div>
            </label>

            {/* CA CHIỀU */}
            <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-blue-400">

              <input
                type="radio"
                name={`${item.day}-shift`}
                checked={
                  item.shift === "afternoon"
                }
                readOnly
                className="mt-1"
              />

              <div>
                <p className="text-sm font-medium">
                  Ca chiều
                </p>

                <p className="text-[12px] text-gray-500 mt-1">
                  13:00 - 17:00
                </p>
              </div>
            </label>

            {/* FULL */}
            <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-blue-400">

              <input
                type="radio"
                name={`${item.day}-shift`}
                checked={
                  item.shift === "full"
                }
                readOnly
                className="mt-1"
              />

              <div>
                <p className="text-sm font-medium">
                  Cả ngày
                </p>

                <p className="text-[12px] text-gray-500 mt-1">
                  08:00 - 17:00
                </p>
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
    )}
  </div>
</div>

          {/* THÔNG TIN CÔNG VIỆC */}
          <div className="bg-white rounded-2xl mb-4 overflow-hidden">

            <button
              onClick={() =>
                setOpenJob(!openJob)
              }
              className="w-full px-5 py-5 flex items-center justify-between"
            >
              <span className="text-[16px] md:text-[17px] font-semibold text-gray-800">
                Thông tin công việc
              </span>

              {openJob ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {openJob && (
              <div className="px-5 pb-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Chi nhánh
                    </label>

                    <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="">
                        Chọn chi nhánh
                      </option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Chức vụ
                    </label>

                    <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">
                      <option>
                        Nhân viên
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Ngày vào làm
                    </label>

                    <div className="relative">

                      <input
                        type="date"
                        className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                      />

                      <CalendarDays
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Trạng thái
                    </label>

                    <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">
                      <option>
                        Đang làm việc
                      </option>

                      <option>
                        Đã nghỉ
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* THÔNG TIN CÁ NHÂN */}
          <div className="bg-white rounded-2xl overflow-hidden">

            <button
              onClick={() =>
                setOpenPersonal(
                  !openPersonal
                )
              }
              className="w-full px-5 py-5 flex items-center justify-between"
            >
              <span className="text-[16px] md:text-[17px] font-semibold text-gray-800">
                Thông tin cá nhân
              </span>

              {openPersonal ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {openPersonal && (
              <div className="px-5 pb-5">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* CCCD */}
                  <div className="lg:col-span-2">

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Số CMND/CCCD
                    </label>

                    <input
                      type="text"
                      className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* DATE */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Ngày sinh
                    </label>

                    <input
                      type="date"
                      className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* GENDER */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Giới tính
                    </label>

                    <div className="h-[44px] flex items-center gap-5 text-sm">

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                        />
                        Nam
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                        />
                        Nữ
                      </label>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="lg:col-span-4">

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Địa chỉ
                    </label>

                    <input
                      type="text"
                      className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* CITY */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Tỉnh/Thành phố
                    </label>

                    <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">
                      <option>
                        Chọn Tỉnh/Thành phố
                      </option>
                    </select>
                  </div>

                  {/* WARD */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Xã/Phường/Đặc khu
                    </label>

                    <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">
                      <option>
                        Chọn Xã/Phường/Đặc khu
                      </option>
                    </select>
                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Email
                    </label>

                    <input
                      type="email"
                      className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* FACEBOOK */}
                  <div>

                    <label className="block mb-2 text-[13px] font-medium text-gray-700">
                      Facebook
                    </label>

                    <input
                      type="text"
                      className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

  </>
)}

{/* TAB LƯƠNG */}
{activeTab === "salary" && (
  <div className="space-y-4">

    
    {/* LƯƠNG CHÍNH */}
<div className="bg-white rounded-2xl overflow-hidden">

  {/* HEADER */}
  <div className="px-5 py-5 border-b border-gray-200">
    <h3 className="text-[16px] md:text-[17px] font-semibold text-gray-800">
      Lương chính
    </h3>
  </div>

  {/* BODY */}
  <div className="divide-y divide-gray-200">

    {/* LOẠI LƯƠNG */}
    <div className="p-5 grid grid-cols-1 md:grid-cols-[120px_360px] gap-4 items-center">

      <label className="text-[13px] font-medium text-gray-700">
        Loại lương
      </label>

      <div className="flex items-center gap-3">

        <select className="w-full h-[44px] rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 bg-white">

          <option>
            Theo ca làm việc
          </option>

          <option>
            Theo giờ làm việc
          </option>

          <option>
            Theo ngày công chuẩn
          </option>

          <option>
            Cố định
          </option>
        </select>

        <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 text-[11px] flex items-center justify-center">
          i
        </div>
      </div>
    </div>

    {/* MỨC LƯƠNG */}
    <div className="p-5 grid grid-cols-1 md:grid-cols-[120px_360px] gap-4 items-center">

      <label className="text-[13px] font-medium text-gray-700">
        Mức lương
      </label>

      <div className="relative">

        <input
          type="text"
          placeholder="Nhập mức lương"
          className="w-full h-[44px] rounded-xl border border-gray-300 pl-4 pr-16 text-sm outline-none focus:border-blue-500"
        />         
      </div>
    </div>
  </div>
</div>

   
  </div>
)}

         


        </div>

        {/* FOOTER */}
        <div className="bg-white border-t border-gray-200 px-5 py-4 flex items-center justify-end gap-3">

          <button
            onClick={onClose}
            disabled={saving}
            className="h-[40px] px-5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Bỏ qua
          </button>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="h-[40px] px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
