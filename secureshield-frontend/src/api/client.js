import axios from "axios";

// Connect to live Render backend API with local fallback
const LIVE_BACKEND_API = "https://insurance-management-78ha.onrender.com/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || LIVE_BACKEND_API,
});

// Attach JWT token to every HTTP request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
