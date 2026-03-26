import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const normalizedApiUrl = envApiUrl.replace(/\/+$/, '');
const baseURL = normalizedApiUrl
  ? normalizedApiUrl.endsWith('/api')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neocart_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export default api;
