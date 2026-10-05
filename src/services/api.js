import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ============================================================
   AUTHENTICATION APIS
============================================================ */
export const authApi = {
  adminLogin: async (username, password) => {
    const res = await apiClient.post("/auth/admin-login/", {
      username,
      password,
    });
    return res.data;
  },

  studentLogin: async (username, password) => {
    const res = await apiClient.post("/auth/student-login/", {
      username,
      password,
    });
    return res.data;
  },

  staffLogin: async (username, password) => {
    const res = await apiClient.post("/auth/staff-login/", {
      username,
      password,
    });
    return res.data;
  },
};

/* ============================================================
   STUDENTS APIS
============================================================ */
export const studentsApi = {
  getAll: async () => {
    const res = await apiClient.get("/students/");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/students/${id}/`);
    return res.data;
  },

  create: async (studentData) => {
    const res = await apiClient.post("/students/", studentData);
    return res.data;
  },

  update: async (id, studentData) => {
    const res = await apiClient.put(`/students/${id}/`, studentData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/students/${id}/`);
    return res.data;
  },
};

/* ============================================================
   BUSES APIS
============================================================ */
export const busesApi = {
  getAll: async () => {
    const res = await apiClient.get("/buses/");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/buses/${id}/`);
    return res.data;
  },

  create: async (busData) => {
    const res = await apiClient.post("/buses/", busData);
    return res.data;
  },

  update: async (id, busData) => {
    const res = await apiClient.put(`/buses/${id}/`, busData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/buses/${id}/`);
    return res.data;
  },
};

/* ============================================================
   STAFF / DRIVERS APIS
============================================================ */
export const staffApi = {
  getAll: async () => {
    const res = await apiClient.get("/staff/");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/staff/${id}/`);
    return res.data;
  },

  create: async (staffData) => {
    const res = await apiClient.post("/staff/", staffData);
    return res.data;
  },

  update: async (id, staffData) => {
    const res = await apiClient.put(`/staff/${id}/`, staffData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/staff/${id}/`);
    return res.data;
  },
};

/* ============================================================
   TRAVEL REPORTS APIS
============================================================ */
export const travelReportsApi = {
  getAll: async () => {
    const res = await apiClient.get("/travel-reports/");
    return res.data;
  },

  create: async (reportData) => {
    const res = await apiClient.post("/travel-reports/", reportData);
    return res.data;
  },

  update: async (id, reportData) => {
    const res = await apiClient.put(`/travel-reports/${id}/`, reportData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/travel-reports/${id}/`);
    return res.data;
  },
};

/* ============================================================
   SEAT BOOKINGS APIS
============================================================ */
export const bookingsApi = {
  getAll: async (params = {}) => {
    const res = await apiClient.get("/bookings/", { params });
    return res.data;
  },

  create: async (bookingData) => {
    const res = await apiClient.post("/bookings/", bookingData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/bookings/${id}/`);
    return res.data;
  },
};

/* ============================================================
   BUS LOCATIONS (LIVE TRACKING) APIS
============================================================ */
export const busLocationsApi = {
  getAll: async () => {
    const res = await apiClient.get("/bus-locations/");
    return res.data;
  },

  update: async (busId, locationData) => {
    const res = await apiClient.put(`/bus-locations/${busId}/`, locationData);
    return res.data;
  },
};

/* ============================================================
   DASHBOARD STATS APIS
============================================================ */
export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get("/dashboard/stats/");
    return res.data;
  },
};

/* ============================================================
   LOGIN HISTORY APIS
============================================================ */
export const loginHistoryApi = {
  getAll: async () => {
    const res = await apiClient.get("/login-history/");
    return res.data;
  },
};

export default apiClient;
