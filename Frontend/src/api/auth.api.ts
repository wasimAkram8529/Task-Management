import { api } from "./axios";

export const registerUser = (data: any) => api.post("/auth/register", data);

export const loginUser = (data: any) => api.post("/auth/login", data);

export const getProfile = () => api.get("/auth/me");

export const getMe = () => api.get("/auth/me");

export const logout = () => api.post("/auth/logout");

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  api.post(`/auth/reset-password/${token}`, { password });
