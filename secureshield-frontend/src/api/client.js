import axios from "axios";

// Construct absolute base URL to prevent 'Failed to construct URL' error in browsers
const getBaseURL = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return "https://insurance-management-78ha.onrender.com/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Attach JWT token to every HTTP request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
