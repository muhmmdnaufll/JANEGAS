import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("janegas_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (username, password) => api.post("/auth/login", { username, password }),
};
export const dashboardService = { getSummary: () => api.get("/dashboard/summary") };
export const manureService = {
  getAll: (limit = 200) => api.get(`/manure/?limit=${limit}`),
  create: (data) => api.post("/manure/", data),
  update: (id, data) => api.put(`/manure/${id}`, data),
  remove: (id) => api.delete(`/manure/${id}`),
};
export const biogasService = {
  getAll: (limit = 200) => api.get(`/biogas/?limit=${limit}`),
  create: (data) => api.post("/biogas/", data),
  update: (id, data) => api.put(`/biogas/${id}`, data),
  remove: (id) => api.delete(`/biogas/${id}`),
};
export const fertilizerService = {
  getAll: (limit = 200) => api.get(`/fertilizer/?limit=${limit}`),
  create: (data) => api.post("/fertilizer/", data),
  update: (id, data) => api.put(`/fertilizer/${id}`, data),
  remove: (id) => api.delete(`/fertilizer/${id}`),
};
export const memberService = {
  getAll: (member_type) => api.get(`/members/${member_type ? "?member_type=" + member_type : ""}`),
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
export default api;