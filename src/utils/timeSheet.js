export const formatDateISO = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const getRepeatEndDate = (dateKey, weeks) => {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 7 * weeks - 1);
  return date.toISOString().slice(0, 10);
};

export const importColumns = ["employeeCode", "workDate", "shift", "startTime", "endTime", "note"];

export const parseScheduleImport = (rows, employees) => {
  if (!rows.length || rows.length > 500) throw new Error("File phải có từ 1 đến 500 dòng lịch");
  const employeeMap = new Map(employees.map((employee) => [String(employee.code), employee]));
  const keys = new Set();
  return rows.map((row, index) => {
    const fail = (message) => { throw new Error(`Dòng ${index + 2}: ${message}`); };
    const employeeCode = String(row.employeeCode ?? "").trim();
    const employee = employeeMap.get(employeeCode);
    if (!employee) fail(`Không tìm thấy nhân viên đang làm việc với mã ${employeeCode}`);
    const workDate = String(row.workDate ?? "").trim();
    const date = new Date(`${workDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== workDate) fail("workDate phải là ngày hợp lệ dạng YYYY-MM-DD");
    const shift = String(row.shift ?? "").trim();
    if (!["morning", "afternoon", "full", "custom"].includes(shift)) fail("shift phải là morning, afternoon, full hoặc custom");
    const key = `${employee.id}:${workDate}`;
    if (keys.has(key)) fail("Trùng nhân viên/ngày trong file");
    keys.add(key);
    const schedule = { employeeId: employee.id, workDate, shift, note: String(row.note ?? "").trim() };
    if (shift === "custom") {
      const startTime = String(row.startTime ?? "").trim();
      const endTime = String(row.endTime ?? "").trim();
      const validTime = /^([01]\d|2[0-3]):[0-5]\d$/;
      if (!validTime.test(startTime) || !validTime.test(endTime) || startTime >= endTime) fail("Ca custom cần startTime < endTime, định dạng HH:mm trong cùng ngày");
      Object.assign(schedule, { startTime, endTime });
    }
    return { ...schedule, employeeCode, employeeName: employee.name };
  });
};
