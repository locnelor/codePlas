import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URI
const request = axios.create({
  baseURL,
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 响应错误处理
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default request;