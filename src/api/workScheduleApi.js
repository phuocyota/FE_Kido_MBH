import axiosInstance from "./axiosConfig";

const unwrapRequiredData = (response) => {
  const payload = response.data;

  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }

  throw new Error("Invalid API response: missing data field");
};

export const workScheduleApi = {
  // Get timesheet by date range
  getTimeSheet: async (from, to, employeeId) => {
    const params = { from, to };
    if (employeeId) params.employeeId = employeeId;
    const response = await axiosInstance.get("/work-schedules/timesheet", { params });
    return unwrapRequiredData(response);
  },

  // Get monthly schedule
  getMonthly: async (year, month, employeeId) => {
    const params = { year, month };
    if (employeeId) params.employeeId = employeeId;
    const response = await axiosInstance.get("/work-schedules/monthly", { params });
    return response.data.data || response.data;
  },

  // Get schedule by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/work-schedules/${id}`);
    return response.data.data || response.data;
  },

  // Create schedule
  create: async (data) => {
    const response = await axiosInstance.post("/work-schedules", data);
    return response.data.data || response.data;
  },

  // Create schedule weekly repeat
  createWeeklyRepeat: async (data) => {
    const response = await axiosInstance.post("/work-schedules/weekly-repeat", data);
    return response.data.data || response.data;
  },

  // Update schedule
  update: async (id, data) => {
    const response = await axiosInstance.put(`/work-schedules/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete schedule
  delete: async (id) => {
    await axiosInstance.delete(`/work-schedules/${id}`);
  },
};
