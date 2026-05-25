import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => API.get(url).then((res) => res.data);

export const API = axios.create({
  baseURL: "/api-proxy",
  headers: {
    // "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (requestUrl.includes("/auth/") && !requestUrl.includes("/auth/logout")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");

        return API(originalRequest);
      } catch (refreshError) {
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Fungsi untuk logout
export async function logout() {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.error("Logout gagal:", err);
  } finally {
    window.location.replace("/login");
  }
}
