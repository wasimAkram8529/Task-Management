import { api } from "./axios";

export const createTask = (data: any) => api.post("/tasks/create-task", data);

export const getTasks = (params?: any) => api.get("/tasks", { params });

export const getDashboard = () => api.get("/tasks/dashboard");

export const updateTask = (id: string, data: any) =>
  api.patch(`/tasks/${id}`, data);

export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);

export const fetchTaskLogs = (taskId: string) =>
  api.get(`/tasks/${taskId}/logs`).then((res) => res.data);
