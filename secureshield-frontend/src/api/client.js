import axios from "axios";

const LIVE_BACKEND_URL = "https://insurance-management-78ha.onrender.com/api";

// Force live Render API in production environments
const targetBaseURL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || LIVE_BACKEND_URL)
  : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

const api = axios.create({
  baseURL: targetBaseURL,
});

// Attach JWT token to every HTTP request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
