import { api } from "./axios";

export const getUsers = () => api.get("/users");

export const updateProfile = (data: { name: string }) =>
  api.patch("/users/me", data);
