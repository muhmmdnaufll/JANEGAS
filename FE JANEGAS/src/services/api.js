import axios from "axios";

const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").trim();
  url = url.replace(/\/+$/, "");
  
  // Auto-prepend https:// or http:// if protocol is missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const BASE_URL = getBaseUrl();
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("janegas_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const parseLimit = (param, defaultLimit = 200) => {
  if (typeof param === "object" && param !== null) {
    return param.limit ?? defaultLimit;
  }
  return typeof param === "number" || typeof param === "string" ? param : defaultLimit;
};

const parseMemberType = (param) => {
  if (typeof param === "object" && param !== null) {
    return param.member_type || "";
  }
  return typeof param === "string" ? param : "";
};

export const authService = {
  login: (username, password) => api.post("/auth/login", { username, password }),
  getCurrentUser: () => api.get("/auth/users/me"),
};
export const dashboardService = { getSummary: () => api.get("/dashboard/summary") };
export const manureService = {
  getAll: (param = 200) => api.get(`/manure/?limit=${parseLimit(param, 200)}`),
  create: (data) => api.post("/manure/", data),
  update: (id, data) => api.put(`/manure/${id}`, data),
  remove: (id) => api.delete(`/manure/${id}`),
};
export const biogasService = {
  getAll: (param = 200) => api.get(`/biogas/?limit=${parseLimit(param, 200)}`),
  create: (data) => api.post("/biogas/", data),
  update: (id, data) => api.put(`/biogas/${id}`, data),
  remove: (id) => api.delete(`/biogas/${id}`),
};
export const fertilizerService = {
  getAll: (param = 200) => api.get(`/fertilizer/?limit=${parseLimit(param, 200)}`),
  create: (data) => api.post("/fertilizer/", data),
  update: (id, data) => api.put(`/fertilizer/${id}`, data),
  remove: (id) => api.delete(`/fertilizer/${id}`),
};
export const memberService = {
  getAll: (param) => {
    const type = parseMemberType(param);
    return api.get(`/members/${type ? "?member_type=" + encodeURIComponent(type) : ""}`);
  },
  create: (data) => api.post("/members/", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  remove: (id) => api.delete(`/members/${id}`),
};
export const maintenanceService = {
  getAll: () => api.get("/maintenance/"),
  create: (data) => api.post("/maintenance/", data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  remove: (id) => api.delete(`/maintenance/${id}`),
};
export const forecastService = {
  getForecast: () => api.get("/forecast/predict"),
  chat: (message) => api.post("/forecast/chat", { message }),
};
export default api;