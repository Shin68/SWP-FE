import axios from "axios";

// Cấu hình axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Đổi nếu backend của bạn khác port
});

// Thêm token vào mọi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
