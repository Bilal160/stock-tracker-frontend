import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  getIndices: () => api.get("/indices"),
  getIndexData: (symbol) => api.get(`/indices/${symbol}`),
  getHistoricalData: (symbol, from, to) =>
    api.get(`/indices/${symbol}/historical?from=${from}&to=${to}`),
  getAlerts: () => api.get("/alerts"),
  createAlert: (data) => api.post("/alerts", data),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  getStats: () => api.get("/stats"),
};
