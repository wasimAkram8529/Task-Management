import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // HttpOnly cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const publicPages = [
      "/forgot-password",
      "/reset-password",
      "/login",
      "/register",
    ];
    const isPublicPage = publicPages.some((path) =>
      globalThis.location.pathname.includes(path)
    );

    if (status === 401 && !isPublicPage) {
      toast.error("Your session has expired. Please login again.");

      localStorage.removeItem("token");
      globalThis.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
