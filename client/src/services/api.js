import axios from "axios";

// 👉 Your live backend URL
const LIVE_API = "https://neocart-pure.onrender.com";

// 👉 Get env URL (for Vercel)
const envApiUrl = import.meta.env.VITE_API_URL?.trim() || "";

// 👉 Normalize URL
const normalizedApiUrl = envApiUrl
  ? envApiUrl.replace(/\/+$/, "")
  : LIVE_API;

// 👉 Ensure /api at end
const baseURL = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("neocart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default api;
