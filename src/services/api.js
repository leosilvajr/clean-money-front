import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "").trim();
console.log("[Axios] baseURL =", baseURL); 

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[Axios error]", {
      url: `${err?.config?.baseURL || ""}${err?.config?.url || ""}`,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    return Promise.reject(err);
  }
);
