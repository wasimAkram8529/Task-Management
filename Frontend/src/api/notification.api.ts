import { api } from "./axios";

export const getNotifications = () => api.get("/notifications");
export const readNotifications = () => api.patch("/notifications/read");
